import { format, isSameDay, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import type { BookingDetail } from '@/features/bookings/bookings.types';
import type { FlightApiResponse } from '@/features/bookings/services/bookingsService';
import type { FlightReservation } from './reservations.types';

/** Foto de cada destino (en /public); el resto usa la imagen de la marca. */
const THUMBNAIL_BY_IATA: Record<string, string> = {
  BRC: '/bariloche.jpg',
  USH: '/ushuaia.jpg',
  COR: '/cordoba.jpg',
  MDZ: '/mendoza.jpg',
  SLA: '/salta.jpg',
  FTE: '/calafate.jpg',
  IGR: '/iguazu.jpg',
};

/** Convierte una reserva confirmada del backend al formato que muestra "Mis reservas". */
export const bookingToReservation = (
  booking: BookingDetail,
  flight: FlightApiResponse,
  contactEmail?: string,
): FlightReservation => {
  const departure = parseISO(flight.departureTime);
  const arrival = parseISO(flight.arrivalTime);
  const passengers = booking.asientos
    .map((seat) => seat.nombrePasajero)
    .filter((name): name is string => Boolean(name));
  const seats = booking.asientos
    .map((seat) => seat.asientoIda)
    .filter((seat): seat is string => Boolean(seat));

  return {
    id: String(booking.idCarrito),
    thumbnail: THUMBNAIL_BY_IATA[flight.destinationAirport.code] ?? '/despescar.webp',
    origin: {
      iata: flight.originAirport.code,
      city: flight.originAirport.city,
      time: format(departure, 'HH:mm'),
      date: format(departure, "d 'de' MMMM yyyy", { locale: es }),
    },
    destination: {
      iata: flight.destinationAirport.code,
      city: flight.destinationAirport.city,
      time: format(arrival, 'HH:mm'),
    },
    flightNumber: booking.vueloCodigo,
    seats: seats.join(', '),
    reservationCode: `DSC-${booking.idCarrito}`,
    status: 'upcoming',
    nextDayArrival: !isSameDay(departure, arrival),
    passengerName: passengers[0],
    passengers,
    totalPaid: booking.montoTotal,
    contactEmail,
    remote: true,
  };
};
