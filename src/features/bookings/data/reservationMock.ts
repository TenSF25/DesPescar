import type { CancellableReservation } from '../bookings.types';

export const reservationsMock: CancellableReservation[] = [
  {
    reservationId: 'ABC123',
    flightNumber: 'DSC2456',
    fare: 'Flex',
    status: 'APPROVE',
    passengers: 2,
    seats: ['2C', '2E'],
    origin: { iata: 'BUE', city: 'Buenos Aires' },
    destination: { iata: 'MEX', city: 'México' },
    departureTime: '10:30',
    arrivalTime: '16:55',
    departureDate: '15 de octubre 2026',
    duration: '12h 25m',
    imageUrl: '/venecia.webp',
    farePaid: 1200,
    taxes: 40,
    contactEmail: 'luciano.nunez@email.com',
  },
];

export const findReservation = (reservationId?: string) =>
  reservationsMock.find((reservation) => reservation.reservationId === reservationId) ?? null;
