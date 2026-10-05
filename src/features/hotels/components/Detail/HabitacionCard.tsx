import type { ReactNode } from 'react';
import { formatCurrency } from '@/utils/formatCurrency';
import type { HabitacionDetalle } from '../../hotels.types';
import { formatNoches } from '../../hotelFormat';

interface Props {
  habitacion: HabitacionDetalle;
  noches: number | null;
  /** Acción de la card (E2: "Agregar al carrito"). */
  accion?: ReactNode;
}

export const HabitacionCard = ({ habitacion: h, noches, accion }: Props) => {
  const cotizada = h.disponible !== null && noches !== null;
  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm md:flex-row md:items-center">
      {h.imagenes[0] && (
        <img
          src={h.imagenes[0]}
          alt={h.nombre}
          loading="lazy"
          className="h-32 w-full rounded-xl object-cover md:w-44"
        />
      )}
      <div className="flex flex-1 flex-col gap-1">
        <h4 className="text-secondary text-lg font-bold">{h.nombre}</h4>
        {h.descripcion && <p className="text-secondary/70 text-sm">{h.descripcion}</p>}
        <p className="text-secondary/60 flex items-center gap-1 text-sm">
          <span className="material-symbols-outlined text-[18px]">group</span>
          Hasta {h.capacidad} {h.capacidad === 1 ? 'persona' : 'personas'}
        </p>
        {cotizada && h.disponible && h.unidadesLibres !== null && h.unidadesLibres <= 3 && (
          <p className="text-primary text-xs font-bold">
            {h.unidadesLibres === 1
              ? 'Queda 1 habitación'
              : `Quedan ${h.unidadesLibres} habitaciones`}
          </p>
        )}
      </div>
      <div className="flex flex-col items-start gap-1 md:items-end md:text-right">
        {cotizada ? (
          h.disponible ? (
            <>
              <p className="text-secondary/50 text-xs">
                {h.habitacionesNecesarias}{' '}
                {h.habitacionesNecesarias === 1 ? 'habitación' : 'habitaciones'} ·{' '}
                {formatNoches(noches)}
              </p>
              <p className="text-primary text-2xl font-bold">
                {formatCurrency(h.precioTotal ?? 0)}
              </p>
              {accion}
            </>
          ) : (
            <p className="text-alert font-semibold">Sin lugar para tus fechas</p>
          )
        ) : (
          <p className="text-primary text-xl font-bold">
            {formatCurrency(h.precioPorNoche)}
            <span className="text-secondary/50 text-sm font-medium"> /noche</span>
          </p>
        )}
      </div>
    </article>
  );
};
