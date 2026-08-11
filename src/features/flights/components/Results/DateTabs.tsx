import { useRef } from 'react';
import { cn } from '../../../../utils/cn';
import { formatCurrency } from '../../../../utils/formatCurrency';
import type { FechaDisponible } from '../../flights.types';

interface DateTabsProps {
  fechas: FechaDisponible[];
  fechaSeleccionada: string;
  onSelect: (fecha: string) => void;
}

const formatearDia = (fechaISO: string) => {
  const fecha = new Date(`${fechaISO}T00:00:00`);
  const diaSemana = new Intl.DateTimeFormat('es-AR', { weekday: 'short' }).format(fecha);
  const diaMes = new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'short' }).format(fecha);
  return { diaSemana, diaMes };
};

export const DateTabs = ({ fechas, fechaSeleccionada, onSelect }: DateTabsProps) => {
  const contenedorRef = useRef<HTMLDivElement>(null);

  const scroll = (direccion: 'izq' | 'der') => {
    contenedorRef.current?.scrollBy({
      left: direccion === 'izq' ? -220 : 220,
      behavior: 'smooth',
    });
  };

  return (
    <div className="flex w-full items-center gap-2">
      <button
        type="button"
        onClick={() => scroll('izq')}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/20 hover:bg-black/5"
      >
        <span className="material-symbols-outlined">chevron_left</span>
      </button>

      <div ref={contenedorRef} className="flex w-full gap-3 overflow-x-auto scroll-smooth pb-1">
        {fechas.map(({ fecha, precioDesde }) => {
          const { diaSemana, diaMes } = formatearDia(fecha);
          const activo = fecha === fechaSeleccionada;

          return (
            <button
              type="button"
              key={fecha}
              onClick={() => onSelect(fecha)}
              className={cn(
                'flex min-w-32 shrink-0 flex-col items-center gap-1 rounded-xl border p-3 transition-colors',
                activo ? 'border-primary bg-primary/5' : 'border-black/15 hover:border-black/30',
              )}
            >
              <span
                className={cn(
                  'text-sm font-semibold capitalize',
                  activo ? 'text-primary' : 'text-secondary',
                )}
              >
                {diaSemana} {diaMes}
              </span>
              <span className={cn('text-xs', activo ? 'text-primary' : 'text-[#44474E]')}>
                Desde {formatCurrency(precioDesde)}
              </span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => scroll('der')}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/20 hover:bg-black/5"
      >
        <span className="material-symbols-outlined">chevron_right</span>
      </button>
    </div>
  );
};
