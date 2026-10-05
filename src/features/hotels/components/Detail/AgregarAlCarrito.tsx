import { useId, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import type { ErrorApi } from '@/features/cart/cart.types';
import { capacidadSuficiente, opcionesCantidad } from '@/features/cart/carrito';
import { useAuthStore } from '@/store/useAuthStore';
import { useCarritoStore } from '@/store/useCarritoStore';
import { formatCurrency } from '@/utils/formatCurrency';
import type { HabitacionDetalle, HotelSearchParams } from '../../hotels.types';

interface Props {
  hotelId: string;
  habitacion: HabitacionDetalle;
  params: HotelSearchParams;
}

/** Texto en castellano para lo que puede responder POST /carrito/estadias. */
const mensajeError = (e: ErrorApi): string => {
  if (e.status === 403) return e.mensaje || 'Solo las cuentas de cliente pueden reservar.';
  if (e.codigo === 'CARRITO_EN_USO')
    return 'Tu carrito se está actualizando en este momento. Probá de nuevo en unos segundos.';
  if (e.codigo === 'ESTADO_INVALIDO')
    return 'Tu carrito ya no admite cambios. Revisalo en el carrito o armá uno nuevo.';
  if (e.status === 410 || e.codigo === 'CARRITO_EXPIRADO')
    return 'Tu carrito venció mientras agregábamos la estadía. Probá de nuevo.';
  return e.mensaje;
};

/**
 * Cantidad de habitaciones y "Agregar al carrito". Sin sesión manda a /login y vuelve al detalle
 * con las mismas fechas (ProtectedRoute guarda location en state.from). Con sesión, agrega y
 * abre /carrito. El total mostrado es orientativo: vale el que devuelve el carrito.
 */
export const AgregarAlCarrito = ({ hotelId, habitacion: h, params }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const agregarEstadia = useCarritoStore((s) => s.agregarEstadia);
  const opciones = opcionesCantidad(h.habitacionesNecesarias, h.unidadesLibres);
  const necesarias = opciones[0] ?? 1;
  const [cantidad, setCantidad] = useState(necesarias);
  const [enviando, setEnviando] = useState(false);
  const enCurso = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const selectId = useId();

  if (!params.checkIn || !params.checkOut) return null;
  if (user && user.role !== 'USER') {
    return (
      <p className="text-secondary/70 text-sm md:text-right">
        Solo las cuentas de cliente pueden reservar.
      </p>
    );
  }
  if (opciones.length === 0) {
    return (
      <p role="status" className="text-secondary/70 text-sm md:text-right">
        No hay suficientes habitaciones libres para {params.huespedes} huéspedes
      </p>
    );
  }
  const { checkIn, checkOut } = params;
  // Si cambian las fechas o los huéspedes, la cantidad elegida puede quedar fuera de rango.
  const cantidadValida = opciones.includes(cantidad) ? cantidad : necesarias;

  const agregar = async () => {
    if (enCurso.current) return;
    setError(null);
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }
    if (!capacidadSuficiente(params.huespedes, h.capacidad, cantidadValida)) {
      setError(`Para ${params.huespedes} huéspedes necesitás más habitaciones.`);
      return;
    }
    enCurso.current = true;
    setEnviando(true);
    const r = await agregarEstadia({
      hotelId,
      tipoHabitacionId: h.id,
      checkIn,
      checkOut,
      cantidadHabitaciones: cantidadValida,
      huespedes: params.huespedes,
    });
    enCurso.current = false;
    setEnviando(false);
    if (r.ok) navigate('/carrito');
    else setError(mensajeError(r.error));
  };

  return (
    <div className="flex w-full flex-col gap-2 md:w-56 md:items-end">
      {opciones.length > 1 && (
        <label htmlFor={selectId} className="text-secondary/70 flex items-center gap-2 text-sm">
          Habitaciones
          <select
            id={selectId}
            value={cantidadValida}
            disabled={enviando}
            onChange={(e) => {
              setCantidad(Number(e.target.value));
              setError(null);
            }}
            className="text-secondary h-10 rounded-lg border border-[#E2E8F0] bg-white px-2 font-semibold"
          >
            {opciones.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
      )}
      <button
        type="button"
        onClick={agregar}
        disabled={enviando}
        aria-busy={enviando}
        className="bg-primary hover:bg-primary/90 focus-visible:outline-primary flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-5 font-bold text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-wait disabled:opacity-60"
      >
        <span aria-hidden="true" className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
        {enviando ? 'Agregando...' : 'Agregar al carrito'}
      </button>
      {cantidadValida !== necesarias && h.precioTotal !== null && (
        <p className="text-secondary/70 text-xs">
          Total estimado con {cantidadValida} habitaciones:{' '}
          {formatCurrency((h.precioTotal / necesarias) * cantidadValida)}
        </p>
      )}
      {error && (
        <p role="alert" className="text-alert text-sm font-semibold md:text-right">
          {error}
        </p>
      )}
    </div>
  );
};
