import { format, parseISO, subDays } from 'date-fns';
import { cn } from '@/utils/cn';

export interface DateRange {
  /** YYYY-MM-DD */
  from: string;
  /** YYYY-MM-DD */
  to: string;
}

interface DateRangeFilterProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  /** Fecha mínima seleccionable (YYYY-MM-DD). */
  min?: string;
  /** Fecha máxima seleccionable (YYYY-MM-DD). También es el fin de los atajos. */
  max: string;
  /** Atajos de "últimos N días". Pasar [] para ocultarlos. */
  presetDays?: number[];
  className?: string;
}

const dateInputClass =
  'cursor-pointer bg-transparent text-sm text-[#44474E] outline-none [color-scheme:light]';

/**
 * Selector de rango de fechas para los reportes de admin: dos fechas
 * (desde / hasta) y atajos de últimos N días. Mantiene siempre desde <= hasta.
 */
export const DateRangeFilter = ({
  value,
  onChange,
  min,
  max,
  presetDays = [7, 30, 90],
  className,
}: DateRangeFilterProps) => {
  const handleFrom = (from: string) => {
    if (!from) return;
    onChange({ from, to: from > value.to ? from : value.to });
  };

  const handleTo = (to: string) => {
    if (!to) return;
    onChange({ from: to < value.from ? to : value.from, to });
  };

  const applyPreset = (days: number) => {
    const to = max;
    const from = format(subDays(parseISO(max), days - 1), 'yyyy-MM-dd');
    onChange({ from: min && from < min ? min : from, to });
  };

  const activePreset = presetDays.find(
    (days) =>
      value.to === max && value.from === format(subDays(parseISO(max), days - 1), 'yyyy-MM-dd'),
  );

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <div className="flex items-center gap-2 rounded-xl border border-black/15 bg-white px-3 py-2.5">
        <span className="material-symbols-outlined text-[18px] text-[#44474E]">calendar_today</span>
        <input
          type="date"
          aria-label="Desde"
          value={value.from}
          min={min}
          max={max}
          onChange={(e) => handleFrom(e.target.value)}
          className={dateInputClass}
        />
        <span className="text-sm text-[#44474E]">-</span>
        <input
          type="date"
          aria-label="Hasta"
          value={value.to}
          min={min}
          max={max}
          onChange={(e) => handleTo(e.target.value)}
          className={dateInputClass}
        />
      </div>

      {presetDays.length > 0 && (
        <div className="flex items-center gap-1">
          {presetDays.map((days) => (
            <button
              key={days}
              type="button"
              onClick={() => applyPreset(days)}
              className={cn(
                'cursor-pointer rounded-lg border px-2.5 py-2 text-xs font-semibold transition-colors',
                activePreset === days
                  ? 'bg-secondary border-secondary text-white'
                  : 'hover:text-secondary border-black/15 bg-white text-[#44474E]',
              )}
            >
              {days} días
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
