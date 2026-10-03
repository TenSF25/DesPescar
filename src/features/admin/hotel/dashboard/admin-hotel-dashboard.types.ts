import type { DonutChartDatum, LineChartDatum } from '@/components/admin';
import type { HotelReservation } from '../shared/hotel.types';

/** Algo que requiere atención del administrador, con el enlace a donde resolverlo. */
export interface DashboardAlert {
  id: string;
  icon: string;
  iconClassName: string;
  title: string;
  subtitle: string;
  to: string;
}

export interface DashboardActivityItem {
  id: string;
  icon: string;
  iconClassName: string;
  title: string;
  subtitle: string;
  time: string;
}

export interface HotelDashboardData {
  checkInsHoy: number;
  checkOutsHoy: number;
  huespedesAlojados: number; // reservas en estadía ahora
  ocupacionHoy: number; // %
  habitacionesOcupadas: number;
  totalHabitaciones: number;
  ventasHoy: number;
  ventasDeltaPct: number; // vs ayer
  reservasHoy: number;
  bookingsByHour: LineChartDatum[];
  reservationsByStatus: DonutChartDatum[];
  occupancyByRoom: { habitacion: string; ocupacion: number }[];
  arrivals: HotelReservation[];
  alerts: DashboardAlert[];
  activity: DashboardActivityItem[];
}
