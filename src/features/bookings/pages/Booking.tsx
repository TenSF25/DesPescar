import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/Button';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { omitKey } from '@/utils/omitKey';
import { useCheckoutStore } from '@/store/useCheckoutStore';
import { useFlightStore } from '@/store/useFlightStore';
import { buildInitialContact, buildInitialPassengers, hasProfileData } from '../checkout.defaults';
import type { ContactData, FieldErrors, PassengerData } from '../checkout.types';
import {
  findDuplicatedDocuments,
  validateContact,
  validatePassenger,
} from '../checkout.validation';
import { CheckoutSummary } from '../components/checkout/CheckoutSummary';
import { ContactForm } from '../components/checkout/ContactForm';
import { PassengerForm } from '../components/checkout/PassengerForm';
import { useBooking } from '../hooks/useBooking';
import { useCheckoutData } from '../hooks/useCheckoutData';
import { useSeatLabels } from '../hooks/useSeatLabels';

/** Quita espacios, puntos y guiones del documento antes de enviarlo. */
const limpiarDocumento = (documento: string) => documento.replace(/[\s.-]/g, '');

/** Paso 1 de la compra: quiénes viajan y cómo contactarlos. El pago es el paso siguiente (/booking/payment). */
export const Booking = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { savePassengers, isLoading, error } = useBooking();
  const {
    bookingId,
    selectedSeats,
    passengerCount,
    departureFlight,
    returnFlight,
    departureFare,
    currency,
    currencyMatches,
    fareDetails,
    estimate,
    isLoadingFlights,
  } = useCheckoutData();
  const seatLabels = useSeatLabels(
    useFlightStore.getState().selectedDepartureFlight,
    passengerCount,
  );

  // Si se vuelve desde el pago, se recuperan los datos ya cargados de esta misma reserva.
  const saved = useCheckoutStore.getState();
  const restored = saved.bookingId === bookingId && saved.passengers.length === passengerCount;
  const [passengers, setPassengers] = useState<PassengerData[]>(() =>
    restored ? saved.passengers : buildInitialPassengers(passengerCount, profile),
  );
  const [contact, setContact] = useState<ContactData>(() =>
    restored && saved.contact ? saved.contact : buildInitialContact(profile),
  );
  const [passengerErrors, setPassengerErrors] = useState<FieldErrors[]>([]);
  const [contactErrors, setContactErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const firstFromProfile = !restored && hasProfileData(profile);
  // Tras "Continuar al pago" el backend ya guardó a los pasajeros y no permite cambiarlos.
  const locked = restored && useFlightStore.getState().passengersAssignedBookingId === bookingId;

  useEffect(() => {
    if (!bookingId) navigate('/booking/seats', { replace: true });
  }, [bookingId, navigate]);

  const updatePassenger = <K extends keyof PassengerData>(
    index: number,
    field: K,
    value: PassengerData[K],
  ) => {
    setPassengers((current) =>
      current.map((passenger, i) => (i === index ? { ...passenger, [field]: value } : passenger)),
    );
    setPassengerErrors((current) =>
      current.map((errors, i) => {
        if (i !== index || !errors[field as string]) return errors;
        return omitKey(errors, field as string);
      }),
    );
  };

  const clearContactError = (field: string) =>
    setContactErrors((current) => {
      if (!current[field]) return current;
      return omitKey(current, field);
    });

  const canSubmit = Boolean(
    bookingId &&
    fareDetails &&
    selectedSeats.length === passengerCount &&
    !isLoadingFlights &&
    currencyMatches &&
    !isLoading,
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);

    const duplicated = findDuplicatedDocuments(passengers);
    const nextPassengerErrors = passengers.map((passenger, index) => ({
      ...validatePassenger(passenger),
      ...(duplicated.has(index)
        ? { numeroDocumento: 'Este documento ya está cargado en otro pasajero' }
        : {}),
    }));
    const nextContactErrors = validateContact(contact);
    setPassengerErrors(nextPassengerErrors);
    setContactErrors(nextContactErrors);

    const hasErrors =
      nextPassengerErrors.some((errors) => Object.keys(errors).length > 0) ||
      Object.keys(nextContactErrors).length > 0;
    if (hasErrors) {
      setSubmitError('Revisá los campos marcados para continuar.');
      // Se espera al render para que ya estén marcados los campos con error.
      requestAnimationFrame(() => {
        const invalid = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
        invalid?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        invalid?.focus({ preventScroll: true });
      });
      return;
    }

    if (!bookingId || !fareDetails || selectedSeats.length !== passengerCount) {
      setSubmitError('La reserva, la tarifa o los asientos seleccionados no están completos.');
      return;
    }

    const result = await savePassengers(
      bookingId,
      passengers.map((passenger) => ({
        nombreCompleto: `${passenger.nombre.trim()} ${passenger.apellido.trim()}`,
        dniPasaporte: limpiarDocumento(passenger.numeroDocumento),
      })),
      selectedSeats,
      fareDetails,
    );
    if (!result.success) {
      setSubmitError(result.error);
      return;
    }

    useCheckoutStore.getState().save(bookingId, passengers, contact);
    navigate('/booking/payment');
  };

  if (!bookingId) return null;

  return (
    <SectionContainer>
      <div className="flex flex-col gap-1">
        <h1 className="text-secondary text-2xl font-bold">¿Quiénes viajan?</h1>
        <p className="text-sm text-[#44474E]">
          Completá los datos de cada pasajero tal como figuran en su documento: tienen que coincidir
          para poder volar.
        </p>
        {locked && (
          <p className="mt-2 rounded-md bg-amber-50 p-3 text-sm text-amber-800">
            Los datos de los pasajeros ya están guardados en tu reserva y no se pueden modificar. Si
            algo está mal, cancelá la reserva desde el paso de pago y empezá de nuevo.
          </p>
        )}
      </div>

      <form
        ref={formRef}
        noValidate
        onSubmit={handleSubmit}
        className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]"
      >
        <div className="flex flex-col gap-6">
          {passengers.map((passenger, index) => (
            <PassengerForm
              key={index}
              index={index}
              passenger={passenger}
              errors={passengerErrors[index] ?? {}}
              seat={selectedSeats[index] ? seatLabels[selectedSeats[index]] : undefined}
              fromProfile={index === 0 && firstFromProfile}
              locked={locked}
              onChange={(field, value) => updatePassenger(index, field, value)}
            />
          ))}

          <ContactForm
            contact={contact}
            errors={contactErrors}
            onChange={setContact}
            onTouch={clearContactError}
          />
        </div>

        <CheckoutSummary
          departureFlight={departureFlight}
          returnFlight={returnFlight}
          passengerCount={passengerCount}
          fareName={departureFare?.name}
          total={estimate}
          currency={currency}
          note="El importe definitivo lo confirma el pago con los datos de la reserva."
        >
          {selectedSeats.length !== passengerCount && (
            <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-700">
              Volvé a seleccionar un asiento para cada pasajero.
            </p>
          )}
          {!currencyMatches && (
            <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-700">
              Los vuelos de ida y vuelta tienen monedas distintas y no se pueden cobrar en una sola
              reserva.
            </p>
          )}
          {(submitError || error) && (
            <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-700">
              {submitError || error}
            </p>
          )}
          <Button type="submit" variant="secondary" className="h-12" disabled={!canSubmit}>
            {isLoading ? 'Guardando…' : 'Continuar al pago'}
          </Button>
        </CheckoutSummary>
      </form>
    </SectionContainer>
  );
};
