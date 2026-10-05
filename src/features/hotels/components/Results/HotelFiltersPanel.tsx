import { formatCurrency } from '@/utils/formatCurrency';
import type { HotelResumen } from '../../hotels.types';
import { FILTROS_INICIALES, precioDeReferencia, type HotelFiltros } from '../../hotelFilters';
import { SERVICIO_INFO, SERVICIOS } from '../../servicios';

interface Props {
  hoteles: HotelResumen[];
  filtros: HotelFiltros;
  onChange: (f: HotelFiltros) => void;
}

const toggle = <T,>(lista: T[], valor: T) =>
  lista.includes(valor) ? lista.filter((v) => v !== valor) : [...lista, valor];

const CALIFICACIONES = [0, 3, 4, 4.5];

export const HotelFiltersPanel = ({ hoteles, filtros, onChange }: Props) => {
  const precios = hoteles.map(precioDeReferencia).filter((p): p is number => p !== null);
  const precioTope = precios.length ? Math.max(...precios) : 0;
  const precioMax = filtros.precioMax ?? precioTope;

  return (
    <aside className="flex w-full flex-col gap-6 rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm lg:w-80 lg:shrink-0">
      <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-4">
        <span className="material-symbols-outlined text-secondary">tune</span>
        <h3 className="text-secondary text-lg font-bold">Filtros</h3>
      </div>

      <div className="flex flex-col gap-3">
        <h4 className="text-secondary font-semibold">Estrellas</h4>
        {[5, 4, 3, 2, 1].map((n) => (
          <label
            key={n}
            className="text-secondary/80 hover:text-secondary flex cursor-pointer items-center gap-3 text-sm font-medium"
          >
            <input
              type="checkbox"
              checked={filtros.estrellas.includes(n)}
              onChange={() => onChange({ ...filtros, estrellas: toggle(filtros.estrellas, n) })}
              className="accent-secondary h-4 w-4 cursor-pointer"
            />
            {n} {n === 1 ? 'estrella' : 'estrellas'}
          </label>
        ))}
      </div>

      {precioTope > 0 && (
        <div className="flex flex-col gap-3 border-t border-[#E2E8F0] pt-5">
          <h4 className="text-secondary font-semibold">Precio máximo</h4>
          <input
            type="range"
            min={0}
            max={precioTope}
            step={1000}
            value={precioMax}
            onChange={(e) => {
              const v = Number(e.target.value);
              onChange({ ...filtros, precioMax: v >= precioTope ? null : v });
            }}
            className="accent-secondary w-full cursor-pointer"
          />
          <span className="text-secondary/70 text-sm">Hasta {formatCurrency(precioMax)}</span>
        </div>
      )}

      <div className="flex flex-col gap-3 border-t border-[#E2E8F0] pt-5">
        <h4 className="text-secondary font-semibold">Calificación</h4>
        {CALIFICACIONES.map((c) => (
          <label
            key={c}
            className="text-secondary/80 hover:text-secondary flex cursor-pointer items-center gap-3 text-sm font-medium"
          >
            <input
              type="radio"
              name="calificacion"
              checked={filtros.calificacionMin === c}
              onChange={() => onChange({ ...filtros, calificacionMin: c })}
              className="accent-secondary h-4 w-4 cursor-pointer"
            />
            {c === 0 ? 'Cualquiera' : `${c} o más`}
          </label>
        ))}
      </div>

      <div className="flex flex-col gap-3 border-t border-[#E2E8F0] pt-5">
        <h4 className="text-secondary font-semibold">Servicios</h4>
        {SERVICIOS.map((s) => (
          <label
            key={s}
            className="text-secondary/80 hover:text-secondary flex cursor-pointer items-center gap-3 text-sm font-medium"
          >
            <input
              type="checkbox"
              checked={filtros.servicios.includes(s)}
              onChange={() => onChange({ ...filtros, servicios: toggle(filtros.servicios, s) })}
              className="accent-secondary h-4 w-4 cursor-pointer"
            />
            <span className="material-symbols-outlined text-[18px]">{SERVICIO_INFO[s].icon}</span>
            {SERVICIO_INFO[s].label}
          </label>
        ))}
      </div>

      <label className="text-secondary/80 hover:text-secondary flex cursor-pointer items-center gap-3 border-t border-[#E2E8F0] pt-5 text-sm font-medium">
        <input
          type="checkbox"
          checked={filtros.soloAllInclusive}
          onChange={() => onChange({ ...filtros, soloAllInclusive: !filtros.soloAllInclusive })}
          className="accent-secondary h-4 w-4 cursor-pointer"
        />
        Solo all inclusive
      </label>

      <button
        type="button"
        onClick={() => onChange(FILTROS_INICIALES)}
        className="text-secondary hover:text-primary cursor-pointer text-sm font-bold"
      >
        Limpiar filtros
      </button>
    </aside>
  );
};
