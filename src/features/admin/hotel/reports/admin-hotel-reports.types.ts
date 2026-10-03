/** Cómo se agrupa la serie: un punto por día, por semana o por mes. */
export type ReportGranularity = 'day' | 'week' | 'month';

export type ReportType = 'Ventas' | 'Reservas' | 'Ocupación';

/** Filtros de la página. `roomId` es 'todas' o el id (como texto) de un tipo de habitación. */
export interface ReportFilters {
  from: string; // YYYY-MM-DD
  to: string; // YYYY-MM-DD
  roomId: string;
}

export interface HotelReportsSummary {
  ingresos: number; // USD, reservas no canceladas hechas en el período
  ingresosDeltaPct: number;
  reservas: number;
  reservasDeltaPct: number;
  /** Noches ocupadas sobre noches disponibles del período (%). */
  ocupacion: number;
  ocupacionDeltaPts: number;
  /** Ingreso promedio por noche vendida (USD). */
  tarifaPromedio: number;
  tarifaDeltaPct: number;
  /** Reservas canceladas sobre el total de reservas hechas en el período (%). */
  tasaCancelacion: number;
  cancelacionDeltaPts: number;
  /** Noches promedio por reserva. */
  estadiaPromedio: number;
  estadiaDeltaPct: number;
}

export interface SeriesDatum {
  fecha: string;
  ingresos: number;
  reservas: number;
}

export interface RoomRevenueDatum {
  habitacion: string;
  ingresos: number;
  color: string;
}

export interface RoomOccupancyDatum {
  habitacion: string;
  ocupacion: number; // %
}

export interface HotelReportsData {
  granularity: ReportGranularity;
  summary: HotelReportsSummary;
  series: SeriesDatum[];
  revenueByRoom: RoomRevenueDatum[];
  occupancyByRoom: RoomOccupancyDatum[];
}

export interface RoomOption {
  id: string;
  label: string;
}

export interface GeneratedReport extends ReportFilters {
  id: string;
  nombre: string;
  tipo: ReportType;
  generadoEl: string; // ISO datetime
  formato: 'CSV';
}

export interface ReportFile {
  filename: string;
  content: string;
}
