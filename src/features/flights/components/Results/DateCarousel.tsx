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
      <header className="relative flex h-18 items-center justify-between gap-3 overflow-hidden">
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
          className="flex h-full flex-1 snap-x snap-mandatory scrollbar-none gap-4 overflow-x-auto py-1"
          ref={containerDates}
        >
          {dates.map((day) => {
            const isSelected = day.isSelected;

            return (
              <button
                key={day.id}
                type="button"
                onClick={() => cambiarFecha(day.formatted)}
                className={`flex min-w-0 shrink-0 cursor-pointer snap-center flex-col items-center justify-center gap-1 rounded-xl border p-3 transition-colors ${
                  isSelected
                    ? 'border-primary text-primary bg-primary/5 font-bold'
                    : 'text-secondary border-black/15'
                }`}
                style={{ width: 'calc((100% - (6 * 1rem)) / 7)' }}
                ref={isSelected ? dateActive : null}
              >
                <span className="text-sm font-semibold capitalize">{day.formatted}</span>
                <span className="text-xs">Desde $&nbsp;1.050</span>
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
