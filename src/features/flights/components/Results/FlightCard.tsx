import { memo } from 'react';
import { Button } from '../../../../components/ui/Button';
import { formatCurrency } from '../../../../utils/formatCurrency';
import type { Flight } from '../../flights.types';

interface FlightCardProps {
  vuelo: Flight;
  onSeleccionar?: (vuelo: Flight) => void;
}

const formatearHora = (isoString: string) => {
  const fecha = new Date(isoString);
  return fecha.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
};

const formatearDuracion = (minutos: number) => {
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return `${h}h ${m}m`;
};

const llegaAlDiaSiguiente = (salidaIso: string, llegadaIso: string) => {
  const salida = new Date(salidaIso);
  const llegada = new Date(llegadaIso);
  return llegada.getDate() !== salida.getDate();
};

export const FlightCard = memo(({ vuelo, onSeleccionar }: FlightCardProps) => {
  const { airline, itinerary, scales, includedServices, price } = vuelo;

  const horaSalida = formatearHora(itinerary.departure.dateTime);
  const horaLlegada = formatearHora(itinerary.arrival.dateTime);
  const duracionFormateada = formatearDuracion(itinerary.durationMinutes);
  const llegaOtroDia = llegaAlDiaSiguiente(
    itinerary.departure.dateTime,
    itinerary.arrival.dateTime,
  );

  const textoEscalas =
    itinerary.flightType === 'DIRECTO'
      ? 'Directo'
      : `${scales.length} escala${scales.length > 1 ? 's' : ''}`;

  return (
    <div className="flex w-full flex-col gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm transition-all hover:border-[#00A3E0]/30 hover:shadow-md sm:gap-6 sm:p-6 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3 md:w-48">
        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[#F8FAFC]">
          {airline.logoUrl ? (
            <img
              src={airline.logoUrl}
              alt={airline.name}
              className="h-full w-full object-contain p-1"
            />
          ) : (
            <span className="material-symbols-outlined text-secondary text-[20px]">airlines</span>
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-secondary line-clamp-1 font-semibold" title={airline.name}>
            {airline.name}
          </span>
          <span className="text-secondary/50 text-[10px] font-bold">{vuelo.flightNumber}</span>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-between gap-2 sm:gap-4">
        <div className="text-center">
          <p className="text-secondary text-xl font-bold tracking-tight sm:text-2xl">
            {horaSalida}
          </p>
          <p className="text-sm font-bold text-[#00A3E0]">{itinerary.departure.iata}</p>
        </div>

        <div
          className="flex min-w-0 flex-1 flex-col items-center px-1 sm:px-2"
          role="img"
          aria-label={`Duración de vuelo: ${duracionFormateada}, ${textoEscalas}`}
        >
          <span className="text-secondary/50 text-[11px] font-bold tracking-wider uppercase">
            {textoEscalas}
          </span>
          <div className="relative my-2 flex w-full items-center justify-center">
            <div className="h-0.5 w-full bg-[#E2E8F0]" />
            <span className="material-symbols-outlined absolute text-[16px] text-[#00A3E0]">
              flight
            </span>
          </div>
          <span className="text-secondary/70 text-[11px] font-semibold">{duracionFormateada}</span>
        </div>

        <div className="text-center">
          <p className="text-secondary text-xl font-bold tracking-tight sm:text-2xl">
            {horaLlegada}
            {llegaOtroDia && (
              <span
                className="text-primary ml-0.5 align-top text-[10px] font-bold"
                title="Llega al día siguiente"
              >
                +1
              </span>
            )}
          </p>
          <p className="text-sm font-bold text-[#00A3E0]">{itinerary.arrival.iata}</p>
        </div>
      </div>

      <div className="flex items-center justify-start gap-3 md:w-48 md:justify-center">
        <div className="text-secondary/60 flex items-center gap-2">
          {includedServices.personalItem && (
            <span
              className="material-symbols-outlined text-[18px]"
              title="Mochila personal incluida"
            >
              backpack
            </span>
          )}
          {includedServices.carryOn && (
            <span
              className="material-symbols-outlined text-[18px]"
              title="Equipaje de mano incluido"
            >
              luggage
            </span>
          )}
          {includedServices.checkedBaggage && (
            <span
              className="material-symbols-outlined text-[18px]"
              title="Equipaje de bodega incluido"
            >
              work
            </span>
          )}
          {includedServices.wifi && (
            <span className="material-symbols-outlined text-[18px]" title="Wi-Fi a bordo">
              wifi
            </span>
          )}
        </div>
      </div>

      <div className="flex w-full flex-col items-stretch gap-2 md:w-40 md:items-end">
        <div className="text-center md:text-right">
          <p className="text-primary text-2xl font-bold tracking-tight">
            {formatCurrency(price.transparentFinalPrice)}
          </p>
          <p className="text-secondary/50 text-[10px] font-bold tracking-wider uppercase">
            Precio final transparente
          </p>
        </div>
        <Button
          type="button"
          onClick={() => onSeleccionar?.(vuelo)}
          className="bg-primary hover:bg-primary/90 min-h-11 w-full px-6 text-white md:min-h-0 md:w-auto"
        >
          Seleccionar
        </Button>
      </div>
    </div>
  );
});

FlightCard.displayName = 'FlightCard';
