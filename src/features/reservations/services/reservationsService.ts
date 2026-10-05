import { api } from '@/config/api';
import type { Carrito } from '@/features/cart/cart.types';
import type { FlightById } from '@/features/flights/flights.types';
import type { Cancelacion } from '../reservations.types';

const BASE = '/api/bookings';

/** Reservas confirmadas y canceladas del usuario, la más nueva primero. */
export const listarMisReservas = async (): Promise<Carrito[]> => {
  const res = await api.get<Carrito[]>(`${BASE}/mias`);
  return res.data;
};

export const obtenerVuelo = async (id: string): Promise<FlightById> => {
  const res = await api.get<FlightById>(`/api/flights/${id}`);
  return res.data;
};

/** Cuánto se devolvería cancelando ahora (o lo que se devolvió, si ya está cancelada). */
export const verCancelacion = async (id: string): Promise<Cancelacion> => {
  const res = await api.get<Cancelacion>(`${BASE}/${id}/cancelacion`);
  return res.data;
};

/** Cancela la reserva entera y pide el reembolso. Repetirlo devuelve el mismo resultado. */
export const cancelarReserva = async (id: string): Promise<Cancelacion> => {
  const res = await api.post<Cancelacion>(`${BASE}/${id}/cancelacion`);
  return res.data;
};
