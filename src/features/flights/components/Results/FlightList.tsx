import { useMemo, memo } from 'react';
import { FlightCard } from './FlightCard';
import type { Flight } from '../../flights.types';

type Orden = 'mejor' | 'precio_asc' | 'precio_desc' | 'duracion';

interface FlightListProps {
  vuelos: Flight[];
  orden: Orden;
  onOrdenChange: (orden: Orden) => void;
  onSeleccionar?: (vuelo: Flight) => void;
}

export const FlightList = memo(
  ({ vuelos, orden, onOrdenChange, onSeleccionar }: FlightListProps) => {
    const vuelosOrdenados = useMemo(() => {
      // Evitamos mutar la prop original
      const listaCopia = [...vuelos];

      switch (orden) {
        case 'precio_asc':
          return listaCopia.sort(
            (a, b) => a.price.transparentFinalPrice - b.price.transparentFinalPrice,
          );
        case 'precio_desc':
          return listaCopia.sort(
            (a, b) => b.price.transparentFinalPrice - a.price.transparentFinalPrice,
          );
        case 'duracion':
          return listaCopia.sort(
            (a, b) => a.itinerary.durationMinutes - b.itinerary.durationMinutes,
          );
        case 'mejor':
        default:
          return listaCopia.sort(
            (a, b) => a.price.transparentFinalPrice - b.price.transparentFinalPrice,
          );
      }
    }, [vuelos, orden]);

    return (
      <div className="flex w-full flex-col gap-4">
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <p className="text-secondary font-semibold">
            {vuelosOrdenados.length} vuelos encontrados
          </p>

          <div className="flex items-center gap-2">
            <label htmlFor="orden" className="text-secondary/70 text-sm font-medium">
              Ordenar por:
            </label>
            <select
              id="orden"
              value={orden}
              onChange={(e) => onOrdenChange(e.target.value as Orden)}
              className="text-secondary focus:border-secondary cursor-pointer rounded-lg border border-[#E2E8F0] bg-white px-3 py-1.5 text-sm font-medium transition-colors outline-none"
            >
              <option value="mejor">Mejor opción</option>
              <option value="precio_asc">Precio: menor a mayor</option>
              <option value="precio_desc">Precio: mayor a menor</option>
              <option value="duracion">Duración</option>
            </select>
          </div>
        </div>

        {vuelosOrdenados.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-[#E2E8F0] bg-white p-12 text-center shadow-sm">
            <span className="material-symbols-outlined text-secondary/30 mb-3 text-4xl">
              airplanemode_inactive
            </span>
            <p className="text-secondary font-medium">
              No encontramos vuelos con los filtros seleccionados.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {vuelosOrdenados.map((vuelo) => (
              <FlightCard key={vuelo.id} vuelo={vuelo} onSeleccionar={onSeleccionar} />
            ))}
          </div>
        )}
      </div>
    );
  },
);

FlightList.displayName = 'FlightList';
