import { FlightCard } from './Cards';
import type { Vuelo } from '../../flights.types';

type Orden = 'mejor' | 'precio_asc' | 'precio_desc' | 'duracion';

interface FlightListProps {
  vuelos: Vuelo[];
  orden: Orden;
  onOrdenChange: (orden: Orden) => void;
  onSeleccionar?: (vuelo: Vuelo) => void;
}

export const FlightList = ({ vuelos, orden, onOrdenChange, onSeleccionar }: FlightListProps) => {
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
        <p className="text-secondary font-semibold">{vuelos.length} vuelos encontrados</p>

        <div className="flex items-center gap-2">
          <label htmlFor="orden" className="text-sm text-[#44474E]">
            Ordenar por:
          </label>
          <select
            id="orden"
            value={orden}
            onChange={(e) => onOrdenChange(e.target.value as Orden)}
            className="rounded-lg border border-black/20 px-3 py-1.5 text-sm"
          >
            <option value="mejor">Mejor opción</option>
            <option value="precio_asc">Precio: menor a mayor</option>
            <option value="precio_desc">Precio: mayor a menor</option>
            <option value="duracion">Duración</option>
          </select>
        </div>
      </div>

      {vuelos.length === 0 ? (
        <p className="rounded-2xl border border-black/10 bg-white p-8 text-center text-[#44474E]">
          No encontramos vuelos con los filtros seleccionados.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {vuelos.map((vuelo) => (
            <FlightCard key={vuelo.id} vuelo={vuelo} onSeleccionar={onSeleccionar} />
          ))}
        </div>
      )}
    </div>
  );
};
