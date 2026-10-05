import { useDateRangePicker } from '@/hooks/useDateRangePicker';
import 'react-day-picker/dist/style.css';
import { DayPicker, type DateRange } from 'react-day-picker';

interface DateRangePickerProps {
  range: DateRange | undefined;
  onRangeChange: (range: DateRange | undefined) => void;
  error: boolean;
  /** Rótulos de los dos extremos. Vuelos usa Ida/Vuelta; hoteles, Check-in/Check-out. */
  labels?: { desde: string; hasta: string };
}

export const DateRangePicker = ({
  range,
  onRangeChange,
  error,
  labels = { desde: 'Ida', hasta: 'Vuelta' },
}: DateRangePickerProps) => {
  const {
    containerRef,
    handleOpen,
    isOpen,
    activeTab,
    displayRange,
    formatItem,
    handleClear,
    handleApply,
    tempRange,
    handleSelect,
    es,
  } = useDateRangePicker({ range, onRangeChange });

  return (
    <div className="relative flex w-full flex-col" ref={containerRef}>
      <div
        className={`flex h-16 w-full overflow-hidden rounded-xl border ${error ? 'border-red-500/80 focus-within:border-red-500 focus-within:bg-red-500/10' : 'border-white/10'} bg-black/20 text-white/70 focus-within:border-white/40`}
      >
        <button
          type="button"
          onClick={() => handleOpen('ida')}
          className={`flex flex-1 items-center gap-2 p-3 transition-colors outline-none hover:bg-white/5 ${
            isOpen && activeTab === 'ida' ? 'ring-secondary/50 bg-white/10 ring-2' : ''
          }`}
        >
          <div className="relative flex w-full flex-col items-start overflow-hidden">
            <span
              className={`transform text-[10px] font-bold tracking-wider text-white/50 uppercase transition-all duration-300 ${
                displayRange?.from
                  ? 'mb-0.5 h-4 translate-y-0 opacity-100'
                  : 'h-0 translate-y-2 overflow-hidden opacity-0'
              }`}
            >
              {labels.desde}
            </span>

            <span
              className={`transition-all duration-300 ${
                displayRange?.from
                  ? 'overflow-hidden font-semibold text-nowrap text-white'
                  : 'flex justify-center gap-2 font-semibold text-white/40'
              }`}
            >
              {!displayRange?.from && (
                <span className="material-symbols-outlined">calendar_today</span>
              )}
              {formatItem(displayRange?.from, labels.desde)}
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleOpen('vuelta')}
          className={`flex flex-1 items-center gap-2 p-3 transition-colors outline-none hover:bg-white/5 ${
            isOpen && activeTab === 'vuelta' ? 'ring-secondary/50 bg-white/10 ring-2' : ''
          }`}
        >
          <div className="relative flex w-full flex-col items-start overflow-hidden">
            <span
              className={`transform text-[10px] font-bold tracking-wider text-white/50 uppercase transition-all duration-300 ${
                displayRange?.to
                  ? 'mb-0.5 h-4 translate-y-0 opacity-100'
                  : 'h-0 translate-y-2 overflow-hidden opacity-0'
              }`}
            >
              {labels.hasta}
            </span>

            <span
              className={`transition-all duration-300 ${
                displayRange?.to
                  ? 'overflow-hidden font-semibold text-nowrap text-white'
                  : 'flex justify-center gap-2 font-semibold text-white/40'
              }`}
            >
              {!displayRange?.to && (
                <span className="material-symbols-outlined">calendar_today</span>
              )}
              {formatItem(displayRange?.to, labels.hasta)}
            </span>
          </div>
        </button>
      </div>

      {isOpen && (
        <div className="animate-in fade-in zoom-in-95 absolute top-[calc(100%+8px)] left-0 z-70 w-fit rounded-2xl border border-gray-200 bg-white p-6 font-sans shadow-2xl duration-150 select-none">
          <DayPicker
            mode="range"
            locale={es}
            numberOfMonths={2}
            selected={tempRange}
            onSelect={handleSelect}
            showOutsideDays={true}
            disabled={{ before: new Date() }}
            classNames={{
              months: 'relative flex flex-col gap-8 sm:flex-row',
              month: 'space-y-4',
              month_grid: 'w-full border-collapse border-spacing-0',
              month_caption:
                'relative flex h-10 items-center justify-center font-bold text-gray-800',
              caption_label: 'text-[15px] font-bold text-gray-800 capitalize tracking-wide',
              nav: 'pointer-events-none absolute left-0 right-0 top-1 z-20 flex w-full justify-between px-1',
              button_previous:
                'pointer-events-auto absolute left-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white text-secondary shadow-sm transition-all hover:bg-gray-50',
              button_next:
                'pointer-events-auto absolute right-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white text-secondary shadow-sm transition-all hover:bg-gray-50',
              weekdays: 'mb-2 flex justify-between',
              weekday: 'w-10 text-center text-[12px] font-medium capitalize text-gray-400',
              week: 'mt-0.5 flex justify-between',
              day: 'relative h-10 w-10 p-0 text-center text-sm',
              day_button:
                'custom-day-btn flex h-full w-full items-center justify-center font-medium text-gray-700 transition-all hover:bg-gray-100',
              today: 'rdp-today-marker font-bold text-[#4300D2]',
              outside: 'text-gray-300 opacity-30',
              disabled: 'cursor-not-allowed text-gray-300 opacity-30',
            }}
          />

          <style>{`
            .rdp-day {
              --rdp-selected-bg: transparent !important; 
              --rdp-selected-color: var(--color-secondary) !important;
            }
            .rdp-selected button,
            .rdp-range_start button,
            .rdp-range_end button,
            .rdp-range_middle button {
              border-radius: 2px !important;
              width: 100% !important;
              height: 100% !important;
            }
            .rdp-range_middle { background-color: var(--color-primary-transparent) !important; }
            .rdp-range_middle button { background-color: transparent !important; color: var(--color-primary) !important; font-weight: 600 !important; }
            .rdp-range_start button, .rdp-range_end button, .rdp-selected:not(.rdp-range_middle) button {
              background-color: var(--color-primary) !important; color: white !important; font-weight: 700 !important;
            }
            .rdp-today-marker .custom-day-btn { position: relative; }
            .rdp-today-marker .custom-day-btn::after {
              content: ""; position: absolute; bottom: 6px; left: 50%; transform: translateX(-50%);
              width: 4px; height: 4px; background-color: var(--color-primary); border-radius: 9999px;
            }
            .rdp-range_start.rdp-today-marker .custom-day-btn::after,
            .rdp-range_end.rdp-today-marker .custom-day-btn::after,
            .rdp-selected:not(.rdp-range_middle).rdp-today-marker .custom-day-btn::after {
              background-color: #ffffff !important;
            }
              .rdp-chevron {
              fill: var(--color-secondary)}
            .rdp-range_middle:hover button { background-color: rgba(67, 0, 210, 0.05) !important; }
            .rdp-disabled button { background-color: transparent !important; color: #d1d5db !important; cursor: not-allowed !important; }
          `}</style>

          <hr className="my-5 border-gray-100" />

          <div className="flex items-center justify-end pt-1">
            <div className="flex items-center gap-3">
              <button
                onClick={handleClear}
                className="cursor-pointer px-4 py-2 text-sm font-semibold text-gray-500 transition-colors hover:text-gray-800"
              >
                Borrar
              </button>
              <button
                onClick={handleApply}
                disabled={!tempRange?.from}
                className={`cursor-pointer rounded-full px-6 py-2.5 text-sm font-bold shadow-sm transition-all ${
                  tempRange?.from
                    ? 'bg-secondary hover:bg-secondary text-white'
                    : 'cursor-not-allowed bg-gray-100 text-gray-400'
                }`}
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
