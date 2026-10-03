import {
  differenceInCalendarDays,
  eachDayOfInterval,
  format,
  parseISO,
  startOfDay,
  subDays,
} from 'date-fns';
import { es } from 'date-fns/locale';
import { mockDelay } from '@/utils/mockDelay';
import { getFlights } from '../../flights/services/flightsService';
import type { AdminFlight } from '../../flights/admin-flights.types';
import type {
  BookingsByOriginDatum,
  GeneratedReport,
  ReportFile,
  ReportFilters,
  ReportFlightOption,
  AllFlightsReportsData,
  FlightSalesSummary,
  ReportsData,
  SingleFlightReportsData,
  ReportsSummary,
  ReportType,
  SalesByDayDatum,
  TopDestinationDatum,
} from '../admin-reports.types';

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
  return { from: format(subDays(parseISO(max), 14), ISO), to: max, flightId: 'todos' };
};

// --- Datos mock deterministas -------------------------------------------
// Las reservas diarias de cada vuelo salen de un generador con semilla
// (id de vuelo + fecha), así el mismo filtro siempre da los mismos números.
// TODO(backend): reemplazar todo este bloque por las llamadas a los endpoints
// de reportes (con desde / hasta / vuelo como params).

const hash = (text: string) => {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

const random01 = (seed: string) => (hash(seed) % 10000) / 10000;

interface DayRecord {
  iso: string;
  flight: AdminFlight;
  bookings: number;
  /** Pasajeros con pasaje comprado ese día (≈1.7 por reserva). */
  passengers: number;
  sales: number;
}

/**
 * Ciclo de venta de un vuelo: desde su primera compra hasta la última. Empieza
 * entre 20 y 59 días antes de la salida y termina el día de la salida (o antes,
 * si el vuelo se canceló o todavía no salió). Devuelve null si aún no hubo ventas.
 */
const salesWindow = (flight: AdminFlight): { first: string; last: string } | null => {
  const departure = parseISO(flight.fecha);
  const first = subDays(departure, 20 + (hash(`${flight.id}lead`) % 40));
  const rawLast =
    flight.estado === 'Cancelado'
      ? subDays(departure, 2 + (hash(`${flight.id}cut`) % 5))
      : flight.estado === 'Programado'
        ? subDays(departure, 1)
        : departure;
  const today = startOfDay(new Date());
  const last = rawLast > today ? today : rawLast;
  if (first > last) return null;
  return { first: format(first, ISO), last: format(last, ISO) };
};

/** Compras diarias de un vuelo durante todo su ciclo de venta (más fuertes cerca de la salida). */
const flightRecords = (flight: AdminFlight): DayRecord[] => {
  const window = salesWindow(flight);
  if (!window) return [];
  const days = eachDayOfInterval({ start: parseISO(window.first), end: parseISO(window.last) });
  return days.map((day, index) => {
    const iso = format(day, ISO);
    const progress = days.length > 1 ? index / (days.length - 1) : 1;
    const raw = Math.floor(random01(`${flight.id}${iso}`) * (3 + 9 * progress));
    // La primera y la última compra existen por definición: al menos 1 pasaje cada una.
    const isEdge = index === 0 || index === days.length - 1;
    const bookings = isEdge ? Math.max(1, raw) : raw;
    return {
      iso,
      flight,
      bookings,
      passengers: Math.round(bookings * 1.7),
      sales: bookings * flight.precioProm,
    };
  });
};

const buildRecords = (flights: AdminFlight[], from: string, to: string): DayRecord[] =>
  flights.flatMap((flight) =>
    flightRecords(flight).filter((record) => record.iso >= from && record.iso <= to),
  );

const selectFlights = async (flightId: string) => {
  const all = await getFlights();
  return flightId === 'todos' ? all : all.filter((f) => f.id === flightId);
};

const sum = (records: DayRecord[], pick: (r: DayRecord) => number) =>
  records.reduce((total, r) => total + pick(r), 0);

const deltaPct = (current: number, previous: number) =>
  previous === 0 ? 0 : Math.round(((current - previous) / previous) * 1000) / 10;

const passengersOf = (records: DayRecord[]) => sum(records, (r) => r.passengers);

/**
 * Vuelos operados (completados) en el rango: cada vuelo del catálogo opera en
 * algunos días del pasado, según una semilla (id + fecha). Los cancelados casi
 * no operan y hoy o el futuro no cuentan. Así el número crece con el rango.
 * TODO(backend): contar los vuelos con estado COMPLETED dentro del rango.
 */
const completedFlights = (flights: AdminFlight[], from: string, to: string) => {
  const todayISO = format(new Date(), ISO);
  const days = eachDayOfInterval({ start: parseISO(from), end: parseISO(to) })
    .map((day) => format(day, ISO))
    .filter((iso) => iso < todayISO);
  return flights.reduce((total, flight) => {
    const rate = flight.estado === 'Cancelado' ? 0.1 : 0.6;
    return total + days.filter((iso) => random01(`${flight.id}${iso}op`) < rate).length;
  }, 0);
};

const summarize = (records: DayRecord[], flights: AdminFlight[], from: string, to: string) => ({
  ventas: sum(records, (r) => r.sales),
  reservas: sum(records, (r) => r.bookings),
  completados: completedFlights(flights, from, to),
  pasajeros: passengersOf(records),
});

const CITY: Record<string, string> = {
  MEX: 'Ciudad de México',
  BOG: 'Bogotá',
  MIA: 'Miami',
  SCL: 'Santiago',
  MAD: 'Madrid',
  LIM: 'Lima',
  EZE: 'Buenos Aires',
  JFK: 'Nueva York',
};

const cityName = (code: string) => (CITY[code] ? `${CITY[code]} (${code})` : code);

const ORIGIN_COLORS = ['#1f3051', '#3457a6', '#6f8fd6', '#a9bdec', '#d9d9d9'];

const groupCount = (records: DayRecord[], keyOf: (r: DayRecord) => string) => {
  const map = new Map<string, number>();
  records.forEach((r) => map.set(keyOf(r), (map.get(keyOf(r)) ?? 0) + r.bookings));
  return [...map.entries()].sort((a, b) => b[1] - a[1]);
};

const shortDate = (iso: string) => format(parseISO(iso), 'dd MMM', { locale: es });

// --- API del servicio -----------------------------------------------------

export const getReportFlights = async (): Promise<ReportFlightOption[]> => {
  const flights = await getFlights();
  return flights.map((f) => ({ id: f.id, label: `${f.numero} · ${f.origen} → ${f.destino}` }));
};

// TODO(backend): GET reportes/resumen, ventas-por-dia, reservas-por-origen y top-destinos
/** Ventas de un vuelo puntual desde su primera hasta su última compra (un punto por día). */
const buildSingleFlightData = (flight: AdminFlight | undefined): SingleFlightReportsData => {
  const records = flight ? flightRecords(flight) : [];
  const summary: FlightSalesSummary = {
    ventasTotales: sum(records, (r) => r.sales),
    reservasTotales: sum(records, (r) => r.bookings),
    pasajeros: passengersOf(records),
    primeraCompra: records[0]?.iso ?? null,
    ultimaCompra: records[records.length - 1]?.iso ?? null,
  };
  return {
    scope: 'flight',
    summary,
    salesByDay: records.map((r) => ({
      fecha: shortDate(r.iso),
      ventas: r.sales,
      reservas: r.bookings,
      pasajes: r.passengers,
    })),
  };
};

export const getReportsData = async (filters: ReportFilters): Promise<ReportsData> => {
  await mockDelay();
  const flights = await selectFlights(filters.flightId);

  if (filters.flightId !== 'todos') {
    return buildSingleFlightData(flights[0]);
  }

  const current = buildRecords(flights, filters.from, filters.to);
  const periodDays = differenceInCalendarDays(parseISO(filters.to), parseISO(filters.from)) + 1;
  const previous = buildRecords(
    flights,
    format(subDays(parseISO(filters.from), periodDays), ISO),
    format(subDays(parseISO(filters.from), 1), ISO),
  );

  const now = summarize(current, flights, filters.from, filters.to);
  const before = summarize(
    previous,
    flights,
    format(subDays(parseISO(filters.from), periodDays), ISO),
    format(subDays(parseISO(filters.from), 1), ISO),
  );

  const summary: ReportsSummary = {
    ventasTotales: now.ventas,
    ventasDeltaPct: deltaPct(now.ventas, before.ventas),
    reservasTotales: now.reservas,
    reservasDeltaPct: deltaPct(now.reservas, before.reservas),
    vuelosCompletados: now.completados,
    vuelosDeltaPct: deltaPct(now.completados, before.completados),
    pasajeros: now.pasajeros,
    pasajerosDeltaPct: deltaPct(now.pasajeros, before.pasajeros),
  };

  // Ventas agrupadas por día; si el rango es largo, por semana.
  const days = eachDayOfInterval({ start: parseISO(filters.from), end: parseISO(filters.to) });
  const bucketSize = days.length > 31 ? 7 : 1;
  const salesByDay: SalesByDayDatum[] = [];
  for (let i = 0; i < days.length; i += bucketSize) {
    const bucket = new Set(days.slice(i, i + bucketSize).map((d) => format(d, ISO)));
    const bucketRecords = current.filter((r) => bucket.has(r.iso));
    salesByDay.push({
      fecha: shortDate(format(days[i], ISO)),
      ventas: sum(bucketRecords, (r) => r.sales),
      reservas: sum(bucketRecords, (r) => r.bookings),
      pasajes: passengersOf(bucketRecords),
    });
  }

  const origins = groupCount(current, (r) => r.flight.origen);
  const topOrigins = origins.slice(0, 4);
  const otherCount = origins.slice(4).reduce((total, [, count]) => total + count, 0);
  const bookingsByOrigin: BookingsByOriginDatum[] = [
    ...topOrigins.map(([origen, cantidad], i) => ({ origen, cantidad, color: ORIGIN_COLORS[i] })),
    ...(otherCount > 0 ? [{ origen: 'Otros', cantidad: otherCount, color: ORIGIN_COLORS[4] }] : []),
  ];

  const topDestinations: TopDestinationDatum[] = groupCount(current, (r) => r.flight.destino)
    .slice(0, 5)
    .map(([destino, reservas]) => ({ destino: cityName(destino), reservas }));

  const data: AllFlightsReportsData = {
    scope: 'all',
    summary,
    salesByDay,
    bookingsByOrigin,
    topDestinations,
  };
  return data;
};

// --- Reportes generados ---------------------------------------------------

const REPORT_NAMES: Record<ReportType, string> = {
  Ventas: 'Resumen de ventas',
  Vuelos: 'Rendimiento de vuelos',
  Pasajeros: 'Reporte de pasajeros',
};

const seedReports = (): GeneratedReport[] => {
  const to = format(subDays(new Date(), 1), ISO);
  const from = format(subDays(new Date(), 15), ISO);
  const today = new Date();
  return (['Ventas', 'Vuelos', 'Pasajeros'] as ReportType[]).map((tipo, i) => ({
    id: `r${i + 1}`,
    nombre: REPORT_NAMES[tipo],
    tipo,
    from,
    to,
    flightId: 'todos',
    generadoEl: new Date(today.getTime() - i * 15 * 60000).toISOString(),
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
  const flights = await getReportFlights();
  const flight = flights.find((f) => f.id === filters.flightId);
  // Un reporte de un vuelo puntual cubre todo su ciclo de venta, no el rango elegido.
  let range = { from: filters.from, to: filters.to };
  if (flight) {
    const { summary } = buildSingleFlightData((await selectFlights(flight.id))[0]);
    if (summary.primeraCompra && summary.ultimaCompra) {
      range = { from: summary.primeraCompra, to: summary.ultimaCompra };
    }
  }
  const report: GeneratedReport = {
    id: `r${Date.now()}`,
    nombre: flight ? `${REPORT_NAMES[tipo]} · ${flight.label.split(' · ')[0]}` : REPORT_NAMES[tipo],
    tipo,
    flightId: filters.flightId,
    ...range,
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

/** Rango de un vuelo puntual: su ciclo de venta; si no tiene ventas, el rango pedido. */
const flightSalesRange = (
  flight: AdminFlight | undefined,
  fallback: ReportFilters,
): ReportFilters => {
  const { summary } = buildSingleFlightData(flight);
  return summary.primeraCompra && summary.ultimaCompra
    ? { ...fallback, from: summary.primeraCompra, to: summary.ultimaCompra }
    : fallback;
};

const csvRow = (cells: (string | number)[]) =>
  cells.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',');

/** Arma el archivo CSV de un reporte según su tipo, rango y vuelo. */
export const buildReportFile = async (
  tipo: ReportType,
  requested: ReportFilters,
): Promise<ReportFile> => {
  const flights = await selectFlights(requested.flightId);
  const filters =
    requested.flightId === 'todos' ? requested : flightSalesRange(flights[0], requested);
  const records = buildRecords(flights, filters.from, filters.to);
  const filename = `reporte-${tipo.toLowerCase()}_${filters.from}_${filters.to}.csv`;

  if (tipo === 'Ventas') {
    const days = eachDayOfInterval({ start: parseISO(filters.from), end: parseISO(filters.to) });
    const rows = days.map((day) => {
      const dayRecords = records.filter((r) => r.iso === format(day, ISO));
      return [
        format(day, 'dd/MM/yyyy'),
        sum(dayRecords, (r) => r.bookings),
        sum(dayRecords, (r) => r.sales),
      ];
    });
    return {
      filename,
      content: [
        csvRow(['Fecha', 'Reservas', 'Ventas (USD)']),
        ...rows.map(csvRow),
        csvRow(['Total', sum(records, (r) => r.bookings), sum(records, (r) => r.sales)]),
      ].join('\n'),
    };
  }

  if (tipo === 'Vuelos') {
    const rows = flights.map((flight) => {
      const own = records.filter((r) => r.flight.id === flight.id);
      return [
        flight.numero,
        `${flight.origen} → ${flight.destino}`,
        flight.estado,
        sum(own, (r) => r.bookings),
        sum(own, (r) => r.sales),
      ];
    });
    return {
      filename,
      content: [
        csvRow(['Vuelo', 'Ruta', 'Estado', 'Reservas', 'Ventas (USD)']),
        ...rows.map(csvRow),
      ].join('\n'),
    };
  }

  const days = eachDayOfInterval({ start: parseISO(filters.from), end: parseISO(filters.to) });
  const rows = days.map((day) => [
    format(day, 'dd/MM/yyyy'),
    passengersOf(records.filter((r) => r.iso === format(day, ISO))),
  ]);
  return {
    filename,
    content: [csvRow(['Fecha', 'Pasajeros']), ...rows.map(csvRow)].join('\n'),
  };
};
