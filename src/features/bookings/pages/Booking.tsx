import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/Button';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { useFlightId } from '@/hooks/useAPI';
import { useFlightStore } from '@/store/useFlightStore';
import { useBooking, type PassengerFormInput } from '../hooks/useBooking';

const formatAmount = (amount: number, currency: string) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency }).format(amount);

export const Booking = () => {
  const navigate = useNavigate();
  const {
    bookingId,
    selectedDepartureFlight,
    selectedReturnFlight,
    selectedDepartureFare,
    selectedReturnFare,
    selectedSeats,
    passengers,
  } = useFlightStore();
  const { finalizeBookingAndPay, isLoading, error } = useBooking();
  const { flightById: departureFlight, isLoading: departureLoading } = useFlightId(
    selectedDepartureFlight ?? '',
  );
  const { flightById: returnFlight, isLoading: returnLoading } = useFlightId(
    selectedReturnFlight ?? '',
  );
  const passengerCount = Math.max(1, Number(passengers) || 1);
  const [passengerData, setPassengerData] = useState<PassengerFormInput[]>(() =>
    Array.from({ length: passengerCount }, () => ({ nombreCompleto: '', dniPasaporte: '' })),
  );
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookingId) navigate('/booking/seats', { replace: true });
  }, [bookingId, navigate]);

  const departureFare = departureFlight?.fares.find((fare) => fare.id === selectedDepartureFare);
  const returnFare = returnFlight?.fares.find((fare) => fare.id === selectedReturnFare);
  const currency = departureFare?.price.currency;
  const currencyMatches = !selectedReturnFlight || returnFare?.price.currency === currency;
  const fareDetails = departureFare && currency && currencyMatches
    ? {
        id: departureFare.id,
        name: departureFare.name,
        pricePerPassenger:
          (departureFlight?.price ?? 0) +
          departureFare.price.transparentFinalPrice +
          (selectedReturnFlight
            ? (returnFlight?.price ?? 0) + (returnFare?.price.transparentFinalPrice ?? 0)
            : 0),
      }
    : null;
  const estimate = fareDetails ? fareDetails.pricePerPassenger * passengerCount : null;
  const isLoadingFlights = departureLoading || (Boolean(selectedReturnFlight) && returnLoading);
  const isPassengerDataComplete = passengerData.length === passengerCount && passengerData.every(
    (passenger) => passenger.nombreCompleto.trim() && passenger.dniPasaporte.trim(),
  );
  const canSubmit = Boolean(
    bookingId &&
      fareDetails &&
      isPassengerDataComplete &&
      selectedSeats.length === passengerCount &&
      !isLoadingFlights &&
      currencyMatches &&
      !isLoading,
  );

  const updatePassenger = (index: number, field: keyof PassengerFormInput, value: string) => {
    setPassengerData((current) =>
      current.map((passenger, passengerIndex) =>
        passengerIndex === index ? { ...passenger, [field]: value } : passenger,
      ),
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);

    if (!bookingId || !fareDetails || selectedSeats.length !== passengerCount) {
      setSubmitError('La reserva, la tarifa o los asientos seleccionados no están completos.');
      return;
    }

    const result = await finalizeBookingAndPay(bookingId, passengerData, selectedSeats, fareDetails);
    if (result.success && result.paymentUrl) {
      window.location.assign(result.paymentUrl);
      return;
    }

    setSubmitError(result.error ?? error ?? 'No se pudo iniciar el pago.');
  };

  if (!bookingId) return null;

  return (
    <SectionContainer className="pb-32">
      <h1 className="text-secondary text-2xl font-bold">Datos de los pasajeros</h1>
      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="flex flex-col gap-5">
          {passengerData.map((passenger, index) => (
            <fieldset key={selectedSeats[index] ?? index} className="flex flex-col gap-4 rounded-lg border border-black/15 bg-white p-5">
              <legend className="px-2 font-semibold">Pasajero {index + 1}</legend>
              <p className="text-sm text-gray-600">Asiento {selectedSeats[index] ?? 'sin asignar'}</p>
              <label className="flex flex-col gap-1 text-sm font-medium">
                Nombre completo
                <input
                  required
                  autoComplete="name"
                  value={passenger.nombreCompleto}
                  onChange={(event) => updatePassenger(index, 'nombreCompleto', event.target.value)}
                  className="h-11 rounded-md border border-black/20 px-3 outline-none focus:border-secondary"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium">
                DNI o pasaporte
                <input
                  required
                  value={passenger.dniPasaporte}
                  onChange={(event) => updatePassenger(index, 'dniPasaporte', event.target.value)}
                  className="h-11 rounded-md border border-black/20 px-3 outline-none focus:border-secondary"
                />
              </label>
            </fieldset>
          ))}
          {selectedSeats.length !== passengerCount && (
            <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-700">
              Volvé a seleccionar un asiento para cada pasajero.
            </p>
          )}
          {selectedReturnFlight && !currencyMatches && (
            <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-700">
              Los vuelos de ida y vuelta tienen monedas distintas y no se pueden cobrar en una sola reserva.
            </p>
          )}
          {(submitError || error) && (
            <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-700">
              {submitError || error}
            </p>
          )}
        </div>

        <aside className="h-fit rounded-lg border border-black/15 bg-white p-5">
          <h2 className="text-secondary text-lg font-bold">Resumen del pago</h2>
          <p className="mt-3 text-sm text-gray-600">
            {departureFlight?.originAirport.city} → {departureFlight?.destinationAirport.city}
          </p>
          {selectedReturnFlight && (
            <p className="mt-1 text-sm text-gray-600">
              Regreso: {returnFlight?.originAirport.city} → {returnFlight?.destinationAirport.city}
            </p>
          )}
          <div className="mt-5 border-t border-black/10 pt-4">
            <div className="flex justify-between gap-4 text-sm">
              <span>{passengerCount} {passengerCount === 1 ? 'pasajero' : 'pasajeros'}</span>
              <span>{estimate !== null && currency ? formatAmount(estimate, currency) : 'Calculando...'}</span>
            </div>
            <p className="mt-3 text-xs text-gray-500">
              El importe definitivo lo calcula payment-service con los datos de la reserva.
            </p>
          </div>
          <Button type="submit" variant="secondary" className="mt-5 h-12" disabled={!canSubmit}>
            {isLoading ? 'Preparando pago...' : 'Continuar a Mercado Pago'}
          </Button>
          {isLoadingFlights && <p className="mt-3 text-sm text-gray-500">Cargando tarifa...</p>}
        </aside>
      </form>
    </SectionContainer>
  );
};
