export type FlightStatus = 'Programado' | 'En curso' | 'Completado' | 'Cancelado';

export interface AdminFlight {
  id: string;
  numero: string;
  origen: string;
  destino: string;
  fecha: string; // YYYY-MM-DD
  hora: string; // HH:mm
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

/** Datos del formulario de vuelo (alta y edición). `estado` solo se elige al editar. */
export interface FlightInput {
  numero: string;
  origen: string;
  destino: string;
  fecha: string;
  hora: string;
  precioProm: number;
  estado?: FlightStatus;
}
