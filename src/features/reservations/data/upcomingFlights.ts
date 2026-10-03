import type { FlightReservation } from '@/features/reservations/reservations.types';

export const upcomingFlights: FlightReservation[] = [
  {
    id: '1',
    thumbnail: '/bariloche.jpg',
    origin: { iata: 'AEP', city: 'Buenos Aires', time: '10:30', date: '15 de octubre 2026' },
    destination: { iata: 'BRC', city: 'Bariloche', time: '12:50' },
    flightNumber: 'DSC2456',
    seats: '2C, 2E',
    reservationCode: 'ABC123',
    totalPaid: 298000,
    status: 'upcoming',
  },
  {
    id: '2',
    thumbnail: '/ushuaia.jpg',
    origin: { iata: 'EZE', city: 'Buenos Aires', time: '22:05', date: '10 de enero 2027' },
    destination: { iata: 'USH', city: 'Ushuaia', time: '01:50' },
    flightNumber: 'DSC4417',
    seats: '18C, 18D',
    reservationCode: 'KPW552',
    totalPaid: 452000,
    status: 'upcoming',
    nextDayArrival: true,
  },
];
