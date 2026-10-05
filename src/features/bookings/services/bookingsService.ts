import { api } from '@/config/api';
import type { BookingDetail } from '../bookings.types';

export const getBooking = async (bookingId: number) => {
  const res = await api.get<BookingDetail>(`/api/bookings/${bookingId}`);
  return res.data;
};

export const cancelBooking = async (bookingId: number | string) => {
  await api.delete(`/api/bookings/${bookingId}`);
};

/** Datos del vuelo (aeropuertos y horarios) a partir del código que guarda la reserva. */
export const getFlightByNumber = async (flightNumber: string) => {
  const res = await api.get<FlightApiResponse>(`/api/flights/number/${flightNumber}`);
  return res.data;
};

/** FlightResponse de flightservice (distinto del DetailedFlightResponseDto de la búsqueda). */
export interface FlightApiResponse {
  id: string;
  flightNumber: string;
  originAirport: { code: string; city: string };
  destinationAirport: { code: string; city: string };
  departureTime: string;
  arrivalTime: string;
}
