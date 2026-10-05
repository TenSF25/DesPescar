import type { Carrito, ErrorApi } from '@/features/cart/cart.types';
import type { KoiOpcion } from './koi.types';
import {
  mensajeErrorCarrito,
  planDeCarrito,
  type AccionKoi,
  type VueloParaAsientos,
} from './koiAcciones';

type Resultado = { ok: true } | { ok: false; error: ErrorApi };

/** Lo que el flujo necesita del carrito: las acciones del store (que descartan lo que llega tras cerrar sesión). */
export interface DepsCarrito {
  recargar: () => Promise<void>;
  /** Estado actual del store: el carrito y el error de la última carga. */
  leer: () => { carrito: Carrito | null; error: string | null };
  agregarEstadia: (pedido: NonNullable<ReturnType<typeof planDeCarrito>['estadia']>) => Promise<Resultado>;
  quitarVuelo: () => Promise<Resultado>;
}

export type SalidaFlujo =
  | { tipo: 'confirmarReemplazo' }
  | { tipo: 'agregado' }
  | { tipo: 'asientos'; vuelo: VueloParaAsientos; destino: '/booking/seats' }
  | { tipo: 'descartado' }
  | { tipo: 'error'; texto: string };

export const MENSAJE_HOTEL_SIN_QUITAR_VUELO =
  'El hotel ya está en tu carrito; no pudimos quitar el vuelo anterior. Probá de nuevo o andá al carrito.';

/** Marca de la estadía ya agregada, para que un reintento del reemplazo no la agregue dos veces. */
export interface EstadiaAgregada {
  clave: string | null;
}

export const claveDeAccion = (opcion: KoiOpcion, accion: AccionKoi) =>
  `${opcion.optionId}:${accion}`;

/** Al reemplazar, si el vuelo ya no está (404) o el carrito venció (410) no hay nada que quitar. */
const yaNoHayVuelo = (e: ErrorApi) =>
  e.status === 410 ||
  (e.status === 404 && (e.codigo === 'SIN_VUELO' || e.codigo === 'CARRITO_NO_ENCONTRADO'));

const esSesionCambiada = (e: ErrorApi) => e.codigo === 'SESION_CAMBIADA';

const errorDe = (e: ErrorApi): SalidaFlujo =>
  esSesionCambiada(e)
    ? { tipo: 'descartado' }
    : { tipo: 'error', texto: mensajeErrorCarrito(e.status ?? undefined, e.codigo ?? undefined) };

/**
 * Orden del reemplazo (TODO con vuelo en el carrito): primero la estadía, después quitar el
 * vuelo y recién ahí se pasa a los asientos. Si la estadía falla no se toca nada.
 */
export const ejecutarFlujoCarrito = async (
  opcion: KoiOpcion,
  accion: AccionKoi,
  reemplazar: boolean,
  deps: DepsCarrito,
  agregada: EstadiaAgregada,
): Promise<SalidaFlujo> => {
  const plan = planDeCarrito(opcion, accion);
  const clave = claveDeAccion(opcion, accion);

  if (plan.vuelo && !reemplazar) {
    await deps.recargar();
    const { carrito, error } = deps.leer();
    if (error) return { tipo: 'error', texto: mensajeErrorCarrito(undefined) };
    if (carrito?.vuelo) return { tipo: 'confirmarReemplazo' };
  }

  if (plan.estadia && agregada.clave !== clave) {
    const r = await deps.agregarEstadia(plan.estadia);
    if (!r.ok) return errorDe(r.error);
    agregada.clave = clave;
  }

  if (plan.vuelo && reemplazar) {
    const r = await deps.quitarVuelo();
    if (!r.ok && !yaNoHayVuelo(r.error)) {
      if (esSesionCambiada(r.error)) return { tipo: 'descartado' };
      return plan.estadia
        ? { tipo: 'error', texto: MENSAJE_HOTEL_SIN_QUITAR_VUELO }
        : errorDe(r.error);
    }
  }

  agregada.clave = null;
  if (plan.vuelo && plan.navegarA) {
    return { tipo: 'asientos', vuelo: plan.vuelo, destino: plan.navegarA };
  }
  return { tipo: 'agregado' };
};
