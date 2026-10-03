export interface FlightEndpoint {
  iata: string;
  city: string;
  time: string;
  date?: string;
}

export interface FlightReservation {
  id: string;
  thumbnail: string;
  origin: FlightEndpoint;
  destination: FlightEndpoint;
  flightNumber: string;
  seats: string;
  reservationCode: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  nextDayArrival?: boolean;
  rating?: number;
  passengerName?: string;
  /** Todos los pasajeros de la reserva (incluye al titular). */
  passengers?: string[];
  /** Total pagado en pesos argentinos (ARS). */
  totalPaid?: number;
  /** Correo de quien compró el vuelo (al que se envían confirmaciones y cancelaciones). */
  contactEmail?: string;
}
