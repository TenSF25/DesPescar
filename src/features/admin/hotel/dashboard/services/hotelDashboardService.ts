import { addDays, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { distributeByHour } from '@/utils/distributeByHour';
import { mockDelay } from '@/utils/mockDelay';
import {
  getHotel,
  getReservations,
  occupiedNights,
  totalRoomUnits,
} from '../../shared/hotelService';
import { formatHotelDate } from '../../shared/hotel.utils';
import type { HotelReservation, ReservationStatus } from '../../shared/hotel.types';
import type {
  DashboardActivityItem,
  DashboardAlert,
  HotelDashboardData,
} from '../admin-hotel-dashboard.types';

const ISO = 'yyyy-MM-dd';
const LOW_OCCUPANCY_PCT = 40;
const ARRIVALS_LIMIT = 5;

const STATUS_COLORS: Record<ReservationStatus, string> = {
  Próxima: '#3457a6',
  'En estadía': '#f59e0b',
  Completada: '#16794c',
  Cancelada: '#ba1a1a',
};

const sales = (reservations: HotelReservation[], iso: string) =>
  reservations
    .filter((r) => r.creadaEl === iso && r.estado !== 'Cancelada')
    .reduce((total, r) => total + r.total, 0);

const deltaPct = (current: number, previous: number) =>
  previous === 0 ? 0 : Math.round(((current - previous) / previous) * 1000) / 10;

const nightsOn = (reservations: HotelReservation[], iso: string) =>
  reservations.reduce((total, r) => total + occupiedNights(r, iso, iso), 0);

// TODO(backend): armar todo esto con los endpoints reales de hotel y reservas
// (siempre filtrado por el hotel del usuario HOTEL_ADMIN).
export const getHotelDashboardData = async (): Promise<HotelDashboardData> => {
  await mockDelay();
  const [hotel, reservations] = await Promise.all([getHotel(), getReservations()]);
  const today = new Date();
  const todayISO = format(today, ISO);
  const yesterdayISO = format(addDays(today, -1), ISO);
  const units = totalRoomUnits(hotel.rooms);

  const active = reservations.filter((r) => r.estado !== 'Cancelada');
  const checkIns = active.filter((r) => r.checkIn === todayISO);
  const checkOuts = active.filter((r) => r.checkOut === todayISO);
  const createdToday = reservations.filter((r) => r.creadaEl === todayISO);
  const occupied = nightsOn(reservations, todayISO);

  const windowStart = format(addDays(today, -30), ISO);
  const windowEnd = format(addDays(today, 30), ISO);
  const reservationsByStatus = (Object.keys(STATUS_COLORS) as ReservationStatus[])
    .map((estado) => ({
      label: estado,
      value: reservations.filter(
        (r) => r.estado === estado && r.checkIn >= windowStart && r.checkIn <= windowEnd,
      ).length,
      color: STATUS_COLORS[estado],
    }))
    .filter((item) => item.value > 0);

  const occupancyByRoom = hotel.rooms.map((room) => ({
    habitacion: room.nombre,
    ocupacion: Math.round(
      (nightsOn(
        reservations.filter((r) => r.roomId === room.id),
        todayISO,
      ) /
        room.unidades) *
        100,
    ),
  }));

  const arrivals = reservations
    .filter((r) => r.estado === 'Próxima' && r.checkIn >= todayISO)
    .sort((a, b) => a.checkIn.localeCompare(b.checkIn))
    .slice(0, ARRIVALS_LIMIT);

  const alerts: DashboardAlert[] = [];
  const stayingOut = checkOuts.filter((r) => r.estado === 'En estadía').length;
  if (stayingOut > 0) {
    alerts.push({
      id: 'checkouts-today',
      icon: 'logout',
      iconClassName: 'bg-amber-100 text-amber-700',
      title: `${stayingOut} check-outs para hoy`,
      subtitle: 'Registra la salida cuando los huéspedes dejen la habitación',
      to: '/admin/hotel/reservas',
    });
  }
  for (let offset = 1; offset <= 7 && alerts.length < 4; offset++) {
    const day = addDays(today, offset);
    const dayISO = format(day, ISO);
    const pct = units > 0 ? Math.round((nightsOn(reservations, dayISO) / units) * 100) : 0;
    if (pct < LOW_OCCUPANCY_PCT) {
      alerts.push({
        id: `low-${dayISO}`,
        icon: 'trending_down',
        iconClassName: 'bg-red-100 text-alert',
        title: `Baja ocupación el ${format(day, "EEEE d 'de' MMMM", { locale: es })}`,
        subtitle: `Solo ${pct}% de las habitaciones reservadas`,
        to: '/admin/hotel/reservas',
      });
    }
  }
  const unavailable = hotel.rooms.filter((room) => !room.disponible);
  if (unavailable.length > 0) {
    alerts.push({
      id: 'rooms-unavailable',
      icon: 'block',
      iconClassName: 'bg-red-100 text-alert',
      title: `${unavailable.length} tipo(s) de habitación no disponible(s)`,
      subtitle: unavailable.map((room) => room.nombre).join(', '),
      to: '/admin/hotel/gestion',
    });
  }

  const newestReservations: DashboardActivityItem[] = [...reservations]
    .sort((a, b) => b.creadaEl.localeCompare(a.creadaEl))
    .filter((r) => r.estado !== 'Cancelada')
    .slice(0, 3)
    .map((r) => ({
      id: `new-${r.id}`,
      icon: 'event_available',
      iconClassName: 'bg-blue-100 text-blue-600',
      title: 'Nueva reserva',
      subtitle: `${r.codigo} · ${r.huesped} (${r.habitacion})`,
      time: formatHotelDate(r.creadaEl),
    }));
  const movements: DashboardActivityItem[] = [
    ...checkIns.slice(0, 1).map((r) => ({
      id: `in-${r.id}`,
      icon: 'login',
      iconClassName: 'bg-green-100 text-green-600',
      title: 'Check-in de hoy',
      subtitle: `${r.huesped} (${r.habitacion})`,
      time: 'Hoy',
    })),
    ...checkOuts.slice(0, 1).map((r) => ({
      id: `out-${r.id}`,
      icon: 'logout',
      iconClassName: 'bg-amber-100 text-amber-700',
      title: 'Check-out de hoy',
      subtitle: `${r.huesped} (${r.habitacion})`,
      time: 'Hoy',
    })),
  ];

  return {
    checkInsHoy: checkIns.length,
    checkOutsHoy: checkOuts.length,
    huespedesAlojados: reservations.filter((r) => r.estado === 'En estadía').length,
    ocupacionHoy: units > 0 ? Math.round((occupied / units) * 100) : 0,
    habitacionesOcupadas: occupied,
    totalHabitaciones: units,
    ventasHoy: sales(reservations, todayISO),
    ventasDeltaPct: deltaPct(sales(reservations, todayISO), sales(reservations, yesterdayISO)),
    reservasHoy: createdToday.length,
    bookingsByHour: distributeByHour(createdToday.length),
    reservationsByStatus,
    occupancyByRoom,
    arrivals,
    alerts,
    activity: [...movements, ...newestReservations],
  };
};
