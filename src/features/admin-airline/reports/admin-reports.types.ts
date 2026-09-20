export interface ReportsSummary {
  ventasTotales: number;
  ventasDeltaPct: number;
  reservasTotales: number;
  reservasDeltaPct: number;
  vuelosCompletados: number;
  vuelosDeltaPct: number;
  usuariosActivos: number;
  usuariosDeltaPct: number;
}

export interface SalesByDayDatum {
  fecha: string; // ej: "01 Oct"
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

export type ReportFormat = 'PDF' | 'Excel';
export type ReportType = 'Ventas' | 'Vuelos' | 'Usuarios';

export interface GeneratedReport {
  id: string;
  nombre: string;
  tipo: ReportType;
  periodo: string;
  generadoEl: string;
  formato: ReportFormat;
}
