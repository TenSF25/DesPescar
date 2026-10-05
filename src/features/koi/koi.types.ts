/** Tipos de la API de KOI (koi-ia-service, contrato de E3). Montos en ARS. */

export type KoiIntent = 'COMBO' | 'SOLO_VUELO' | 'SOLO_HOTEL' | 'UNKNOWN';

export type KoiStage = 'NEW' | 'COLLECTING_INFO' | 'READY_TO_RECOMMEND' | 'RECOMMENDING';

export type KoiCampoFaltante =
  | 'BUDGET'
  | 'TRAVELERS'
  | 'ORIGIN'
  | 'DESTINATION'
  | 'DEPARTURE_DATE'
  | 'DEPARTURE_DAY'
  | 'RETURN_OR_NIGHTS';

export type KoiTipoOpcion = 'COMBO' | 'VUELO' | 'HOTEL';

/** precio = (tarifa ida + tarifa vuelta) × viajeros. Fechas y horas ISO locales. */
export interface KoiVueloOpcion {
  departureFlightId: string;
  returnFlightId?: string;
  departureFareId: string;
  returnFareId?: string;
  aerolinea: string;
  numeroIda: string;
  numeroVuelta?: string;
  salidaIda: string;
  llegadaIda: string;
  salidaVuelta?: string;
  llegadaVuelta?: string;
  precio: number;
}

/** precio = precio por noche × noches × habitaciones. Fechas yyyy-MM-dd. */
export interface KoiHotelOpcion {
  hotelId: string;
  hotelNombre: string;
  ciudad: string;
  estrellas: number;
  imagen?: string;
  tipoHabitacionId: string;
  tipoHabitacionNombre: string;
  checkIn: string;
  checkOut: string;
  noches: number;
  cantidadHabitaciones: number;
  huespedes: number;
  precio: number;
}

export interface KoiOpcion {
  optionId: string;
  tipo: KoiTipoOpcion;
  vuelo?: KoiVueloOpcion;
  hotel?: KoiHotelOpcion;
  viajeros: number;
  total: number;
  moneda: 'ARS';
  /** Solo cuando ninguna opción entra en el presupuesto: cuánto se pasa. */
  excedeEn?: number;
  motivo: string;
}

export interface KoiConversationResponse {
  sessionId: string;
  reply: string;
  needsMoreInfo: boolean;
  nextQuestion: KoiCampoFaltante | null;
  missingFields: KoiCampoFaltante[];
  intent: KoiIntent;
  stage: KoiStage;
  recommendations: KoiOpcion[];
}

/** Un mensaje de GET /api/koi/sessions/{id}/messages. */
export interface KoiMensajeHistorial {
  rol: 'KOI' | 'USER';
  texto: string;
  opciones: KoiOpcion[];
}

/** Un mensaje del chat; los de KOI pueden traer opciones. */
export interface ChatMessage {
  role: 'user' | 'bot';
  text: string;
  opciones: KoiOpcion[];
}

/** Cuerpo de POST /api/bookings/carrito/estadias (E2, contrato C4). */
export interface EstadiaKoi {
  hotelId: string;
  tipoHabitacionId: string;
  checkIn: string;
  checkOut: string;
  cantidadHabitaciones: number;
  huespedes: number;
}
