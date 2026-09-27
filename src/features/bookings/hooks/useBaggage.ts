import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useFlightId } from '@/hooks/useAPI';
import type { Fare } from '@/features/flights/flights.types';
import { useFlightStore } from '@/store/useFlightStore';

export const useBaggage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const departureId = searchParams.get('departureId') || searchParams.get('id') || '';
  const returnId = searchParams.get('returnId') || '';
  const passengers = searchParams.get('passengers') || '';
  const hasReturn = Boolean(returnId);

  const { flightById: flightDepartureId } = useFlightId(departureId);
  const { flightById: flightReturnId } = useFlightId(returnId);

  const [step, setStep] = useState<'IDA' | 'VUELTA'>('IDA');
  const [outboundFareId, setOutboundFareId] = useState<string | null>(null);
  const [returnFareId, setReturnFareId] = useState<string | null>(null);

  const flight = step === 'IDA' ? flightDepartureId : flightReturnId;
  const defaultOutboundFareId =
    flightDepartureId?.fares?.find((f: Fare) => f.price.transparentFinalPrice === 0)?.id || null;
  const defaultReturnFareId =
    flightReturnId?.fares?.find((f: Fare) => f.price.transparentFinalPrice === 0)?.id || null;
  const selectedOutboundFareId = outboundFareId ?? defaultOutboundFareId;
  const selectedReturnFareId = returnFareId ?? defaultReturnFareId;
  const activeFareId = step === 'IDA' ? selectedOutboundFareId : selectedReturnFareId;

  const handleCardSelect = (fareId: string) => {
    if (step === 'IDA') {
      setOutboundFareId(fareId);
    } else {
      setReturnFareId(fareId);
    }
  };

  const priceTotal = useMemo(() => {
    const amountPassengers = Number(passengers);
    let total = ((flightDepartureId?.price ?? 0) + (flightReturnId?.price ?? 0)) * amountPassengers;

    if (selectedOutboundFareId && flightDepartureId?.fares) {
      const tarifaIda = flightDepartureId.fares.find((f) => f.id === selectedOutboundFareId);

      if (tarifaIda) total += tarifaIda.price.transparentFinalPrice * amountPassengers;
    }

    if (selectedReturnFareId && flightReturnId?.fares) {
      const tarifaVuelta = flightReturnId.fares.find((f) => f.id === selectedReturnFareId);
      if (tarifaVuelta) total += tarifaVuelta.price.transparentFinalPrice * amountPassengers;
    }

    return total;
  }, [selectedOutboundFareId, selectedReturnFareId, flightDepartureId, flightReturnId, passengers]);

  const handleNextStep = () => {
    const selectedId = activeFareId;
    if (!selectedId) return;

    if (step === 'IDA') {
      if (hasReturn) {
        setStep('VUELTA');
      } else {
        useFlightStore.setState({
          selectedDepartureFlight: departureId,
          selectedDepartureFare: selectedOutboundFareId,
          passengers: Number(passengers),
        });
        navigate(`/booking/seats`);
      }
    } else {
      useFlightStore.setState({
        selectedDepartureFlight: departureId,
        selectedReturnFlight: returnId,
        selectedDepartureFare: selectedOutboundFareId,
        selectedReturnFare: selectedReturnFareId,
        passengers: Number(passengers),
      });
      navigate(`/booking/seats`);
    }
  };

  return {
    flight,
    flightDepartureId,
    flightReturnId,
    hasReturn,
    activeFareId,
    priceTotal,
    passengers,
    handleCardSelect,
    handleNextStep,
  };
};
