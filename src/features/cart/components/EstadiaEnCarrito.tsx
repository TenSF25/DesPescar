import { PoliticaCancelacion } from '@/features/hotels/components/Detail/PoliticaCancelacion';
import { formatFechaCorta, formatHuespedes, formatNoches } from '@/features/hotels/hotelFormat';
import { useCarritoStore } from '@/store/useCarritoStore';
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/formatCurrency';
import type { EstadiaCarrito } from '../cart.types';
import { CARD, FOCO } from './estilos';
import { QuitarItem } from './QuitarItem';

const Dato = ({ icono, children }: { icono: string; children: React.ReactNode }) => (
  <p className="flex items-start gap-2">
    <span aria-hidden className="material-symbols-outlined text-secondary/60 text-[18px]">
      {icono}
    </span>
    <span>{children}</span>
  </p>
);

export const EstadiaEnCarrito = ({ estadia: e }: { estadia: EstadiaCarrito }) => {
  const quitarEstadia = useCarritoStore((s) => s.quitarEstadia);

  const quitar = async () => {
    const r = await quitarEstadia(e.id);
    return r.ok ? null : r.error.mensaje;
  };

  return (
    <article className={cn('flex flex-col gap-4', CARD)}>
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-48 flex-1 items-center gap-3">
          <div className="bg-secondary/5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full">
            <span aria-hidden className="material-symbols-outlined text-secondary">
              hotel
            </span>
          </div>
          <div className="min-w-0">
            <h2 className="text-secondary line-clamp-2 text-lg font-bold">{e.hotelNombre}</h2>
            <p className="text-secondary/60 text-sm">{e.ciudad}</p>
          </div>
        </div>
        <QuitarItem que={`la estadía en ${e.hotelNombre}`} onQuitar={quitar} />
      </header>

      <div className="text-secondary/80 flex flex-col gap-1.5 text-sm">
        <p className="text-secondary font-semibold">
          {e.cantidadHabitaciones} × {e.tipoHabitacionNombre}
        </p>
        <Dato icono="calendar_month">
          {formatFechaCorta(e.checkIn)} – {formatFechaCorta(e.checkOut)} · {formatNoches(e.noches)}{' '}
          · {formatHuespedes(e.huespedes)}
        </Dato>
        <Dato icono="schedule">Check-in desde las {e.horaCheckIn.slice(0, 5)} h (hora local)</Dato>
        {e.titularNombre && <Dato icono="badge">Titular: {e.titularNombre}</Dato>}
      </div>

      <details className="group rounded-xl border border-[#E2E8F0]">
        <summary
          className={cn(
            'text-secondary flex min-h-11 cursor-pointer list-none items-center justify-between rounded-xl px-4 text-sm font-semibold [&::-webkit-details-marker]:hidden',
            FOCO,
          )}
        >
          Política de cancelación
          <span
            aria-hidden
            className="material-symbols-outlined transition-transform group-open:rotate-180"
          >
            expand_more
          </span>
        </summary>
        <div className="px-4 pb-4">
          <PoliticaCancelacion tramos={e.politicaCancelacion} />
        </div>
      </details>

      <div className="flex items-end justify-between border-t border-[#E2E8F0] pt-4">
        <p className="text-secondary/70 text-sm">Total de la estadía</p>
        <p className="text-primary text-2xl font-bold">{formatCurrency(e.precioTotal)}</p>
      </div>
    </article>
  );
};
