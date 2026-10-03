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
  ventas: number;
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

export interface ReportsData {
  summary: ReportsSummary;
  salesByDay: SalesByDayDatum[];
  bookingsByOrigin: BookingsByOriginDatum[];
  topDestinations: TopDestinationDatum[];
}

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
