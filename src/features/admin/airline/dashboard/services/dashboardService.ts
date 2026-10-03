import { format } from 'date-fns';
import { mockDelay } from '@/utils/mockDelay';
import { getFlights } from '../../flights/services/flightsService';
import { formatFlightDate } from '../../flights/flights.utils';
import type { AdminFlight, FlightStatus } from '../../flights/admin-flights.types';
import { getBookings, getBookingStats } from '../../bookings/services/bookingsService';
import { getTodayMetrics, occupancyOf } from '../../reports/services/reportsService';
import type {
  DashboardActivityItem,
  DashboardAlert,
  DashboardData,
} from '../admin-dashboard.types';

const STATUS_COLORS: Record<FlightStatus, string> = {
  Programado: '#f59e0b',
  'En curso': '#3457a6',
  Completado: '#16794c',
  Cancelado: '#ba1a1a',
};

const LOW_OCCUPANCY_PCT = 50;
const UPCOMING_LIMIT = 5;

const byDeparture = (a: AdminFlight, b: AdminFlight) =>
  `${a.fecha}${a.hora}`.localeCompare(`${b.fecha}${b.hora}`);

const deltaPct = (current: number, previous: number) =>
  previous === 0 ? 0 : Math.round(((current - previous) / previous) * 1000) / 10;

const routeOf = (flight: AdminFlight) => `${flight.origen} → ${flight.destino}`;

// TODO(backend): armar todo esto con los endpoints reales de vuelos, reservas y reportes
// (siempre filtrado por la aerolínea del usuario).
export const getDashboardData = async (): Promise<DashboardData> => {
  await mockDelay();
  const [flights, bookings, bookingStats, metrics] = await Promise.all([
    getFlights(),
    getBookings(),
    getBookingStats(),
    getTodayMetrics(),
  ]);
  const todayISO = format(new Date(), 'yyyy-MM-dd');

  const upcomingFlights = flights
    .filter((f) => (f.estado === 'Programado' || f.estado === 'En curso') && f.fecha >= todayISO)
    .sort(byDeparture);
  const upcoming = upcomingFlights
    .slice(0, UPCOMING_LIMIT)
    .map((flight) => ({ flight, occupancy: occupancyOf(flight) }));
  const ocupacionProximas =
    upcoming.length > 0
      ? Math.round(upcoming.reduce((total, item) => total + item.occupancy, 0) / upcoming.length)
      : 0;

  const flightsByStatus = (Object.keys(STATUS_COLORS) as FlightStatus[])
    .map((estado) => ({
      label: estado,
      value: flights.filter((f) => f.estado === estado).length,
      color: STATUS_COLORS[estado],
    }))
    .filter((item) => item.value > 0);

  const alerts: DashboardAlert[] = [];
  if (bookingStats.pendientes > 0) {
    alerts.push({
      id: 'pending-bookings',
      icon: 'hourglass_empty',
      iconClassName: 'bg-amber-100 text-amber-700',
      title: `${bookingStats.pendientes} reservas pendientes`,
      subtitle: 'Esperan confirmación o pago',
      to: '/admin/aerolinea/reservas',
    });
  }
  upcomingFlights
    .filter((f) => f.estado === 'Programado' && occupancyOf(f) < LOW_OCCUPANCY_PCT)
    .forEach((flight) =>
      alerts.push({
        id: `low-${flight.id}`,
        icon: 'airline_seat_recline_normal',
        iconClassName: 'bg-red-100 text-alert',
        title: `Baja ocupación en ${flight.numero}`,
        subtitle: `${routeOf(flight)} sale el ${formatFlightDate(flight.fecha)} con ${occupancyOf(flight)}% ocupado`,
        to: '/admin/aerolinea/vuelos',
      }),
    );

  const flightActivity: DashboardActivityItem[] = flights
    .filter((f) => f.estado !== 'Programado')
    .sort((a, b) => byDeparture(b, a))
    .map((flight) => {
      const detail = {
        'En curso': {
          icon: 'flight_takeoff',
          iconClassName: 'bg-blue-100 text-blue-600',
          title: 'Vuelo en curso',
        },
        Completado: {
          icon: 'check_circle',
          iconClassName: 'bg-green-100 text-green-600',
          title: 'Vuelo completado',
        },
        Cancelado: {
          icon: 'cancel',
          iconClassName: 'bg-red-100 text-alert',
          title: 'Vuelo cancelado',
        },
      }[flight.estado as Exclude<FlightStatus, 'Programado'>];
      return {
        id: `flight-${flight.id}`,
        ...detail,
        subtitle: `${flight.numero} (${routeOf(flight)})`,
        time: `${formatFlightDate(flight.fecha)}, ${flight.hora}`,
      };
    });
  const bookingActivity: DashboardActivityItem[] = bookings
    .filter((b) => b.estado === 'Pendiente')
    .map((booking) => ({
      id: `booking-${booking.id}`,
      icon: 'confirmation_number',
      iconClassName: 'bg-amber-100 text-amber-700',
      title: 'Reserva pendiente',
      subtitle: `${booking.codigo} · ${booking.pasajero} (${booking.ruta})`,
      time: booking.fecha,
    }));

  return {
    ventasHoy: metrics.today.ventas,
    ventasDeltaPct: deltaPct(metrics.today.ventas, metrics.yesterday.ventas),
    reservasHoy: metrics.today.reservas,
    reservasDeltaVsAyer: metrics.today.reservas - metrics.yesterday.reservas,
    vuelosHoy: flights.filter((f) => f.fecha === todayISO).length,
    vuelosEnCurso: flights.filter((f) => f.estado === 'En curso').length,
    ocupacionProximas,
    bookingsByHour: metrics.bookingsByHour,
    flightsByStatus,
    topRoutes: metrics.today.routes.slice(0, 4),
    upcoming,
    alerts,
    activity: [...flightActivity.slice(0, 3), ...bookingActivity.slice(0, 2)],
  };
};
