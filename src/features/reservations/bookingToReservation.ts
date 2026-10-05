import { differenceInMinutes, format, isSameDay, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Carrito } from '@/features/cart/cart.types';
import type { FlightById } from '@/features/flights/flights.types';
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

const fecha = (iso: string) => format(parseISO(iso), "d 'de' MMMM yyyy", { locale: es });
const hora = (iso: string) => format(parseISO(iso), 'HH:mm');

const duracion = (salida: Date, llegada: Date) => {
  const minutos = Math.max(0, differenceInMinutes(llegada, salida));
  return `${Math.floor(minutos / 60)} h ${minutos % 60} min`;
};

/** Cuándo termina el viaje: la última llegada (o salida, si no se conoce) y el final del último check-out. */
const finDelViaje = (reserva: Carrito, vuelos: (FlightById | undefined)[]): Date | null => {
  const momentos = [
    ...vuelos.filter((v) => v !== undefined).map((v) => parseISO(v.arrivalTime)),
    ...reserva.estadias.map((e) => parseISO(`${e.checkOut}T23:59:59`)),
  ];
  if (reserva.vuelo && momentos.length === reserva.estadias.length) {
    momentos.push(parseISO(reserva.vuelo.salida));
  }
  return momentos.length ? new Date(Math.max(...momentos.map((m) => m.getTime()))) : null;
};

/**
 * Convierte una reserva de reservation-service (GET /api/bookings/mias) a lo que muestra "Mis
 * reservas". vuelos: los tramos de reserva.vuelo.flightIds, en ese orden (undefined si no se pudo
 * leer alguno de flight-service).
 */
export const bookingToReservation = (
  reserva: Carrito,
  vuelos: (FlightById | undefined)[],
  ahora: Date,
): FlightReservation => {
  const [ida, vuelta] = vuelos;
  const pasajeros = reserva.asientos
    .map((a) => a.nombrePasajero)
    .filter((nombre): nombre is string => Boolean(nombre));
  const asientos = reserva.asientos
    .map((a) => a.asientoIda)
    .filter((asiento): asiento is string => Boolean(asiento));
  const fin = finDelViaje(reserva, vuelos);
  const cancelada = reserva.estadoGeneral === 'CANCELADA';

  const base: FlightReservation = {
    id: String(reserva.idCarrito),
    thumbnail: (ida && THUMBNAIL_BY_IATA[ida.destinationAirport.code]) ?? '/despescar.webp',
    flightNumber: ida?.flightNumber ?? '—',
    seats: asientos.join(', '),
    reservationCode: `DSC-${reserva.idCarrito}`,
    status: cancelada ? 'cancelled' : fin && fin < ahora ? 'completed' : 'upcoming',
    passengerName: pasajeros[0] ?? reserva.estadias[0]?.titularNombre ?? undefined,
    passengers: pasajeros,
    totalPaid: reserva.montoTotal,
    hotels: reserva.estadias.map((e) => ({
      id: e.id,
      name: e.hotelNombre,
      city: e.ciudad,
      room: e.tipoHabitacionNombre,
      checkIn: fecha(e.checkIn),
      checkOut: fecha(e.checkOut),
      nights: e.noches,
      price: e.precioTotal,
      holder: e.titularNombre ?? undefined,
    })),
  };
  if (cancelada && reserva.montoReembolsado != null) {
    base.refunded = reserva.montoReembolsado;
    base.refundPending = Boolean(reserva.reembolsoPendiente);
  }
  if (reserva.pagoEnGrupo) base.groupPaid = true;
  if (!reserva.vuelo) return base;

  base.flightPrice = reserva.vuelo.subtotal;
  if (vuelta) base.returnDate = fecha(vuelta.departureTime);
  if (!ida) {
    const { salida } = reserva.vuelo;
    return {
      ...base,
      origin: { iata: '—', city: 'Origen', time: hora(salida), date: fecha(salida) },
      destination: { iata: '—', city: 'Destino', time: '' },
    };
  }
  const salida = parseISO(ida.departureTime);
  const llegada = parseISO(ida.arrivalTime);
  return {
    ...base,
    origin: {
      iata: ida.originAirport.code,
      city: ida.originAirport.city,
      time: hora(ida.departureTime),
      date: fecha(ida.departureTime),
    },
    destination: {
      iata: ida.destinationAirport.code,
      city: ida.destinationAirport.city,
      time: hora(ida.arrivalTime),
    },
    nextDayArrival: !isSameDay(salida, llegada),
    duration: duracion(salida, llegada),
  };
};

/** Las tres pestañas de "Mis reservas", cada una en el orden recibido (la más nueva primero). */
export const separarPorPestana = (reservas: FlightReservation[]) => ({
  upcoming: reservas.filter((r) => r.status === 'upcoming'),
  history: reservas.filter((r) => r.status === 'completed'),
  cancelled: reservas.filter((r) => r.status === 'cancelled'),
});
