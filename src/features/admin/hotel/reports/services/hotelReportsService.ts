import { differenceInCalendarDays, eachDayOfInterval, format, parseISO, subDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { mockDelay } from '@/utils/mockDelay';
import {
  getHotel,
  getReservations,
  occupiedNights,
  totalRoomUnits,
} from '../../shared/hotelService';
import type { HotelReservation, HotelRoom } from '../../shared/hotel.types';
import type {
  GeneratedReport,
  HotelReportsData,
  HotelReportsSummary,
  ReportFile,
  ReportFilters,
  ReportGranularity,
  ReportType,
  RoomOption,
  SeriesDatum,
} from '../admin-hotel-reports.types';

const ISO = 'yyyy-MM-dd';

/** Ventana de datos disponibles hacia atrás desde hoy (días). */
export const REPORTS_HISTORY_DAYS = 365;

export const getReportsDateLimits = () => {
  const today = new Date();
  return {
    min: format(subDays(today, REPORTS_HISTORY_DAYS - 1), ISO),
    max: format(today, ISO),
  };
};

export const getDefaultReportFilters = (): ReportFilters => {
  const { max } = getReportsDateLimits();
  return { from: format(subDays(parseISO(max), 29), ISO), to: max, roomId: 'todas' };
};

export const getRoomOptions = async (): Promise<RoomOption[]> => {
  const hotel = await getHotel();
  return hotel.rooms.map((room) => ({ id: String(room.id), label: room.nombre }));
};

// --- Cálculo de métricas -------------------------------------------------------
// TODO(backend): reemplazar por los endpoints de reportes del hotel (desde / hasta / habitación).

const ROOM_COLORS = ['#1f3051', '#3457a6', '#6f8fd6', '#a9bdec', '#c85300'];

const sum = (items: HotelReservation[], pick: (r: HotelReservation) => number) =>
  items.reduce((total, r) => total + pick(r), 0);

const deltaPct = (current: number, previous: number) =>
  previous === 0 ? 0 : Math.round(((current - previous) / previous) * 1000) / 10;

const pointsDelta = (current: number, previous: number) =>
  Math.round((current - previous) * 10) / 10;

const inRange = (iso: string, from: string, to: string) => iso >= from && iso <= to;

const selectScope = (reservations: HotelReservation[], rooms: HotelRoom[], roomId: string) =>
  roomId === 'todas'
    ? { reservations, rooms }
    : {
        reservations: reservations.filter((r) => String(r.roomId) === roomId),
        rooms: rooms.filter((room) => String(room.id) === roomId),
      };

const occupancyPct = (
  reservations: HotelReservation[],
  rooms: HotelRoom[],
  from: string,
  to: string,
) => {
  const days = differenceInCalendarDays(parseISO(to), parseISO(from)) + 1;
  const available = totalRoomUnits(rooms) * days;
  if (available === 0) return 0;
  const nights = reservations.reduce((total, r) => total + occupiedNights(r, from, to), 0);
  return Math.min(100, Math.round((nights / available) * 1000) / 10);
};

const summarize = (
  reservations: HotelReservation[],
  rooms: HotelRoom[],
  from: string,
  to: string,
) => {
  const made = reservations.filter((r) => inRange(r.creadaEl, from, to));
  const valid = made.filter((r) => r.estado !== 'Cancelada');
  const nights = sum(valid, (r) => r.noches);
  const ingresos = sum(valid, (r) => r.total);
  return {
    ingresos,
    reservas: valid.length,
    ocupacion: occupancyPct(reservations, rooms, from, to),
    tarifa: nights > 0 ? Math.round(ingresos / nights) : 0,
    cancelacion:
      made.length > 0 ? Math.round(((made.length - valid.length) / made.length) * 1000) / 10 : 0,
    estadia: valid.length > 0 ? Math.round((nights / valid.length) * 10) / 10 : 0,
  };
};

export const getHotelReportsData = async (filters: ReportFilters): Promise<HotelReportsData> => {
  await mockDelay();
  const [hotel, allReservations] = await Promise.all([getHotel(), getReservations()]);
  const { reservations, rooms } = selectScope(allReservations, hotel.rooms, filters.roomId);

  const periodDays = differenceInCalendarDays(parseISO(filters.to), parseISO(filters.from)) + 1;
  const previousFrom = format(subDays(parseISO(filters.from), periodDays), ISO);
  const previousTo = format(subDays(parseISO(filters.from), 1), ISO);

  const now = summarize(reservations, rooms, filters.from, filters.to);
  const before = summarize(reservations, rooms, previousFrom, previousTo);

  const summary: HotelReportsSummary = {
    ingresos: now.ingresos,
    ingresosDeltaPct: deltaPct(now.ingresos, before.ingresos),
    reservas: now.reservas,
    reservasDeltaPct: deltaPct(now.reservas, before.reservas),
    ocupacion: now.ocupacion,
    ocupacionDeltaPts: pointsDelta(now.ocupacion, before.ocupacion),
    tarifaPromedio: now.tarifa,
    tarifaDeltaPct: deltaPct(now.tarifa, before.tarifa),
    tasaCancelacion: now.cancelacion,
    cancelacionDeltaPts: pointsDelta(now.cancelacion, before.cancelacion),
    estadiaPromedio: now.estadia,
    estadiaDeltaPct: deltaPct(now.estadia, before.estadia),
  };

  // Serie de ingresos y reservas (por fecha de reserva), según el largo del rango.
  const days = eachDayOfInterval({ start: parseISO(filters.from), end: parseISO(filters.to) });
  const granularity: ReportGranularity =
    days.length <= 31 ? 'day' : days.length <= 180 ? 'week' : 'month';
  const buckets = new Map<string, Date[]>();
  days.forEach((day, index) => {
    const key =
      granularity === 'day'
        ? format(day, ISO)
        : granularity === 'week'
          ? String(Math.floor(index / 7))
          : format(day, 'yyyy-MM');
    buckets.set(key, [...(buckets.get(key) ?? []), day]);
  });
  const made = reservations.filter(
    (r) => r.estado !== 'Cancelada' && inRange(r.creadaEl, filters.from, filters.to),
  );
  const series: SeriesDatum[] = [...buckets.values()].map((bucketDays) => {
    const isos = new Set(bucketDays.map((d) => format(d, ISO)));
    const bucketReservations = made.filter((r) => isos.has(r.creadaEl));
    return {
      fecha:
        granularity === 'month'
          ? format(bucketDays[0], 'MMM yy', { locale: es })
          : format(bucketDays[0], 'dd MMM', { locale: es }),
      ingresos: sum(bucketReservations, (r) => r.total),
      reservas: bucketReservations.length,
    };
  });

  const revenueByRoom = rooms.map((room, index) => ({
    habitacion: room.nombre,
    ingresos: sum(
      made.filter((r) => r.roomId === room.id),
      (r) => r.total,
    ),
    color: ROOM_COLORS[index % ROOM_COLORS.length],
  }));

  const occupancyByRoom = rooms.map((room) => ({
    habitacion: room.nombre,
    ocupacion: occupancyPct(
      reservations.filter((r) => r.roomId === room.id),
      [room],
      filters.from,
      filters.to,
    ),
  }));

  return { granularity, summary, series, revenueByRoom, occupancyByRoom };
};

// --- Reportes generados --------------------------------------------------------

const REPORT_NAMES: Record<ReportType, string> = {
  Ventas: 'Resumen de ventas',
  Reservas: 'Listado de reservas',
  Ocupación: 'Reporte de ocupación',
};

const seedReports = (): GeneratedReport[] => {
  const to = format(subDays(new Date(), 1), ISO);
  const from = format(subDays(new Date(), 30), ISO);
  const now = Date.now();
  return (['Ventas', 'Ocupación', 'Reservas'] as ReportType[]).map((tipo, index) => ({
    id: `r${index + 1}`,
    nombre: REPORT_NAMES[tipo],
    tipo,
    from,
    to,
    roomId: 'todas',
    generadoEl: new Date(now - index * 15 * 60000).toISOString(),
    formato: 'CSV',
  }));
};

// En memoria: crear/eliminar persiste mientras no se recargue la página.
let reports: GeneratedReport[] = seedReports();

// TODO(backend): GET reportes/recientes
export const getRecentReports = async (): Promise<GeneratedReport[]> => {
  await mockDelay();
  return reports;
};

// TODO(backend): POST reportes (el backend genera el archivo y devuelve la URL de descarga)
export const createReport = async (
  tipo: ReportType,
  filters: ReportFilters,
): Promise<GeneratedReport> => {
  await mockDelay(600);
  const room = (await getRoomOptions()).find((option) => option.id === filters.roomId);
  const report: GeneratedReport = {
    id: `r${Date.now()}`,
    nombre: room ? `${REPORT_NAMES[tipo]} · ${room.label}` : REPORT_NAMES[tipo],
    tipo,
    ...filters,
    generadoEl: new Date().toISOString(),
    formato: 'CSV',
  };
  reports = [report, ...reports];
  return report;
};

export const deleteReport = async (id: string): Promise<void> => {
  await mockDelay(200);
  reports = reports.filter((r) => r.id !== id);
};

const csvRow = (cells: (string | number)[]) =>
  cells.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',');

/** Arma el archivo CSV de un reporte según su tipo, rango y habitación. */
export const buildReportFile = async (
  tipo: ReportType,
  filters: ReportFilters,
): Promise<ReportFile> => {
  const [hotel, allReservations] = await Promise.all([getHotel(), getReservations()]);
  const { reservations, rooms } = selectScope(allReservations, hotel.rooms, filters.roomId);
  const days = eachDayOfInterval({ start: parseISO(filters.from), end: parseISO(filters.to) });
  const filename = `reporte-${tipo.toLowerCase()}_${filters.from}_${filters.to}.csv`;
  const made = reservations.filter((r) => inRange(r.creadaEl, filters.from, filters.to));
  const valid = made.filter((r) => r.estado !== 'Cancelada');

  if (tipo === 'Ventas') {
    const rows = days.map((day) => {
      const iso = format(day, ISO);
      const ofDay = valid.filter((r) => r.creadaEl === iso);
      return [format(day, 'dd/MM/yyyy'), ofDay.length, sum(ofDay, (r) => r.total)];
    });
    return {
      filename,
      content: [
        csvRow(['Fecha', 'Reservas', 'Ingresos (USD)']),
        ...rows.map(csvRow),
        csvRow(['Total', valid.length, sum(valid, (r) => r.total)]),
      ].join('\n'),
    };
  }

  if (tipo === 'Reservas') {
    const rows = made.map((r) => [
      r.codigo,
      r.huesped,
      r.email,
      r.habitacion,
      r.creadaEl,
      r.checkIn,
      r.checkOut,
      r.noches,
      r.estado,
      r.total,
    ]);
    return {
      filename,
      content: [
        csvRow([
          'Código',
          'Huésped',
          'Email',
          'Habitación',
          'Reservada el',
          'Check-in',
          'Check-out',
          'Noches',
          'Estado',
          'Total (USD)',
        ]),
        ...rows.map(csvRow),
      ].join('\n'),
    };
  }

  const units = totalRoomUnits(rooms);
  const rows = days.map((day) => {
    const iso = format(day, ISO);
    const nights = reservations.reduce((total, r) => total + occupiedNights(r, iso, iso), 0);
    return [
      format(day, 'dd/MM/yyyy'),
      nights,
      units > 0 ? `${Math.round((nights / units) * 1000) / 10}%` : '0%',
    ];
  });
  return {
    filename,
    content: [csvRow(['Fecha', 'Habitaciones ocupadas', 'Ocupación']), ...rows.map(csvRow)].join(
      '\n',
    ),
  };
};
