export interface FlightService {
  airlineId: number;
  airportOriginId: number;
  airportDestinyId: number;
  takeOffDate: string;
  landingDate: string;
  duration: number;
  status: 'A tiempo' | 'Check-in Abierto' | 'Check-in cerrado';
}
export type Escala = 'Directo' | '1 escala' | '2 escalas';

export interface Vuelo {
  id: number;
  aerolinea: string;
  origenCodigo: string;
  origenCiudad: string;
  destinoCodigo: string;
  destinoCiudad: string;
  fecha: string;
  horaSalida: string;
  horaLlegada: string;
  duracion: string;
  escalas: Escala;
  tarifa: string;
  precio: number;
  llegaOtroDia: boolean;
  equipajeMano: boolean;
  equipajeBodega: boolean;
  wifi: boolean;
}

export interface FechaDisponible {
  fecha: string;
  precioDesde: number;
}
