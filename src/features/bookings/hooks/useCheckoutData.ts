import { useFlightId } from '@/hooks/useAPI';
import { useFlightStore } from '@/store/useFlightStore';

/** Datos de la compra en curso (vuelos, tarifas y asientos) compartidos por los pasos de datos y de pago. */
export const useCheckoutData = () => {
  const {
    bookingId,
    selectedDepartureFlight,
    selectedReturnFlight,
    selectedDepartureFare,
    selectedReturnFare,
    selectedSeats,
    passengers,
  } = useFlightStore();

  const { flightById: departureFlight, isLoading: departureLoading } = useFlightId(
    selectedDepartureFlight ?? '',
  );
  const { flightById: returnFlight, isLoading: returnLoading } = useFlightId(
    selectedReturnFlight ?? '',
  );

  const passengerCount = Math.max(1, Number(passengers) || 1);
  const departureFare = departureFlight?.fares.find((fare) => fare.id === selectedDepartureFare);
  const returnFare = returnFlight?.fares.find((fare) => fare.id === selectedReturnFare);
  const currency = departureFare?.price.currency;
  const currencyMatches = !selectedReturnFlight || returnFare?.price.currency === currency;

  const fareDetails =
    departureFare && currency && currencyMatches
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

  return {
    bookingId,
    selectedSeats,
    passengerCount,
    departureFlight,
    returnFlight,
    departureFare,
    returnFare,
    currency,
    currencyMatches,
    fareDetails,
    estimate: fareDetails ? fareDetails.pricePerPassenger * passengerCount : null,
    isLoadingFlights: departureLoading || (Boolean(selectedReturnFlight) && returnLoading),
  };
};
