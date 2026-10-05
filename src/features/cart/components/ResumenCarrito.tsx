import { useBarraInferior } from '@/hooks/useBarraInferior';
import { formatNoches } from '@/features/hotels/hotelFormat';
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/formatCurrency';
import type { Carrito } from '../cart.types';
import { estadiasActivas, faltantes, puedePagar } from '../carrito';
import { CARD, FOCO } from './estilos';

const Paso = ({ hecho, children }: { hecho: boolean; children: string }) => (
  <li
    className={cn('flex items-center gap-2 text-sm', hecho ? 'text-success' : 'text-secondary/70')}
  >
    <span aria-hidden className="material-symbols-outlined text-[20px]">
      {hecho ? 'check_circle' : 'radio_button_unchecked'}
    </span>
    {children}
    <span className="sr-only">{hecho ? '(listo)' : '(pendiente)'}</span>
  </li>
);

/** Desglose del total (columna derecha en escritorio, al final en celulares). */
export const ResumenCarrito = ({ carrito }: { carrito: Carrito }) => {
  const estadias = estadiasActivas(carrito);
  const pendientes = faltantes(carrito);
  return (
    <aside
      aria-labelledby="resumen-carrito"
      className={cn('flex h-fit flex-col gap-4 lg:sticky lg:top-28', CARD)}
    >
      <h2 id="resumen-carrito" className="text-secondary text-lg font-bold">
        Resumen
      </h2>
      <ul className="flex flex-col gap-2 text-sm">
        {carrito.vuelo && (
          <li className="flex justify-between gap-4">
            <span className="text-secondary/80">
              Vuelo · {carrito.vuelo.cantidadPasajeros}{' '}
              {carrito.vuelo.cantidadPasajeros === 1 ? 'pasajero' : 'pasajeros'}
            </span>
            <span className="text-secondary shrink-0 font-semibold">
              {formatCurrency(carrito.vuelo.subtotal)}
            </span>
          </li>
        )}
        {estadias.map((e) => (
          <li key={e.id} className="flex justify-between gap-4">
            <span className="text-secondary/80 min-w-0 truncate">
              {e.hotelNombre} · {formatNoches(e.noches)}
            </span>
            <span className="text-secondary shrink-0 font-semibold">
              {formatCurrency(e.precioTotal)}
            </span>
          </li>
        ))}
      </ul>
      <div className="flex items-end justify-between border-t border-[#E2E8F0] pt-4">
        <span className="text-secondary font-bold">Total</span>
        <span className="text-primary text-2xl font-bold">
          {formatCurrency(carrito.montoTotal)}
        </span>
      </div>
      <p className="text-secondary/60 text-xs">
        Precios finales en pesos argentinos (ARS), calculados por DesPescar al agregar cada ítem.
      </p>
      <div className="flex flex-col gap-2 border-t border-[#E2E8F0] pt-4">
        <h3 className="text-secondary/70 text-xs font-bold tracking-wider uppercase">Para pagar</h3>
        <ul className="flex flex-col gap-1">
          {carrito.vuelo && (
            <Paso hecho={!pendientes.includes('Datos de los pasajeros')}>
              Datos de los pasajeros
            </Paso>
          )}
          {estadias.length > 0 && (
            <Paso hecho={!pendientes.includes('Titular de cada estadía')}>
              Titular de cada estadía
            </Paso>
          )}
        </ul>
      </div>
    </aside>
  );
};

interface BarraProps {
  carrito: Carrito;
  pagando: boolean;
  error: string | null;
  onPagar: () => void;
}

/** Barra fija con el total y "Pagar", como en equipaje y asientos (levanta la burbuja de KOI). */
export const BarraPago = ({ carrito, pagando, error, onPagar }: BarraProps) => {
  useBarraInferior();
  const pendientes = faltantes(carrito);
  const habilitado = puedePagar(carrito) && !pagando;
  const ayuda =
    pendientes.length > 0
      ? `Falta: ${pendientes.join(' y ').toLowerCase()}`
      : `${carrito.cantidadItems} ${carrito.cantidadItems === 1 ? 'ítem' : 'ítems'} · ARS`;

  return (
    <div className="fixed bottom-0 left-0 z-10 flex w-full justify-center border-t border-[#3234392d] bg-white shadow-[0_-4px_16px_rgba(15,23,42,0.06)]">
      <div className="flex w-full max-w-370 items-center justify-between gap-3 px-4 py-3 sm:py-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-[#323439]">Total</p>
          <p className="text-primary text-xl font-bold sm:text-2xl">
            {formatCurrency(carrito.montoTotal)}
          </p>
          <p className="text-secondary/60 truncate text-xs">{ayuda}</p>
        </div>
        <button
          type="button"
          className={cn(
            'bg-primary hover:bg-primary/90 flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full px-6 font-bold text-white transition-colors disabled:cursor-not-allowed disabled:bg-[#CBD5E1] sm:px-10',
            pagando && 'disabled:bg-primary/70 disabled:cursor-wait',
            FOCO,
          )}
          onClick={onPagar}
          disabled={!habilitado}
          aria-busy={pagando}
        >
          <span
            aria-hidden
            className={cn('material-symbols-outlined text-[20px]', pagando && 'animate-spin')}
          >
            {pagando ? 'progress_activity' : 'lock'}
          </span>
          {pagando ? 'Preparando...' : 'Pagar'}
        </button>
      </div>
      {error && (
        <p
          role="alert"
          className="absolute right-3 bottom-full left-3 mb-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 shadow-sm sm:right-auto sm:max-w-lg"
        >
          {error}
        </p>
      )}
    </div>
  );
};
