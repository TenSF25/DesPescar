import type { FlightReservation } from '@/features/reservations/reservations.types';

export const cancelledFlights: FlightReservation[] = [
  {
    id: 'c1',
    thumbnail: '/calafate.jpg',
    origin: { iata: 'AEP', city: 'Buenos Aires', time: '09:00', date: '05 de abril 2026' },
    destination: { iata: 'FTE', city: 'El Calafate', time: '12:25' },
    flightNumber: 'DSC5502',
    seats: '31A, 31B',
    reservationCode: 'STU000',
    totalPaid: 396000,
    status: 'cancelled',
  },
];
