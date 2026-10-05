import { useState } from 'react';
import { useDateCarousel } from '../../hooks/useDateCarousel';
import { useSearchParams } from 'react-router';

export const DateCarousel = ({
  activeDate,
  paramKey = 'departureDate',
}: {
  activeDate: string;
  paramKey?: 'departureDate' | 'returnDate';
}) => {
  const { dates, scroll, containerDates, dateActive, isBaseDateToday } =
    useDateCarousel(activeDate);

  const [count, setCount] = useState(0);
  const [, setSearchParams] = useSearchParams();

  const cambiarFecha = (nuevaFecha: string) => {
    const textoLimpio = `${nuevaFecha.replace(/^[a-zA-ZáéíóúÁÉÍÓÚ]+\s+/, '')} 2026`;
    const fecha = new Date(textoLimpio);
    const fechaFormateada = fecha.toISOString().split('T')[0];

    setSearchParams((prev) => {
      prev.set(paramKey, fechaFormateada);
      return prev;
    });
  };

  return (
    <section className="w-full min-w-0">
      <header className="relative flex h-18 items-center justify-between gap-2 overflow-hidden sm:gap-3">
        <button
          className={`${isBaseDateToday && count === 0 ? 'bg-secondary/40' : 'bg-secondary'} flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-white`}
          onClick={() => {
            scroll('left');
            setCount(count + 1);
          }}
          type="button"
        >
          <span className="material-symbols-outlined">chevron_left</span>
        </button>

        <div
          className="flex h-full flex-1 snap-x snap-mandatory scrollbar-none gap-2 overflow-x-auto py-1 lg:gap-4"
          ref={containerDates}
        >
          {dates.map((day) => {
            const isSelected = day.isSelected;

            return (
              <button
                key={day.id}
                type="button"
                onClick={() => cambiarFecha(day.formatted)}
                className={`flex w-30 min-w-0 shrink-0 cursor-pointer snap-center flex-col items-center justify-center gap-1 rounded-xl border p-2 transition-colors md:w-[calc((100%-3rem)/4)] md:p-3 lg:w-[calc((100%-6rem)/7)] ${
                  isSelected
                    ? 'border-primary text-primary bg-primary/5 font-bold'
                    : 'text-secondary border-black/15'
                }`}
                ref={isSelected ? dateActive : null}
              >
                <span className="text-sm font-semibold whitespace-nowrap capitalize">
                  {day.formatted}
                </span>
              </button>
            );
          })}
        </div>

        <button
          className="bg-secondary flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-white"
          onClick={() => {
            scroll('right');
            setCount(count - 1);
          }}
          type="button"
        >
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </header>
    </section>
  );
};
