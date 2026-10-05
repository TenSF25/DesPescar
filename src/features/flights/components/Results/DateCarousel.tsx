import { useState } from 'react';
import { useDateCarousel } from '../../hooks/useDateCarousel';
import { useSearchParams } from 'react-router';
import { formatCurrency } from '@/utils/formatCurrency';
import { useDatePrices } from '../../hooks/useDatePrices';

/** Precio mínimo de un día: `undefined` mientras carga, `null` si ese día no hay vuelos. */
const DatePrice = ({ price }: { price: number | null | undefined }) => {
  if (price === undefined) {
    return (
      <span className="h-3.5 w-14 animate-pulse rounded bg-black/10" aria-label="Cargando precio" />
    );
  }
  if (price === null) {
    return <span className="text-[10px] font-normal text-black/40 sm:text-xs">Sin vuelos</span>;
  }
  return (
    <span className="flex flex-col items-center leading-tight">
      <span className="text-[9px] font-normal opacity-70 sm:text-[10px]">Desde</span>
      <span className="text-[11px] sm:text-xs">{formatCurrency(price)}</span>
    </span>
  );
};

export const DateCarousel = ({
  activeDate,
  paramKey = 'departureDate',
  origin,
  destination,
  passengers,
}: {
  activeDate: string;
  paramKey?: 'departureDate' | 'returnDate';
  /** Ruta del tramo que se está eligiendo (en la vuelta, ya viene invertida). */
  origin: string;
  destination: string;
  passengers: number;
}) => {
  const { dates, scroll, containerDates, dateActive, isBaseDateToday } =
    useDateCarousel(activeDate);
  const prices = useDatePrices(
    origin,
    destination,
    passengers,
    dates.map((day) => day.id),
    activeDate,
  );

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
      <header className="relative flex h-24 items-center justify-between gap-3 overflow-hidden">
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
          className="flex h-full flex-1 snap-x snap-mandatory scrollbar-none gap-4 overflow-x-auto py-1 [--n:3] sm:[--n:5] lg:[--n:7]"
          ref={containerDates}
        >
          {dates.map((day) => {
            const isSelected = day.isSelected;

            return (
              <button
                key={day.id}
                type="button"
                onClick={() => cambiarFecha(day.formatted)}
                className={`flex min-w-0 shrink-0 cursor-pointer snap-center flex-col items-center justify-center gap-1 rounded-xl border p-2 transition-colors sm:p-3 ${
                  isSelected
                    ? 'border-primary text-primary bg-primary/5 font-bold'
                    : 'text-secondary border-black/15'
                }`}
                style={{ width: 'calc((100% - ((var(--n) - 1) * 1rem)) / var(--n))' }}
                ref={isSelected ? dateActive : null}
              >
                <span className="text-xs font-semibold capitalize sm:text-sm">{day.formatted}</span>
                <DatePrice price={prices[day.id]} />
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
