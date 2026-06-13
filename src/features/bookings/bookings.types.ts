export interface Reservations {
  userId: number;
  reservationDate: string;
  status: 'PENDING' | 'APPROVE' | 'CANCELLED';
  total: number;
}

export interface ReservationsDetails {
  reservationId: number;
  flightId: number;
  seatId: number;
  price: number;
}

export interface Seats {
  flightId: number;
  number: number;
  class: string;
  status: 'OCCUPED' | 'AVAILABLE' | 'PENDING';
}
