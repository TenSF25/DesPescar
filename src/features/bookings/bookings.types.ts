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

export type FareType = 'Flex' | 'Classic' | 'Promo';

export type CancelReason = 'PLAN_CHANGE' | 'PERSONAL' | 'HEALTH' | 'FLIGHT_ISSUE' | 'OTHER';

export interface CancellableReservation {
  reservationId: string;
  flightNumber: string;
  fare: FareType;
  status: Reservations['status'];
  passengers: number;
  seats: string[];
  origin: { iata: string; city: string };
  destination: { iata: string; city: string };
  departureTime: string;
  arrivalTime: string;
  departureDate: string;
  duration: string;
  imageUrl: string;
  farePaid: number;
  taxes: number;
  contactEmail: string;
}

export interface RefundBreakdown {
  farePaid: number;
  taxes: number;
  penalty: number;
  total: number;
}
