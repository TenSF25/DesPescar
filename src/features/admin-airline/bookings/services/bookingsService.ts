import { mockDelay } from '../../../../services/mockDelay';
// import { apiRequest } from '../../../../services/apiClient';
// import { API_CONFIG } from '../../../../services/apiConfig';
import type { AdminBooking, BookingStats } from '../admin-bookings.types';

const MOCK_BOOKINGS: AdminBooking[] = [
  { id: 'b1', codigo: 'RSV-10432', pasajero: 'Susana Gómez', email: 'susana.gomez@email.com', numeroVuelo: 'DSC2456', ruta: 'MAD → MEX', fecha: '15 Oct 2024', estado: 'Confirmada', monto: 436 },
  { id: 'b2', codigo: 'RSV-10433', pasajero: 'Roberto Roa', email: 'roberto.roa@email.com', numeroVuelo: 'DSC7891', ruta: 'MIA → BOG', fecha: '16 Oct 2024', estado: 'Pendiente', monto: 195 },
  { id: 'b3', codigo: 'RSV-10434', pasajero: 'Pablo Molina', email: 'pablo.molina@email.com', numeroVuelo: 'DSC1123', ruta: 'JFK → SCL', fecha: '16 Oct 2024', estado: 'Confirmada', monto: 530 },
  { id: 'b4', codigo: 'RSV-10435', pasajero: 'Lucía Fernández', email: 'lucia.fernandez@email.com', numeroVuelo: 'DSC3344', ruta: 'LIM → MAD', fecha: '14 Oct 2024', estado: 'Cancelada', monto: 205 },
  { id: 'b5', codigo: 'RSV-10436', pasajero: 'Martín Castro', email: 'martin.castro@email.com', numeroVuelo: 'DSC6622', ruta: 'EZE → MIA', fecha: '13 Oct 2024', estado: 'Confirmada', monto: 180 },
];

const MOCK_STATS: BookingStats = {
  reservasTotales: 1250,
  confirmadas: 980,
  pendientes: 145,
  ingresosTotales: 1902450,
};

// TODO(backend): apiRequest<AdminBooking[]>(API_CONFIG.bookingsServiceUrl, '/reservas', { params: { search, estado, page } })
export const getBookings = async (): Promise<AdminBooking[]> => {
  await mockDelay();
  return MOCK_BOOKINGS;
};

// TODO(backend): apiRequest<BookingStats>(API_CONFIG.bookingsServiceUrl, '/reservas/stats')
export const getBookingStats = async (): Promise<BookingStats> => {
  await mockDelay();
  return MOCK_STATS;
};
