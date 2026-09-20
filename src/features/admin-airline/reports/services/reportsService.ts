import { mockDelay } from '../../../../services/mockDelay';
// import { apiRequest } from '../../../../services/apiClient';
// import { API_CONFIG } from '../../../../services/apiConfig';
import type {
  BookingsByOriginDatum,
  GeneratedReport,
  ReportsSummary,
  SalesByDayDatum,
  TopDestinationDatum,
} from '../admin-reports.types';

const MOCK_SUMMARY: ReportsSummary = {
  ventasTotales: 1902450,
  ventasDeltaPct: 15.2,
  reservasTotales: 1250,
  reservasDeltaPct: 8.7,
  vuelosCompletados: 62,
  vuelosDeltaPct: 5.3,
  usuariosActivos: 842,
  usuariosDeltaPct: 12.1,
};

const MOCK_SALES_BY_DAY: SalesByDayDatum[] = [
  { fecha: '01 Oct', ventas: 90000 },
  { fecha: '03 Oct', ventas: 140000 },
  { fecha: '05 Oct', ventas: 110000 },
  { fecha: '07 Oct', ventas: 160000 },
  { fecha: '09 Oct', ventas: 130000 },
  { fecha: '11 Oct', ventas: 170000 },
  { fecha: '13 Oct', ventas: 150000 },
  { fecha: '15 Oct', ventas: 185000 },
];

const MOCK_BOOKINGS_BY_ORIGIN: BookingsByOriginDatum[] = [
  { origen: 'MAD', cantidad: 438, color: '#1f3051' },
  { origen: 'MIA', cantidad: 313, color: '#3457a6' },
  { origen: 'JFK', cantidad: 250, color: '#6f8fd6' },
  { origen: 'LIM', cantidad: 125, color: '#a9bdec' },
  { origen: 'Otros', cantidad: 124, color: '#d9d9d9' },
];

const MOCK_TOP_DESTINATIONS: TopDestinationDatum[] = [
  { destino: 'Ciudad de México', reservas: 320 },
  { destino: 'Bogotá', reservas: 280 },
  { destino: 'Miami', reservas: 210 },
  { destino: 'Santiago', reservas: 180 },
  { destino: 'Roma', reservas: 120 },
];

const MOCK_RECENT_REPORTS: GeneratedReport[] = [
  { id: 'r1', nombre: 'Resumen de ventas', tipo: 'Ventas', periodo: '01/10/2024 - 15/10/2024', generadoEl: '15 Oct 2024, 08:30 AM', formato: 'PDF' },
  { id: 'r2', nombre: 'Rendimiento de vuelos', tipo: 'Vuelos', periodo: '01/10/2024 - 15/10/2024', generadoEl: '15 Oct 2024, 08:15 AM', formato: 'Excel' },
  { id: 'r3', nombre: 'Reporte de usuarios', tipo: 'Usuarios', periodo: '01/10/2024 - 15/10/2024', generadoEl: '15 Oct 2024, 07:45 AM', formato: 'PDF' },
];

// TODO(backend): apiRequest<ReportsSummary>(API_CONFIG.reportsServiceUrl, '/reportes/resumen', { params: { desde, hasta, vuelo } })
export const getReportsSummary = async (): Promise<ReportsSummary> => {
  await mockDelay();
  return MOCK_SUMMARY;
};

// TODO(backend): apiRequest<SalesByDayDatum[]>(API_CONFIG.reportsServiceUrl, '/reportes/ventas-por-dia')
export const getSalesByDay = async (): Promise<SalesByDayDatum[]> => {
  await mockDelay();
  return MOCK_SALES_BY_DAY;
};

// TODO(backend): apiRequest<BookingsByOriginDatum[]>(API_CONFIG.reportsServiceUrl, '/reportes/reservas-por-origen')
export const getBookingsByOrigin = async (): Promise<BookingsByOriginDatum[]> => {
  await mockDelay();
  return MOCK_BOOKINGS_BY_ORIGIN;
};

// TODO(backend): apiRequest<TopDestinationDatum[]>(API_CONFIG.reportsServiceUrl, '/reportes/top-destinos')
export const getTopDestinations = async (): Promise<TopDestinationDatum[]> => {
  await mockDelay();
  return MOCK_TOP_DESTINATIONS;
};

// TODO(backend): apiRequest<GeneratedReport[]>(API_CONFIG.reportsServiceUrl, '/reportes/recientes')
export const getRecentReports = async (): Promise<GeneratedReport[]> => {
  await mockDelay();
  return MOCK_RECENT_REPORTS;
};

// TODO(backend): apiRequest<{ url: string }>(API_CONFIG.reportsServiceUrl, `/reportes/${id}/descargar`)
export const exportReport = async (): Promise<void> => {
  await mockDelay(600);
  // Front-end only: acá simulamos la exportación. Cuando se conecte el
  // backend, este servicio va a devolver una URL/blob para descargar.
};
