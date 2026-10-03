export interface ReportsSummary {
  ventasTotales: number;
  ventasDeltaPct: number;
  reservasTotales: number;
  reservasDeltaPct: number;
  vuelosCompletados: number;
  vuelosDeltaPct: number;
  pasajeros: number;
  pasajerosDeltaPct: number;
}

export interface SalesByDayDatum {
  fecha: string; // ej: "01 oct"
  ventas: number; // USD
  reservas: number;
  pasajes: number; // pasajeros con pasaje comprado ese día
}

export interface BookingsByOriginDatum {
  origen: string;
  cantidad: number;
  color: string;
}

export interface TopDestinationDatum {
  destino: string;
  reservas: number;
}

export type ReportFormat = 'CSV';
export type ReportType = 'Ventas' | 'Vuelos' | 'Pasajeros';

/** Filtros de la página de reportes. `flightId` es 'todos' o el id de un vuelo. */
export interface ReportFilters {
  from: string; // YYYY-MM-DD
  to: string; // YYYY-MM-DD
  flightId: string;
}

/** Reporte general: todos los vuelos, dentro del rango de fechas elegido. */
export interface AllFlightsReportsData {
  scope: 'all';
  summary: ReportsSummary;
  salesByDay: SalesByDayDatum[];
  bookingsByOrigin: BookingsByOriginDatum[];
  topDestinations: TopDestinationDatum[];
}

/** Resumen de un vuelo puntual, sobre todo su ciclo de venta. */
export interface FlightSalesSummary {
  ventasTotales: number; // venta de asientos, USD
  reservasTotales: number;
  pasajeros: number;
  /** Fecha (YYYY-MM-DD) de la primera y la última compra; null si aún no tiene ventas. */
  primeraCompra: string | null;
  ultimaCompra: string | null;
}

/** Reporte de un vuelo puntual: ignora el rango y cubre desde su primera hasta su última compra. */
export interface SingleFlightReportsData {
  scope: 'flight';
  summary: FlightSalesSummary;
  salesByDay: SalesByDayDatum[];
}

export type ReportsData = AllFlightsReportsData | SingleFlightReportsData;

export interface ReportFlightOption {
  id: string;
  label: string; // ej: "DSC2456 · MAD → MEX"
}

export interface GeneratedReport extends ReportFilters {
  id: string;
  nombre: string;
  tipo: ReportType;
  generadoEl: string; // ISO datetime
  formato: ReportFormat;
}

export interface ReportFile {
  filename: string;
  content: string;
}
