import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button } from '@/components/ui/Button';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { useAuthStore } from '@/store/useAuthStore';
import { useCheckoutStore } from '@/store/useCheckoutStore';
import { useFlightStore } from '@/store/useFlightStore';
import { useReservationsStore } from '@/features/reservations/store/useReservationsStore';
import { bookingToReservation } from '@/features/reservations/bookingToReservation';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';
import type { BookingStatus } from '../bookings.types';
import { getBooking, getFlightByNumber } from '../services/bookingsService';

/** Resultado que Mercado Pago informa en la URL de retorno (back_urls). */
export type PaymentReturn = 'success' | 'pending' | 'failure';

type ViewState = 'checking' | 'confirmed' | 'processing' | 'failed' | 'expired' | 'error';

const POLL_INTERVAL_MS = 3000;
const MAX_ATTEMPTS = 10;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const MESSAGES: Record<ViewState, { icon: string; title: string; text: string }> = {
  checking: {
    icon: 'hourglass_top',
    title: 'Confirmando tu pago…',
    text: 'Estamos esperando la confirmación de Mercado Pago. No cierres esta página.',
  },
  confirmed: {
    icon: 'check_circle',
    title: '¡Reserva confirmada!',
    text: 'Tu pago se acreditó y tu vuelo quedó reservado.',
  },
  processing: {
    icon: 'schedule',
    title: 'Tu pago se está procesando',
    text: 'Todavía no recibimos la confirmación. Puede demorar unos minutos: verificá de nuevo en un rato.',
  },
  failed: {
    icon: 'cancel',
    title: 'No se pudo completar el pago',
    text: 'El pago fue rechazado o cancelado. Tu reserva sigue retenida unos minutos: podés intentarlo de nuevo.',
  },
  expired: {
    icon: 'timer_off',
    title: 'La reserva venció',
    text: 'Pasó el tiempo para completar la compra y los asientos se liberaron. Empezá una nueva búsqueda.',
  },
  error: {
    icon: 'error',
    title: 'No pudimos verificar tu reserva',
    text: 'Ocurrió un error al consultar el estado de tu pago.',
  },
};

const isFinalFailure = (status: BookingStatus) => status === 'EXPIRADA' || status === 'CANCELADA';

export const PaymentResultPage = ({ result }: { result: PaymentReturn }) => {
  const navigate = useNavigate();
  const email = useAuthStore((state) => state.user?.email);
  const { addUpcomingFlight } = useReservationsStore();
  // Se captura al montar: al confirmar se limpia el store pero la página sigue usando este id.
  const [bookingId] = useState(() => useFlightStore.getState().bookingId);
  const [view, setView] = useState<ViewState>(result === 'failure' ? 'failed' : 'checking');
  const [detail, setDetail] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (result === 'failure' || !bookingId) return;

    let active = true;

    const verify = async () => {
      try {
        for (let i = 0; i < MAX_ATTEMPTS; i++) {
          const booking = await getBooking(bookingId);
          if (!active) return;

          if (booking.estadoGeneral === 'CONFIRMADA') {
            const flight = await getFlightByNumber(booking.vueloCodigo);
            if (!active) return;
            addUpcomingFlight(bookingToReservation(booking, flight, email));
            useFlightStore.getState().clearSearch();
            useCheckoutStore.getState().reset();
            setView('confirmed');
            return;
          }

          if (isFinalFailure(booking.estadoGeneral)) {
            setView('expired');
            return;
          }

          await wait(POLL_INTERVAL_MS);
          if (!active) return;
        }
        setView('processing');
      } catch (error) {
        if (!active) return;
        setDetail(getApiErrorMessage(error, ''));
        setView('error');
      }
    };

    verify();

    return () => {
      active = false;
    };
  }, [result, bookingId, attempt, email, addUpcomingFlight]);

  const retry = () => {
    setView('checking');
    setDetail('');
    setAttempt((current) => current + 1);
  };

  if (!bookingId && view !== 'confirmed') {
    return (
      <SectionContainer className="items-center text-center">
        <h1 className="text-secondary text-2xl font-bold">No encontramos una reserva en curso</h1>
        <p className="text-gray-600">Si ya pagaste, revisá tu correo o consultá en Mis reservas.</p>
        <Link to="/" className="text-secondary font-semibold underline">
          Volver al inicio
        </Link>
      </SectionContainer>
    );
  }

  const { icon, title, text } = MESSAGES[view];

  return (
    <SectionContainer className="max-w-lg items-center text-center">
      <span className="material-symbols-outlined text-secondary text-[56px]!">{icon}</span>
      <h1 className="text-secondary text-2xl font-bold">{title}</h1>
      <p className="text-gray-600">{text}</p>
      {detail && <p className="text-sm text-red-700">{detail}</p>}

      <div className="flex w-full flex-col gap-3">
        {view === 'confirmed' && (
          <Button variant="secondary" onClick={() => navigate('/my-reservations')}>
            Ver mis reservas
          </Button>
        )}
        {(view === 'processing' || view === 'error') && (
          <Button variant="secondary" onClick={retry}>
            Verificar de nuevo
          </Button>
        )}
        {view === 'failed' && (
          <Button variant="secondary" onClick={() => navigate('/booking/checkout')}>
            Intentar de nuevo
          </Button>
        )}
        {(view === 'expired' || view === 'failed') && (
          <Button variant="primary" onClick={() => navigate('/')}>
            Buscar otro vuelo
          </Button>
        )}
      </div>
    </SectionContainer>
  );
};
