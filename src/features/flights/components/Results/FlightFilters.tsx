import { cn } from '../../../../utils/cn';
import { formatCurrency } from '../../../../utils/formatCurrency';
import type { Escala } from '../../flights.types';
import type { EquipajeFiltro } from '../../../../hooks/useFlights';

interface AerolineaOpcion {
  nombre: string;
  precioDesde: number;
}

interface FlightFiltersProps {
  escalaFiltro: Escala | 'Todos';
  onEscalaChange: (escala: Escala | 'Todos') => void;
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

const opcionesEscala: { label: Escala | 'Todos' }[] = [
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
    <aside className="flex w-full flex-col gap-6 rounded-2xl border border-black/10 bg-white p-6 lg:w-80">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-secondary">filter_alt</span>
        <h3 className="text-secondary text-lg font-bold">Filtros</h3>
      </div>

      <div className="flex flex-col gap-3">
        <h4 className="text-secondary font-semibold">Escalas</h4>
        {opcionesEscala.map(({ label }) => (
          <label
            key={label}
            className="flex cursor-pointer items-center justify-between gap-2 text-sm"
          >
            <span className="flex items-center gap-2">
              <input
                type="radio"
                name="escalas"
                checked={escalaFiltro === label}
                onChange={() => onEscalaChange(label)}
                className="accent-primary h-4 w-4 cursor-pointer"
              />
              {label}
            </span>
          </label>
        ))}
      </div>

      <div className="flex flex-col gap-3 border-t border-black/10 pt-4">
        <h4 className="text-secondary font-semibold">Aerolíneas</h4>
        {aerolineas.map(({ nombre, precioDesde }) => (
          <label
            key={nombre}
            className="flex cursor-pointer items-center justify-between gap-2 text-sm"
          >
            <span className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={aerolineasFiltro.includes(nombre)}
                onChange={() => onToggleAerolinea(nombre)}
                className="accent-primary h-4 w-4 cursor-pointer rounded"
              />
              {nombre}
            </span>
            <span className="text-[#44474E]/70">{formatCurrency(precioDesde)}</span>
          </label>
        ))}
      </div>

      <div className="flex flex-col gap-3 border-t border-black/10 pt-4">
        <h4 className="text-secondary font-semibold">Equipaje incluido</h4>
        {(
          [
            { value: 'Todos', label: 'Todos' },
            { value: 'mano', label: 'Equipaje de mano' },
            { value: 'bodega', label: 'Equipaje para despachar' },
          ] as { value: EquipajeFiltro; label: string }[]
        ).map(({ value, label }) => (
          <label key={value} className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="radio"
              name="equipaje"
              checked={equipajeFiltro === value}
              onChange={() => onEquipajeChange(value)}
              className="accent-primary h-4 w-4 cursor-pointer"
            />
            {label}
          </label>
        ))}
      </div>

      <div className="flex flex-col gap-3 border-t border-black/10 pt-4">
        <h4 className="text-secondary font-semibold">Horario de salida</h4>
        <p className="text-xs text-[#44474E]">
          {minutosAHora(horarioMin)} - {minutosAHora(horarioMax)}
        </p>
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
            className="accent-primary w-full cursor-pointer"
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
            className="accent-primary w-full cursor-pointer"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={onLimpiar}
        className={cn(
          'border-secondary text-secondary hover:bg-secondary mt-2 rounded-[10px] border p-2 font-bold transition-colors hover:text-white',
        )}
      >
        Limpiar filtros
      </button>
    </aside>
  );
};
