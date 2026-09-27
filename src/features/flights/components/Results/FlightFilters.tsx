import { cn } from '../../../../utils/cn';
import { formatCurrency } from '../../../../utils/formatCurrency';
import type { FiltroEscala } from '../../flights.types';
import type { EquipajeFiltro } from '../../hooks/useFlights';

interface AerolineaOpcion {
  nombre: string;
  precioDesde: number;
}

interface FlightFiltersProps {
  escalaFiltro: FiltroEscala;
  onEscalaChange: (escala: FiltroEscala | 'Todos') => void;
  aerolineas: AerolineaOpcion[];
  aerolineasFiltro: string[];
  onToggleAerolinea: (nombre: string) => void;
  equipajeFiltro: EquipajeFiltro;
  onEquipajeChange: (equipaje: EquipajeFiltro) => void;
  horarioMin: number;
  horarioMax: number;
  onHorarioMinChange: (minutos: number) => void;
  onHorarioMaxChange: (minutos: number) => void;
  onLimpiar: () => void;
}

const minutosAHora = (minutos: number) => {
  const h = Math.floor(minutos / 60)
    .toString()
    .padStart(2, '0');
  const m = (minutos % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
};

const opcionesEscala: { label: FiltroEscala }[] = [
  { label: 'Todos' },
  { label: 'Directo' },
  { label: '1 escala' },
  { label: '2 escalas' },
];

export const FlightFilters = ({
  escalaFiltro,
  onEscalaChange,
  aerolineas,
  aerolineasFiltro,
  onToggleAerolinea,
  equipajeFiltro,
  onEquipajeChange,
  horarioMin,
  horarioMax,
  onHorarioMinChange,
  onHorarioMaxChange,
  onLimpiar,
}: FlightFiltersProps) => {
  return (
    <aside className="flex w-full flex-col gap-6 rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm lg:w-80 lg:shrink-0">
      <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-4">
        <span className="material-symbols-outlined text-secondary">tune</span>
        <h3 className="text-secondary text-lg font-bold">Filtros</h3>
      </div>

      <div className="flex flex-col gap-3">
        <h4 className="text-secondary font-semibold">Escalas</h4>
        {opcionesEscala.map(({ label }) => (
          <label
            key={label}
            className="text-secondary/80 hover:text-secondary flex cursor-pointer items-center justify-between gap-2 text-sm font-medium"
          >
            <span className="flex items-center gap-3">
              <input
                type="radio"
                name="escalas"
                checked={escalaFiltro === label}
                onChange={() => onEscalaChange(label)}
                className="accent-secondary h-4 w-4 cursor-pointer"
              />
              {label}
            </span>
          </label>
        ))}
      </div>

      <div className="flex flex-col gap-3 border-t border-[#E2E8F0] pt-5">
        <h4 className="text-secondary font-semibold">Aerolíneas</h4>
        {aerolineas.map(({ nombre, precioDesde }) => (
          <label
            key={nombre}
            className="text-secondary/80 hover:text-secondary flex cursor-pointer items-center justify-between gap-2 text-sm font-medium"
          >
            <span className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={aerolineasFiltro.includes(nombre)}
                onChange={() => onToggleAerolinea(nombre)}
                className="accent-secondary h-4 w-4 cursor-pointer rounded border-[#E2E8F0]"
              />
              {nombre}
            </span>
            <span className="text-secondary/50 text-xs">{formatCurrency(precioDesde)}</span>
          </label>
        ))}
      </div>

      <div className="flex flex-col gap-3 border-t border-[#E2E8F0] pt-5">
        <h4 className="text-secondary font-semibold">Equipaje incluido</h4>
        {(
          [
            { value: 'Todos', label: 'Cualquiera' },
            { value: 'mano', label: 'Equipaje de mano' },
            { value: 'bodega', label: 'Equipaje para despachar' },
          ] as { value: EquipajeFiltro; label: string }[]
        ).map(({ value, label }) => (
          <label
            key={value}
            className="text-secondary/80 hover:text-secondary flex cursor-pointer items-center gap-3 text-sm font-medium"
          >
            <input
              type="radio"
              name="equipaje"
              checked={equipajeFiltro === value}
              onChange={() => onEquipajeChange(value)}
              className="accent-secondary h-4 w-4 cursor-pointer"
            />
            {label}
          </label>
        ))}
      </div>

      <div className="flex flex-col gap-4 border-t border-[#E2E8F0] pt-5">
        <div className="flex items-center justify-between">
          <h4 className="text-secondary font-semibold">Horario de salida</h4>
          <span className="text-secondary rounded bg-[#F8FAFC] px-2 py-1 text-xs font-bold">
            {minutosAHora(horarioMin)} - {minutosAHora(horarioMax)}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <input
            type="range"
            min={0}
            max={1439}
            step={15}
            value={horarioMin}
            onChange={(e) => {
              const valor = Number(e.target.value);
              onHorarioMinChange(Math.min(valor, horarioMax));
            }}
            className="accent-secondary w-full cursor-pointer"
          />
          <input
            type="range"
            min={0}
            max={1439}
            step={15}
            value={horarioMax}
            onChange={(e) => {
              const valor = Number(e.target.value);
              onHorarioMaxChange(Math.max(valor, horarioMin));
            }}
            className="accent-secondary w-full cursor-pointer"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={onLimpiar}
        className={cn(
          'border-secondary/20 text-secondary mt-2 flex w-full items-center justify-center gap-2 rounded-xl border bg-transparent py-2.5 text-sm font-bold transition-colors hover:bg-[#F8FAFC]',
        )}
      >
        <span className="material-symbols-outlined text-[18px]">delete</span>
        Limpiar filtros
      </button>
    </aside>
  );
};
