import type { FlightReservation } from '../reservations.types';

export const upcomingFlights: FlightReservation[] = [
  {
    id: '1',
    thumbnail:
      'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=200&h=200&fit=crop&crop=center',
    origin: { iata: 'MAD', city: 'Madrid', time: '10:30', date: '15 de octubre 2026' },
    destination: { iata: 'MEX', city: 'México', time: '16:55' },
    flightNumber: 'DSC2456',
    seats: '2C, 2E',
    reservationCode: 'ABC123',
    status: 'upcoming',
  },
  {
    id: '2',
    thumbnail:
      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=200&h=200&fit=crop&crop=center',
    origin: { iata: 'EZE', city: 'Buenos Aires', time: '22:05', date: '10 de enero 2027' },
    destination: { iata: 'LHR', city: 'Londres', time: '14:30' },
    flightNumber: 'DSC4417',
    seats: '18C, 18D',
    reservationCode: 'KPW552',
    status: 'upcoming',
    nextDayArrival: true,
  },
];
