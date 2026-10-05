import type { TramoCancelacion } from '@/features/hotels/hotels.types';

export type EstadoGrupo = 'ABIERTO' | 'COMPLETO' | 'CONFIRMADO' | 'CANCELADO' | 'VENCIDO';
export type EstadoParte = 'LIBRE' | 'TOMADA' | 'PAGADA';
export type MotivoCierre =
  | 'GRUPO_CANCELADO'
  | 'PAGO_EN_GRUPO_VENCIDO'
  | 'MONTO_NO_COINCIDE'
  | 'SIN_DISPONIBILIDAD'
  | 'PAGO_TARDIO_SIN_DISPONIBILIDAD'
  | 'CONFIRMACION_FALLIDA';

export interface ParteGrupo {
  numero: number;
  monto: number;
  estado: EstadoParte;
  apodo: string | null;
  esOrganizador: boolean;
  esMia: boolean;
}

/** Ids de vuelo para leer ciudades y horarios con GET /api/flights/{id}. */
export interface VueloGrupo {
  flightIds: string[];
  cantidadPasajeros: number;
  salida: string;
  tarifas: string;
}

export interface EstadiaGrupo {
  hotelNombre: string;
  ciudad: string;
  tipoHabitacionNombre: string;
  checkIn: string;
  checkOut: string;
  noches: number;
  cantidadHabitaciones: number;
  huespedes: number;
  politicaCancelacion: TramoCancelacion[];
}

export interface ViajeGrupo {
  vuelo: VueloGrupo | null;
  estadias: EstadiaGrupo[];
}

/** GrupoResponse (contrato CB2). Sin datos personales de nadie. */
export interface Grupo {
  reservaId: number;
  estado: EstadoGrupo;
  /** Hora argentina sin zona ("2026-10-06T15:00:00"). Para contar se usa segundosRestantes. */
  venceEn: string;
  segundosRestantes: number;
  montoTotal: number;
  moneda: string;
  montoPagado: number;
  cantidadPartes: number;
  partesPagadas: number;
  soyOrganizador: boolean;
  miParte: number | null;
  /** Solo para quien tiene parte. */
  enlaceToken: string | null;
  puedeEditarMontos: boolean;
  motivoCierre: MotivoCierre | null;
  partes: ParteGrupo[];
  viaje: ViajeGrupo;
}

/** GrupoResumenResponse: un grupo donde el usuario tiene parte (GET /grupos/mios). */
export interface GrupoResumen {
  reservaId: number;
  enlaceToken: string;
  estado: EstadoGrupo;
  venceEn: string;
  segundosRestantes: number;
  soyOrganizador: boolean;
  miParte: number;
  monto: number;
  estadoParte: EstadoParte;
  destino: string | null;
}

/** PUT /{id}/grupo/partes: uno de los dos. */
export type EditarPartesRequest = { cantidadPartes: number } | { montos: number[] };

export type FuenteGrupo =
  | { tipo: 'organizador'; reservaId: number }
  | { tipo: 'participacion'; reservaId: number }
  | { tipo: 'token'; token: string };
