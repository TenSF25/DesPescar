import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from 'react';
import { DayPicker, type DateRange as DayPickerRange } from 'react-day-picker';
import { format, parseISO, subDays, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import 'react-day-picker/dist/style.css';
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

const ISO = 'yyyy-MM-dd';

const WIDE_QUERY = '(min-width: 768px)';
const subscribeWide = (callback: () => void) => {
  const query = window.matchMedia(WIDE_QUERY);
  query.addEventListener('change', callback);
  return () => query.removeEventListener('change', callback);
};
const getWide = () => window.matchMedia(WIDE_QUERY).matches;

// Colores del calendario (react-day-picker usa estas variables CSS).
const calendarTheme = {
  '--rdp-accent-color': 'var(--color-primary)',
  '--rdp-accent-background-color': 'var(--color-primary-transparent)',
  '--rdp-range_middle-background-color': 'rgb(200 83 0 / 0.12)',
  '--rdp-range_middle-color': 'var(--color-primary)',
  '--rdp-today-color': 'var(--color-secondary)',
} as CSSProperties;

/**
 * Selector de rango de fechas para los reportes de admin. Un botón muestra el
 * rango actual y despliega un calendario: se eligen dos días y se aplica.
 * Incluye atajos de "últimos N días". Cierra con click afuera o con Escape.
 */
export const DateRangeFilter = ({
  value,
  onChange,
  min,
  max,
  presetDays = [7, 30, 90],
  className,
}: DateRangeFilterProps) => {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DayPickerRange | undefined>();
  const containerRef = useRef<HTMLDivElement>(null);
  const isWide = useSyncExternalStore(subscribeWide, getWide, () => true);

  useEffect(() => {
    if (!open) return;

    const handleMouseDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const presetRange = (days: number): DateRange => {
    const from = format(subDays(parseISO(max), days - 1), ISO);
    return { from: min && from < min ? min : from, to: max };
  };

  const activePreset = presetDays.find((days) => {
    const range = presetRange(days);
    return range.from === value.from && range.to === value.to;
  });

  const handleToggle = () => {
    if (!open) setDraft({ from: parseISO(value.from), to: parseISO(value.to) });
    setOpen((prev) => !prev);
  };

  const handlePreset = (days: number) => {
    onChange(presetRange(days));
    setOpen(false);
  };

  const handleApply = () => {
    if (!draft?.from) return;
    onChange({ from: format(draft.from, ISO), to: format(draft.to ?? draft.from, ISO) });
    setOpen(false);
  };

  const label = `${format(parseISO(value.from), 'dd/MM/yyyy')} - ${format(parseISO(value.to), 'dd/MM/yyyy')}`;
  const minDate = min ? parseISO(min) : undefined;
  const maxDate = parseISO(max);
  const visibleMonth = subMonths(parseISO(value.to), isWide ? 1 : 0);

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={handleToggle}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={cn(
          'flex w-full cursor-pointer items-center gap-2 rounded-xl border bg-white px-3 py-2.5 text-sm text-[#44474E] transition-colors outline-none hover:border-black/30',
          open ? 'border-black/30' : 'border-black/15',
        )}
      >
        <span className="material-symbols-outlined text-[18px]">calendar_today</span>
        <span className="font-medium whitespace-nowrap">{label}</span>
        <span className="material-symbols-outlined ml-auto text-[18px]">
          {open ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Elegir rango de fechas"
          className="absolute top-[calc(100%+8px)] left-0 z-30 flex max-w-[calc(100vw-2rem)] flex-col gap-4 overflow-x-auto rounded-2xl border border-black/10 bg-white p-5 shadow-2xl"
        >
          {presetDays.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold tracking-wide text-[#44474E] uppercase">
                Atajos
              </span>
              {presetDays.map((days) => (
                <button
                  key={days}
                  type="button"
                  onClick={() => handlePreset(days)}
                  className={cn(
                    'cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors',
                    activePreset === days
                      ? 'bg-secondary border-secondary text-white'
                      : 'hover:text-secondary border-black/15 text-[#44474E]',
                  )}
                >
                  Últimos {days} días
                </button>
              ))}
            </div>
          )}

          <div style={calendarTheme}>
            <DayPicker
              mode="range"
              locale={es}
              numberOfMonths={isWide ? 2 : 1}
              selected={draft}
              onSelect={setDraft}
              defaultMonth={visibleMonth}
              startMonth={minDate}
              endMonth={maxDate}
              disabled={[...(minDate ? [{ before: minDate }] : []), { after: maxDate }]}
            />
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-black/10 pt-4">
            <span className="text-xs text-[#44474E]">
              {draft?.from
                ? `${format(draft.from, 'dd/MM/yyyy')} - ${format(draft.to ?? draft.from, 'dd/MM/yyyy')}`
                : 'Elige el primer y el último día'}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="cursor-pointer px-3 py-2 text-sm font-semibold text-[#44474E] hover:text-black"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleApply}
                disabled={!draft?.from}
                className="bg-secondary hover:bg-secondary/90 cursor-pointer rounded-xl px-4 py-2 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
