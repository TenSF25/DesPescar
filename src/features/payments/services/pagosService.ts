import { api } from '@/config/api';
import { debeConciliar, ultimoPago } from '../pagos';
import type { EstadoPago, Pago, RetornoPago } from '../payments.types';

const BASE = '/api/payments';

/** Crea (o reutiliza, D19) el pago del carrito o, con parteNumero, el de esa parte del grupo (CB4). El monto lo pone el servidor. */
export const crearPago = async (reservationId: number, parteNumero?: number): Promise<Pago> => {
  const res = await api.post<Pago>(
    BASE,
    parteNumero ? { reservationId, parteNumero } : { reservationId },
  );
  return res.data;
};

export const obtenerPago = async (id: string): Promise<Pago> => {
  const res = await api.get<Pago>(`${BASE}/${encodeURIComponent(id)}`);
  return res.data;
};

export const pagosDeReserva = async (reservaId: number): Promise<Pago[]> => {
  const res = await api.get<Pago[]>(`${BASE}/reservation/${reservaId}`);
  return res.data;
};

/** Solo con el proveedor mock. */
export const simularPago = async (id: string, aprobado: boolean): Promise<Pago> => {
  const res = await api.post<Pago>(`${BASE}/${encodeURIComponent(id)}/simulacion`, { aprobado });
  return res.data;
};

/** Solo con Mercado Pago: confirma el pago con el payment_id que agregó MP a la back_url. */
export const conciliarPago = async (id: string, mpPaymentId: string): Promise<Pago> => {
  const res = await api.post<Pago>(`${BASE}/${encodeURIComponent(id)}/conciliacion`, {
    mpPaymentId,
  });
  return res.data;
};

/**
 * El pago al que apunta la vuelta de la pasarela. Con el mock, el último de la reserva (o de la
 * parte, si la URL la trae); con Mercado Pago concilia con el payment_id mientras el pago siga
 * pendiente (D16) y, si no se puede, devuelve el estado guardado. null si la reserva no tiene pagos.
 */
export const leerPagoDeRetorno = async (
  retorno: RetornoPago,
  estadoPrevio: EstadoPago | null,
): Promise<Pago | null> => {
  if (retorno.tipo === 'mock') {
    return ultimoPago(await pagosDeReserva(retorno.reservaId), retorno.parte ?? undefined);
  }
  if (debeConciliar(estadoPrevio, retorno.mpPaymentId)) {
    try {
      return await conciliarPago(retorno.pagoId, retorno.mpPaymentId ?? '');
    } catch {
      // Si MP todavía no lo informa o no corresponde, se muestra el estado guardado.
    }
  }
  return obtenerPago(retorno.pagoId);
};
