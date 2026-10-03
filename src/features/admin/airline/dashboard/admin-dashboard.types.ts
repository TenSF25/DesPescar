import type { DonutChartDatum, LineChartDatum } from '@/components/admin';
import type { AdminFlight } from '../flights/admin-flights.types';

export interface UpcomingDeparture {
  flight: AdminFlight;
  /** Pasajes vendidos sobre los asientos, en %. */
  occupancy: number;
}

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

export interface DashboardData {
  ventasHoy: number;
  ventasDeltaPct: number; // vs ayer
  reservasHoy: number;
  reservasDeltaVsAyer: number; // diferencia absoluta
  vuelosHoy: number;
  vuelosEnCurso: number;
  /** Ocupación promedio de las próximas salidas (%). */
  ocupacionProximas: number;
  bookingsByHour: LineChartDatum[];
  flightsByStatus: DonutChartDatum[];
  topRoutes: { ruta: string; reservas: number }[];
  upcoming: UpcomingDeparture[];
  alerts: DashboardAlert[];
  activity: DashboardActivityItem[];
}
