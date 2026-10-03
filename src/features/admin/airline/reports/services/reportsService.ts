import { differenceInCalendarDays, eachDayOfInterval, format, parseISO, subDays } from 'date-fns';
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
  ReportsData,
  ReportsSummary,
  ReportType,
  SalesByDayDatum,
  TopDestinationDatum,
} from '../admin-reports.types';

const ISO = 'yyyy-MM-dd';

/** Ventana de datos disponibles hacia atrás desde hoy (días). */
export const REPORTS_HISTORY_DAYS = 120;

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
  sales: number;
}

const buildRecords = (flights: AdminFlight[], from: string, to: string): DayRecord[] => {
  const days = eachDayOfInterval({ start: parseISO(from), end: parseISO(to) });
  return flights.flatMap((flight) =>
    days.map((day) => {
      const iso = format(day, ISO);
      const bookings =
        flight.estado === 'Cancelado' ? 0 : Math.floor(random01(`${flight.id}${iso}`) * 12) + 1;
      return { iso, flight, bookings, sales: bookings * flight.precioProm };
    }),
  );
};

const selectFlights = async (flightId: string) => {
  const all = await getFlights();
  return flightId === 'todos' ? all : all.filter((f) => f.id === flightId);
};

const sum = (records: DayRecord[], pick: (r: DayRecord) => number) =>
  records.reduce((total, r) => total + pick(r), 0);

const deltaPct = (current: number, previous: number) =>
  previous === 0 ? 0 : Math.round(((current - previous) / previous) * 1000) / 10;

const summarize = (records: DayRecord[], todayISO: string) => ({
  ventas: sum(records, (r) => r.sales),
  reservas: sum(records, (r) => r.bookings),
  completados: records.filter((r) => r.bookings > 0 && r.iso < todayISO).length,
  usuarios: Math.round(sum(records, (r) => r.bookings) * 0.68),
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
export const getReportsData = async (filters: ReportFilters): Promise<ReportsData> => {
  await mockDelay();
  const flights = await selectFlights(filters.flightId);
  const todayISO = format(new Date(), ISO);

  const current = buildRecords(flights, filters.from, filters.to);
  const periodDays = differenceInCalendarDays(parseISO(filters.to), parseISO(filters.from)) + 1;
  const previous = buildRecords(
    flights,
    format(subDays(parseISO(filters.from), periodDays), ISO),
    format(subDays(parseISO(filters.from), 1), ISO),
  );

  const now = summarize(current, todayISO);
  const before = summarize(previous, todayISO);

  const summary: ReportsSummary = {
    ventasTotales: now.ventas,
    ventasDeltaPct: deltaPct(now.ventas, before.ventas),
    reservasTotales: now.reservas,
    reservasDeltaPct: deltaPct(now.reservas, before.reservas),
    vuelosCompletados: now.completados,
    vuelosDeltaPct: deltaPct(now.completados, before.completados),
    usuariosActivos: now.usuarios,
    usuariosDeltaPct: deltaPct(now.usuarios, before.usuarios),
  };

  // Ventas agrupadas por día; si el rango es largo, por semana.
  const days = eachDayOfInterval({ start: parseISO(filters.from), end: parseISO(filters.to) });
  const bucketSize = days.length > 31 ? 7 : 1;
  const salesByDay: SalesByDayDatum[] = [];
  for (let i = 0; i < days.length; i += bucketSize) {
    const bucket = new Set(days.slice(i, i + bucketSize).map((d) => format(d, ISO)));
    salesByDay.push({
      fecha: shortDate(format(days[i], ISO)),
      ventas: sum(
        current.filter((r) => bucket.has(r.iso)),
        (r) => r.sales,
      ),
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

  return { summary, salesByDay, bookingsByOrigin, topDestinations };
};

// --- Reportes generados ---------------------------------------------------

const REPORT_NAMES: Record<ReportType, string> = {
  Ventas: 'Resumen de ventas',
  Vuelos: 'Rendimiento de vuelos',
  Usuarios: 'Reporte de usuarios',
};

const seedReports = (): GeneratedReport[] => {
  const to = format(subDays(new Date(), 1), ISO);
  const from = format(subDays(new Date(), 15), ISO);
  const today = new Date();
  return (['Ventas', 'Vuelos', 'Usuarios'] as ReportType[]).map((tipo, i) => ({
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
  const report: GeneratedReport = {
    id: `r${Date.now()}`,
    nombre: flight ? `${REPORT_NAMES[tipo]} · ${flight.label.split(' · ')[0]}` : REPORT_NAMES[tipo],
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

/** Arma el archivo CSV de un reporte según su tipo, rango y vuelo. */
export const buildReportFile = async (
  tipo: ReportType,
  filters: ReportFilters,
): Promise<ReportFile> => {
  const flights = await selectFlights(filters.flightId);
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
    Math.round(
      sum(
        records.filter((r) => r.iso === format(day, ISO)),
        (r) => r.bookings,
      ) * 0.68,
    ),
  ]);
  return {
    filename,
    content: [csvRow(['Fecha', 'Usuarios activos']), ...rows.map(csvRow)].join('\n'),
  };
};
