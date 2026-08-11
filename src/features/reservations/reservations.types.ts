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
}
