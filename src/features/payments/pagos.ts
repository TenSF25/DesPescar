import type { EstadoCarrito } from '@/features/cart/cart.types';
import type { Pago, ResultadoPago, RetornoPago } from './payments.types';

const valor = (sp: URLSearchParams, clave: string) => {
  const v = sp.get(clave);
  return v && v !== 'null' ? v : null;
};

/** Lee /pago/resultado: ?reserva=<id> (mock) o los parámetros que agrega Mercado Pago (D16). */
export const leerRetornoPago = (sp: URLSearchParams): RetornoPago | null => {
  const pagoId = valor(sp, 'external_reference');
  if (pagoId) {
    return {
      tipo: 'mercadopago',
      pagoId,
      // Solo dígitos: si falta, es "null" o trae otra cosa, no se concilia.
      mpPaymentId: /^\d+$/.test(valor(sp, 'payment_id') ?? '') ? valor(sp, 'payment_id') : null,
      estadoMp: valor(sp, 'status') ?? valor(sp, 'collection_status'),
    };
  }
  const reservaId = Number(valor(sp, 'reserva'));
  return Number.isInteger(reservaId) && reservaId > 0 ? { tipo: 'mock', reservaId } : null;
};

/** El pago más reciente de una reserva (GET /api/payments/reservation/{id} trae todos). */
export const ultimoPago = (pagos: Pago[]): Pago | null =>
  pagos.reduce<Pago | null>(
    (ultimo, p) => (!ultimo || p.createdAt > ultimo.createdAt ? p : ultimo),
    null,
  );

const carritoVigente = (estado: EstadoCarrito) =>
  estado === 'INICIADA' || estado === 'PENDIENTE_PAGO';

/** Qué mostrar según el estado del pago y el de la reserva. */
export const resultadoPago = (pago: Pago, estadoReserva: EstadoCarrito): ResultadoPago => {
  const reintentar = carritoVigente(estadoReserva);
  switch (pago.status) {
    case 'APPROVED':
      return estadoReserva === 'CONFIRMADA'
        ? {
            tono: 'exito',
            titulo: '¡Reserva confirmada!',
            detalle: 'Te enviamos el detalle por correo. Los lugares ya quedaron a tu nombre.',
            seguirConsultando: false,
            reintentar: false,
          }
        : {
            tono: 'pendiente',
            titulo: 'Pago aprobado, confirmando tu reserva',
            detalle: 'Estamos tomando los lugares. Esto puede tardar unos segundos.',
            seguirConsultando: true,
            reintentar: false,
          };
    case 'REFUNDED':
      return {
        tono: 'error',
        titulo: 'No pudimos confirmar tu reserva',
        detalle:
          'Algún lugar dejó de estar disponible o el carrito cambió antes de que se acreditara el pago. Te devolvimos el dinero por el mismo medio.',
        seguirConsultando: false,
        reintentar: false,
      };
    case 'REJECTED':
      return {
        tono: 'error',
        titulo: 'El pago fue rechazado',
        detalle: reintentar
          ? 'No se te cobró nada. Podés volver al carrito e intentar de nuevo.'
          : 'No se te cobró nada. El carrito ya venció: vas a tener que armarlo de nuevo.',
        seguirConsultando: false,
        reintentar,
      };
    case 'CANCELLED':
      return {
        tono: 'error',
        titulo: 'El pago se canceló',
        detalle: 'No se te cobró nada.',
        seguirConsultando: false,
        reintentar,
      };
    default:
      return {
        tono: 'pendiente',
        titulo: 'Estamos esperando la confirmación del pago',
        detalle: 'Si ya pagaste, en unos segundos se actualiza. No cierres esta página.',
        seguirConsultando: true,
        reintentar,
      };
  }
};

/** Cada cuánto se vuelve a consultar un pago pendiente. */
export const ESPERA_CONSULTA_MS = 4000;
/** Después de este tiempo se deja de consultar solo y se ofrece actualizar a mano. */
export const ESPERA_MAXIMA_MS = 2 * 60 * 1000;

/** Si hay que programar otra consulta: el estado sigue pendiente y no se pasó el máximo. */
export const seguirConsultando = (pendiente: boolean, inicio: number, ahora: number) =>
  pendiente && ahora - inicio < ESPERA_MAXIMA_MS;
