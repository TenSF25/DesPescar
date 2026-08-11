import { Button } from '../../../../components/ui/Button';
import { formatCurrency } from '../../../../utils/formatCurrency';
import type { Vuelo } from '../../flights.types';

interface FlightCardProps {
  vuelo: Vuelo;
  onSeleccionar?: (vuelo: Vuelo) => void;
}

export const FlightCard = ({ vuelo, onSeleccionar }: FlightCardProps) => {
  const {
    aerolinea,
    horaSalida,
    horaLlegada,
    origenCodigo,
    origenCiudad,
    destinoCodigo,
    destinoCiudad,
    duracion,
    escalas,
    tarifa,
    precio,
    llegaOtroDia,
    equipajeMano,
    equipajeBodega,
    wifi,
  } = vuelo;

  return (
    <div className="flex w-full flex-col gap-4 rounded-2xl border border-black/10 bg-white p-6 shadow-[4px_4px_30px_-8px_rgba(0,0,0,0.15)] md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3 md:w-48">
        <span className="material-symbols-outlined text-secondary text-2xl!">flight</span>
        <span className="text-secondary font-semibold">{aerolinea}</span>
      </div>

      <div className="flex flex-1 items-center justify-between gap-4">
        <div className="text-center">
          <p className="text-secondary text-2xl font-bold">{horaSalida}</p>
          <p className="text-sm text-[#44474E]">{origenCodigo}</p>
          <p className="text-xs text-[#44474E]/70">{origenCiudad}</p>
        </div>

        <div className="flex flex-1 flex-col items-center px-2">
          <span className="text-xs text-[#44474E]">{escalas}</span>
          <div className="my-1 h-px w-full bg-black/20" />
          <span className="text-xs text-[#44474E]">{duracion}</span>
        </div>

        <div className="text-center">
          <p className="text-secondary text-2xl font-bold">
            {horaLlegada}
            {llegaOtroDia && <span className="text-primary align-top text-xs"> +1 día</span>}
          </p>
          <p className="text-sm text-[#44474E]">{destinoCodigo}</p>
          <p className="text-xs text-[#44474E]/70">{destinoCiudad}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 md:w-56 md:justify-center">
        <span className="text-xs font-semibold text-[#44474E]">{tarifa}</span>
        <div className="flex items-center gap-2 text-[#44474E]">
          {equipajeMano && <span className="material-symbols-outlined text-[18px]">work</span>}
          {equipajeBodega && <span className="material-symbols-outlined text-[18px]">luggage</span>}
          {wifi && <span className="material-symbols-outlined text-[18px]">wifi</span>}
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 md:w-40">
        <div className="text-center">
          <p className="text-primary text-2xl font-bold">{formatCurrency(precio)}</p>
          <p className="text-xs text-[#44474E]/70">Por pasajero</p>
        </div>
        <Button variant="primary" className="w-full" onClick={() => onSeleccionar?.(vuelo)}>
          Seleccionar
        </Button>
      </div>
    </div>
  );
};
