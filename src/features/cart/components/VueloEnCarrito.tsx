import type { FlightById } from '@/features/flights/flights.types';
import { useFlightId } from '@/hooks/useAPI';
import { useCarritoStore } from '@/store/useCarritoStore';
import { useFlightStore } from '@/store/useFlightStore';
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate } from '@/utils/formatDate';
import type { Carrito, VueloCarrito } from '../cart.types';
import { pasajerosVisibles } from '../carrito';
import { CARD } from './estilos';
import { QuitarItem } from './QuitarItem';

const hora = (iso: string) => iso.slice(11, 16);

const Tramo = ({ etiqueta, vuelo }: { etiqueta: string; vuelo: FlightById }) => (
  <div className="flex flex-col gap-1 rounded-xl border border-[#E2E8F0] p-3 sm:flex-row sm:items-center sm:gap-4">
    <span className="bg-secondary/5 text-secondary w-fit rounded-md px-2 py-0.5 text-[11px] font-bold tracking-wide">
      {etiqueta}
    </span>
    <div className="flex min-w-0 flex-col">
      <span className="text-secondary font-semibold">
        {vuelo.originAirport.city} ({vuelo.originAirport.code}) → {vuelo.destinationAirport.city} (
        {vuelo.destinationAirport.code})
      </span>
      <span className="text-secondary/60 text-sm">
        {formatDate(vuelo.departureTime)} → {hora(vuelo.arrivalTime)} · {vuelo.flightNumber}
      </span>
    </div>
  </div>
);

/** Parte de vuelo del carrito. Ciudades y horarios salen de GET /api/flights/{id} (D28). */
export const VueloEnCarrito = ({ carrito, vuelo }: { carrito: Carrito; vuelo: VueloCarrito }) => {
  const { flightById: ida, isLoading, error } = useFlightId(vuelo.flightIds[0]);
  const { flightById: vuelta } = useFlightId(vuelo.flightIds[1] ?? '');
  const quitarVuelo = useCarritoStore((s) => s.quitarVuelo);
  const limpiarCompra = useFlightStore((s) => s.limpiarCompra);
  const pasajeros = pasajerosVisibles(carrito);

  const quitar = async () => {
    const r = await quitarVuelo();
    if (!r.ok) return r.error.mensaje;
    limpiarCompra();
    return null;
  };

  return (
    <article className={cn('flex flex-col gap-4', CARD)}>
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-48 flex-1 items-center gap-3">
          <div className="bg-secondary/5 flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full">
            {ida?.airline.logoUrl ? (
              <img src={ida.airline.logoUrl} alt="" className="h-full w-full object-contain p-1" />
            ) : (
              <span aria-hidden className="material-symbols-outlined text-secondary">
                flight
              </span>
            )}
          </div>
          <div className="min-w-0">
            <h2 className="text-secondary text-lg font-bold">Vuelo</h2>
            <p className="text-secondary/60 truncate text-sm">
              {ida?.airline.name ?? 'Aerolínea'} ·{' '}
              {vuelo.flightIds.length === 2 ? 'Ida y vuelta' : 'Solo ida'}
            </p>
          </div>
        </div>
        <QuitarItem que="el vuelo" anuncio="Quitamos el vuelo del carrito." onQuitar={quitar} />
      </header>

      <div className="flex flex-col gap-2">
        {ida && <Tramo etiqueta="IDA" vuelo={ida} />}
        {vuelta && <Tramo etiqueta="VUELTA" vuelo={vuelta} />}
        {isLoading && !ida && (
          <div className="h-16 animate-pulse rounded-xl bg-[#F1F5F9]" aria-hidden />
        )}
        {error && !ida && (
          <p className="text-secondary/70 text-sm">Sale el {formatDate(vuelo.salida)}.</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-secondary/70 text-xs font-bold tracking-wider uppercase">Pasajeros</h3>
        <ul className="flex flex-wrap gap-2">
          {pasajeros.map((p, i) => (
            <li
              key={i}
              className="text-secondary flex items-center gap-2 rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm"
            >
              <span aria-hidden className="material-symbols-outlined text-[18px]">
                person
              </span>
              {p.nombre}
              {p.asiento && (
                <span className="bg-secondary rounded-md px-1.5 py-0.5 text-xs font-bold text-white">
                  <span className="sr-only">asiento </span>
                  {p.asiento}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-1 border-t border-[#E2E8F0] pt-4 sm:flex-row sm:items-end sm:justify-between">
        <p className="text-secondary/70 text-sm">
          Tarifa {vuelo.tarifas} · {formatCurrency(vuelo.precioPorPasajero)} por pasajero ×{' '}
          {vuelo.cantidadPasajeros}
        </p>
        <p className="text-primary text-2xl font-bold">{formatCurrency(vuelo.subtotal)}</p>
      </div>
    </article>
  );
};
