export type Servicio =
  | 'WIFI'
  | 'PILETA'
  | 'DESAYUNO'
  | 'ESTACIONAMIENTO'
  | 'GIMNASIO'
  | 'SPA'
  | 'AIRE_ACONDICIONADO'
  | 'RESTAURANTE'
  | 'MASCOTAS'
  | 'TRASLADO';

export interface TramoCancelacion {
  horasAntes: number;
  porcentajeReembolso: number;
}

/** Card de resultados. disponible y precioTotalDesde son null si la búsqueda no tiene fechas. */
export interface HotelResumen {
  id: string;
  nombre: string;
  ciudad: string;
  pais: string;
  estrellas: number;
  imagenPrincipal: string | null;
  servicios: Servicio[];
  allInclusive: boolean;
  precioDesde: number | null;
  calificacionPromedio: number;
  cantidadResenas: number;
  disponible: boolean | null;
  precioTotalDesde: number | null;
}

/** Los campos de cotización son null si el detalle se pidió sin fechas. */
export interface HabitacionDetalle {
  id: string;
  nombre: string;
  descripcion: string | null;
  capacidad: number;
  precioPorNoche: number;
  imagenes: string[];
  unidadesLibres: number | null;
  habitacionesNecesarias: number | null;
  precioTotal: number | null;
  disponible: boolean | null;
}

export interface HotelDetalle {
  id: string;
  nombre: string;
  ciudad: string;
  pais: string;
  direccion: string;
  estrellas: number;
  descripcion: string | null;
  imagenes: string[];
  servicios: Servicio[];
  allInclusive: boolean;
  horaCheckIn: string;
  zonaHoraria: string;
  politicaCancelacion: TramoCancelacion[];
  calificacionPromedio: number;
  cantidadResenas: number;
  noches: number | null;
  habitaciones: HabitacionDetalle[];
}

export interface Destino {
  ciudad: string;
  pais: string;
}

export interface HotelSearchParams {
  destino: string;
  /** YYYY-MM-DD o null */
  checkIn: string | null;
  checkOut: string | null;
  huespedes: number;
}
