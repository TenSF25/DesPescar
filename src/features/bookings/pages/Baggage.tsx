import { SectionContainer } from '@/components/ui/SectionContainer';
import { BaggageCard } from '../components/BaggageCard';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate } from '@/utils/formatDate';
import { useBarraInferior } from '@/hooks/useBarraInferior';
import { useBaggage } from '../hooks/useBaggage';
import type { Fare } from '@/features/flights/flights.types';

export const Baggage = () => {
  useBarraInferior();
  const {
    flight,
    flightDepartureId,
    flightReturnId,
    hasReturn,
    activeFareId,
    priceTotal,
    passengers,
    handleCardSelect,
    handleNextStep,
  } = useBaggage();

  return (
    <SectionContainer className="pb-32 sm:pb-28">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-x-3 text-2xl text-[#323439] sm:text-3xl">
            <h2 className="font-medium">{flight?.originAirport.city} </h2>
            <span className="material-symbols-outlined">sync_alt</span>
            <h2 className="font-semibold">{flight?.destinationAirport.city}</h2>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <p className="text-center">{hasReturn ? 'Ida y vuelta' : 'Ida'}</p>
            <span className="flex h-1.25 w-1.25 items-center justify-center rounded-full bg-gray-500 text-center" />
            <p className="flex items-center">
              <span className="material-symbols-outlined text-[22px]!">person</span> {passengers}
            </p>
          </div>
        </div>
        <div className="border-primary/40 flex flex-col gap-3 rounded-lg border p-2 lg:max-h-17.5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex h-full flex-col divide-y divide-gray-300 font-medium sm:flex-row sm:items-center sm:divide-x sm:divide-y-0">
            <div className="flex flex-wrap items-center gap-2 px-3 py-2 sm:py-0">
              <img
                src={flightDepartureId?.airline.logoUrl}
                alt={flightDepartureId?.airline.name}
                className="w-12"
              />
              <h3>IDA</h3>
              <div className="flex font-semibold text-[#72777F]">
                <h3>{flightDepartureId?.originAirport.code}</h3>
                <span>-</span>
                <h3>{flightDepartureId?.destinationAirport.code}</h3>
              </div>
              <h4 className="text-md font-normal">
                {formatDate(flightDepartureId?.departureTime || '')}
              </h4>
            </div>
            <div className="flex flex-wrap items-center gap-2 px-3 py-2 sm:py-0">
              <img
                src={flightReturnId?.airline.logoUrl}
                alt={flightReturnId?.airline.name}
                className="w-12"
              />
              <h3>VUELTA</h3>
              <div className="flex font-semibold text-[#72777F]">
                <h3>{flightReturnId?.originAirport.code}</h3>
                <span>-</span>
                <h3>{flightReturnId?.destinationAirport.code}</h3>
              </div>
              <h4 className="text-md font-normal">
                {formatDate(flightReturnId?.departureTime || '')}
              </h4>
            </div>
          </div>
          <Button
            className="w-full rounded-full border-none sm:w-auto lg:max-w-30"
            variant="secondary"
          >
            Ver detalle
          </Button>
        </div>
      </div>
      <div className="flex w-full flex-col justify-between gap-6 text-[#323439]">
        <div className="flex w-full flex-col gap-1 text-[#323439] sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-semibold sm:text-3xl">Seleccioná tu tarifa</h2>
          <p>{flight?.fares?.length} tarifas disponibles</p>
        </div>

        <div className="flex flex-col gap-4 sm:gap-6 md:flex-row">
          {flight?.fares?.map((tarifa: Fare) => (
            <BaggageCard
              key={tarifa.id}
              name={tarifa.name}
              type={tarifa.type}
              price={tarifa.price.transparentFinalPrice}
              serviciosIncluidos={tarifa.includedServices}
              isSelect={activeFareId === tarifa.id}
              onSelect={() => handleCardSelect(tarifa.id)}
            />
          ))}
        </div>
      </div>
      <div className="fixed bottom-0 left-0 z-10 flex w-full justify-center border-t border-[#3234392d] bg-white">
        <div className="flex w-full max-w-360 items-center justify-between gap-3 p-3 sm:p-4">
          <h3 className="min-w-0 truncate text-base font-semibold text-[#323439] sm:text-xl">
            Tu viaje a {flight?.destinationAirport?.city}
          </h3>
          <div className="flex shrink-0 items-center gap-4 sm:gap-12">
            <div className="flex flex-col">
              <h5 className="text-xs font-semibold">Precio final</h5>
              <div className="flex gap-0.5">
                <span className="material-symbols-outlined text-primary">info</span>
                <h6 className="text-xl">{formatCurrency(priceTotal)}</h6>
              </div>
            </div>
            <Button variant="secondary" className="rounded-full px-5" onClick={handleNextStep}>
              Continuar
            </Button>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};
