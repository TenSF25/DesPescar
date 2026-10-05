import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/Button';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { Card } from '@/features/profile/components/FormParts';
import { useCheckoutStore } from '@/store/useCheckoutStore';
import { useFlightStore } from '@/store/useFlightStore';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';
import { isTrustedPaymentUrl } from '@/utils/isTrustedPaymentUrl';
import { omitKey } from '@/utils/omitKey';
import { emptyCard, type CardData } from '../card.types';
import { validateCard } from '../card.validation';
import type { FieldErrors } from '../checkout.types';
import type { BookingDetail } from '../bookings.types';
import { CardForm } from '../components/checkout/CardForm';
import { MercadoPagoNotice } from '../components/checkout/MercadoPagoNotice';
import { PaymentMethodList, type PaymentMethodId } from '../components/checkout/PaymentMethodList';
import { CheckoutSummary } from '../components/checkout/CheckoutSummary';
import { useBooking } from '../hooks/useBooking';
import { useCheckoutData } from '../hooks/useCheckoutData';
import { cancelBooking, getBooking } from '../services/bookingsService';

const formatCountdown = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

/** Paso 2 de la compra: revisión de los datos y pago en Mercado Pago. */
export const PaymentPage = () => {
  const navigate = useNavigate();
  const { startPayment, isLoading, error } = useBooking();
  const { bookingId, passengerCount, departureFlight, returnFlight, departureFare } =
    useCheckoutData();
  const checkout = useCheckoutStore();
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [accepted, setAccepted] = useState(false);
  // Solo informa la elección: todos los medios se completan en el checkout de Mercado Pago.
  const [method, setMethod] = useState<PaymentMethodId>('credit');
  // Datos de la tarjeta: solo en memoria (nunca al store ni a localStorage) y se descartan al salir.
  const [card, setCard] = useState<CardData>(emptyCard);
  const [cardErrors, setCardErrors] = useState<FieldErrors>({});
  const cardSectionRef = useRef<HTMLDivElement>(null);
  const [payError, setPayError] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  // Al cancelar se vacía el store: sin esta marca, la guarda de abajo mandaría a elegir asientos.
  const leavingRef = useRef(false);

  // Sin reserva se vuelve a elegir asientos; sin datos de pasajeros, al paso anterior.
  const missingCheckout = checkout.bookingId !== bookingId || !checkout.contact;
  useEffect(() => {
    if (leavingRef.current) return;
    if (!bookingId) navigate('/booking/seats', { replace: true });
    else if (missingCheckout) navigate('/booking/checkout', { replace: true });
  }, [bookingId, missingCheckout, navigate]);

  useEffect(() => {
    if (!bookingId) return;

    let active = true;
    getBooking(bookingId)
      .then((detail) => {
        if (!active) return;
        if (detail.estadoGeneral === 'CONFIRMADA') {
          navigate('/booking/payment/success', { replace: true });
          return;
        }
        setBooking(detail);
        setSecondsLeft(detail.segundosRestantes);
      })
      .catch((err) => {
        if (active) setLoadError(getApiErrorMessage(err, 'No se pudo cargar tu reserva.'));
      });

    return () => {
      active = false;
    };
  }, [bookingId, navigate]);

  // Cuenta regresiva: la reserva (y los asientos) se liberan al vencer el tiempo.
  useEffect(() => {
    if (secondsLeft === null || secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((current) => (current ?? 1) - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const expired =
    booking?.estadoGeneral === 'EXPIRADA' ||
    booking?.estadoGeneral === 'CANCELADA' ||
    (secondsLeft !== null && secondsLeft <= 0 && booking?.segundosRestantes !== null);

  const updateCard = <K extends keyof CardData>(field: K, value: CardData[K]) => {
    setCard((current) => ({ ...current, [field]: value }));
    setCardErrors((current) => omitKey(current, field));
  };

  const handlePay = async () => {
    if (!bookingId) return;
    setPayError(null);

    if (method !== 'mercadopago') {
      const errors = validateCard(card, method === 'credit');
      setCardErrors(errors);
      if (Object.keys(errors).length > 0) {
        requestAnimationFrame(() => {
          const invalid =
            cardSectionRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
          invalid?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          invalid?.focus({ preventScroll: true });
        });
        return;
      }
    }

    const result = await startPayment(bookingId);
    if (!result.success) {
      setPayError(result.error);
      return;
    }
    if (!isTrustedPaymentUrl(result.paymentUrl)) {
      setPayError('El enlace de pago recibido no es válido. Intentá de nuevo más tarde.');
      return;
    }
    window.location.assign(result.paymentUrl);
  };

  const handleCancel = async () => {
    if (!bookingId) return;
    if (!window.confirm('¿Cancelar la reserva? Los asientos se van a liberar.')) return;

    setIsCancelling(true);
    setPayError(null);
    try {
      await cancelBooking(bookingId);
      leavingRef.current = true;
      useFlightStore.getState().clearSearch();
      useCheckoutStore.getState().reset();
      navigate('/', { replace: true });
    } catch (err) {
      setPayError(getApiErrorMessage(err, 'No se pudo cancelar la reserva. Intentá de nuevo.'));
      setIsCancelling(false);
    }
  };

  if (!bookingId || missingCheckout) return null;

  const contact = checkout.contact;
  const seatsByIndex = booking?.asientos.map((seat) => seat.asientoIda) ?? [];

  return (
    <SectionContainer>
      <div className="flex flex-col gap-1">
        <h1 className="text-secondary text-2xl font-bold">Revisá y pagá</h1>
        <p className="text-sm text-[#44474E]">
          Controlá que los datos estén bien antes de pagar: no se pueden cambiar después de la
          compra.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="flex flex-col gap-6">
          <Card title="Pasajeros" icon="groups">
            <ul className="flex flex-col gap-3 sm:col-span-2">
              {checkout.passengers.map((passenger, index) => (
                <li
                  key={index}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-black/10 p-3"
                >
                  <div className="flex flex-col">
                    <span className="text-secondary font-semibold">
                      {passenger.nombre} {passenger.apellido}
                    </span>
                    <span className="text-sm text-gray-600">
                      {passenger.tipoDocumento} {passenger.numeroDocumento}
                    </span>
                  </div>
                  {seatsByIndex[index] && (
                    <span className="bg-secondary/10 text-secondary rounded-full px-3 py-1 text-xs font-bold">
                      Asiento {seatsByIndex[index]}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </Card>

          <Card title="Contacto" icon="mail">
            <div className="flex flex-col gap-1 sm:col-span-2">
              <span className="text-sm text-gray-600">Los vouchers se envían a</span>
              <span className="text-secondary font-semibold">{contact?.email}</span>
            </div>
            <div className="flex flex-col gap-1 sm:col-span-2">
              <span className="text-sm text-gray-600">Teléfonos de contacto</span>
              {contact?.telefonos.map((tel, index) => (
                <span key={index} className="text-secondary font-semibold">
                  {tel.tipo}: {tel.codigo} {tel.numero}
                </span>
              ))}
            </div>
            <p className="text-sm text-gray-600 sm:col-span-2">
              ¿Algo está mal? Los datos de los pasajeros ya quedaron en la reserva y no se pueden
              cambiar: cancelala y empezá de nuevo.
            </p>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isCancelling}
              className="text-alert w-fit cursor-pointer text-sm font-bold underline disabled:opacity-50 sm:col-span-2"
            >
              {isCancelling ? 'Cancelando…' : 'Cancelar la reserva y empezar de nuevo'}
            </button>
          </Card>

          <Card title="¿Cómo deseás pagar?" icon="payments">
            <PaymentMethodList value={method} onChange={setMethod} />
            <div ref={cardSectionRef} className="contents">
              {method === 'mercadopago' ? (
                <MercadoPagoNotice />
              ) : (
                <CardForm
                  card={card}
                  errors={cardErrors}
                  credit={method === 'credit'}
                  total={booking ? booking.montoTotal : null}
                  currency={booking?.moneda}
                  onChange={updateCard}
                />
              )}
            </div>
          </Card>
        </div>

        <CheckoutSummary
          departureFlight={departureFlight}
          returnFlight={returnFlight}
          passengerCount={passengerCount}
          fareName={departureFare?.name}
          total={booking ? booking.montoTotal : null}
          currency={booking?.moneda}
          totalLabel="Total a pagar"
        >
          {secondsLeft !== null && !expired && (
            <p className="flex items-center gap-2 rounded-md bg-amber-50 p-3 text-sm font-semibold text-amber-800">
              <span className="material-symbols-outlined text-[20px]!">timer</span>
              Tu reserva se mantiene {formatCountdown(secondsLeft)} minutos
            </p>
          )}
          {expired && (
            <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-700">
              La reserva venció y los asientos se liberaron. Hacé una nueva búsqueda para volver a
              reservar.
            </p>
          )}
          {(loadError || payError || error) && (
            <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-700">
              {loadError || payError || error}
            </p>
          )}

          <label className="flex cursor-pointer items-start gap-3 text-sm text-[#44474E]">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="accent-primary mt-0.5 h-4 w-4 cursor-pointer"
            />
            <span>Acepto los términos y condiciones y la política de cancelación.</span>
          </label>

          {expired ? (
            <Button variant="secondary" className="h-12" onClick={() => navigate('/')}>
              Buscar otro vuelo
            </Button>
          ) : (
            <Button
              variant="secondary"
              className="h-12"
              disabled={!booking || !accepted || isLoading}
              onClick={handlePay}
            >
              {isLoading ? 'Preparando pago…' : 'Continuar al pago seguro'}
            </Button>
          )}
        </CheckoutSummary>
      </div>
    </SectionContainer>
  );
};
