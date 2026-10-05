export interface FlightEndpoint {
  iata: string;
  city: string;
  time: string;
  date?: string;
}

/** Una estadía de la reserva, con las fechas ya en texto ("10 de noviembre 2026"). */
export interface HotelStay {
  id: number;
  name: string;
  city: string;
  room: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  price: number;
  holder?: string;
}

/** Una reserva de "Mis reservas": puede tener vuelo, estadías o las dos cosas. */
export interface FlightReservation {
  id: string;
  thumbnail: string;
  /** Sin origen ni destino cuando la reserva no tiene vuelo. */
  origin?: FlightEndpoint;
  destination?: FlightEndpoint;
  flightNumber: string;
  seats: string;
  reservationCode: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  nextDayArrival?: boolean;
  /** "2 h 20 min" del tramo de ida. */
  duration?: string;
  /** Fecha del tramo de vuelta, si la reserva es ida y vuelta. */
  returnDate?: string;
  passengerName?: string;
  /** Todos los pasajeros de la reserva. */
  passengers?: string[];
  /** Total pagado en pesos argentinos (ARS). */
  totalPaid?: number;
  /** Lo que se pagó por el vuelo (el resto del total son las estadías). */
  flightPrice?: number;
  hotels: HotelStay[];
  /** Reserva cancelada por el usuario: lo que se devuelve. */
  refunded?: number;
  /** El reembolso todavía no salió hacia el medio de pago. */
  refundPending?: boolean;
  /** Se pagó entre varios: el reembolso vuelve a cada pagador en proporción. */
  groupPaid?: boolean;
}

/** Vista previa o resultado de cancelar (GET/POST /api/bookings/{id}/cancelacion). */
export interface Cancelacion {
  reservaId: number;
  estado: 'CONFIRMADA' | 'CANCELADA';
  reembolsoTotal: number;
  moneda: string;
  pagoEnGrupo: boolean;
  reembolsoPendiente: boolean;
  detalle: {
    tipo: 'VUELO' | 'ESTADIA';
    estadiaId: number | null;
    descripcion: string;
    precio: number;
    porcentaje: number;
    monto: number;
  }[];
}
