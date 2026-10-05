import { api } from '@/config/api';
import type { Pago } from '../payments.types';

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
