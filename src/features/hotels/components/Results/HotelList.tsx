import type { HotelResumen, HotelSearchParams } from '../../hotels.types';
import type { OrdenHotel } from '../../hotelFilters';
import { HotelResultCard } from './HotelResultCard';

interface Props {
  hoteles: HotelResumen[];
  params: HotelSearchParams;
  orden: OrdenHotel;
  onOrdenChange: (o: OrdenHotel) => void;
}

export const HotelList = ({ hoteles, params, orden, onOrdenChange }: Props) => (
  <div className="flex w-full flex-col gap-4">
    <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
      <p className="text-secondary font-semibold">
        {hoteles.length} {hoteles.length === 1 ? 'hotel encontrado' : 'hoteles encontrados'}
      </p>
      <div className="flex items-center gap-2">
        <label htmlFor="orden-hoteles" className="text-secondary/70 text-sm font-medium">
          Ordenar por:
        </label>
        <select
          id="orden-hoteles"
          value={orden}
          onChange={(e) => onOrdenChange(e.target.value as OrdenHotel)}
          className="text-secondary focus:border-secondary cursor-pointer rounded-lg border border-[#E2E8F0] bg-white px-3 py-1.5 text-sm font-medium transition-colors outline-none"
        >
          <option value="recomendados">Recomendados</option>
          <option value="precio_asc">Precio: menor a mayor</option>
          <option value="precio_desc">Precio: mayor a menor</option>
          <option value="calificacion">Mejor calificados</option>
        </select>
      </div>
    </div>

    {hoteles.length === 0 ? (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-[#E2E8F0] bg-white p-12 text-center shadow-sm">
        <span className="material-symbols-outlined text-secondary/30 mb-3 text-4xl">
          domain_disabled
        </span>
        <p className="text-secondary font-medium">
          No encontramos hoteles con esta búsqueda o estos filtros.
        </p>
      </div>
    ) : (
      hoteles.map((h) => <HotelResultCard key={h.id} hotel={h} params={params} />)
    )}
  </div>
);
