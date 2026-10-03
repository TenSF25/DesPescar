export type FlightStatus = 'Programado' | 'En curso' | 'Completado' | 'Cancelado';

export interface AdminFlight {
  id: string;
  numero: string;
  origen: string;
  destino: string;
  fecha: string; // ej: "15 Oct 2024"
  hora: string; // ej: "10:30 AM"
  estado: FlightStatus;
  precioProm: number; // USD
}

export interface FlightStats {
  vuelosTotales: number;
  vuelosEnCurso: number;
  completados: number;
  completadosDeltaPct: number;
  programados: number;
  cancelados: number;
  canceladosDeltaPct: number;
}

/** Datos que pide el formulario de "Agregar nuevo vuelo" */
export interface NewFlightInput {
  numero: string;
  origen: string;
  destino: string;
  fecha: string;
  hora: string;
  precioProm: number;
}
