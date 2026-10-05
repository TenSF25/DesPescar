import { describe, expect, it } from 'vitest';
import type { Carrito, EstadiaCarrito } from '@/features/cart/cart.types';
import type { FlightById } from '@/features/flights/flights.types';
import { bookingToReservation, separarPorPestana } from './bookingToReservation';

const AHORA = new Date('2026-10-05T15:00:00');

const estadia = (cambios: Partial<EstadiaCarrito> = {}): EstadiaCarrito => ({
  id: 4,
  hotelId: 'h1',
  hotelNombre: 'Hotel Lago',
  ciudad: 'Bariloche',
  tipoHabitacionId: 't1',
  tipoHabitacionNombre: 'Doble',
  checkIn: '2026-11-10',
  checkOut: '2026-11-12',
  noches: 2,
  cantidadHabitaciones: 1,
  huespedes: 2,
  precioTotal: 60000,
  moneda: 'ARS',
  horaCheckIn: '14:00:00',
  zonaHoraria: 'America/Argentina/Buenos_Aires',
  politicaCancelacion: [{ horasAntes: 72, porcentajeReembolso: 100 }],
  titularNombre: 'Ana Pérez',
  titularDni: '30111222',
  titularTelefono: '1155554444',
  estado: 'ACTIVA',
  ...cambios,
});

const reserva = (cambios: Partial<Carrito> = {}): Carrito => ({
  idCarrito: 15,
  creadorId: 7,
  estadoGeneral: 'CONFIRMADA',
  segundosRestantes: 0,
  montoTotal: 260000,
  moneda: 'ARS',
  cantidadItems: 2,
  datosCompletos: true,
  vuelo: {
    flightIds: ['ida'],
    fareIds: ['f1'],
    cantidadPasajeros: 2,
    precioPorPasajero: 100000,
    subtotal: 200000,
    salida: '2026-11-10T08:00:00',
    tarifas: 'Light',
    pasajerosCargados: true,
  },
  estadias: [estadia()],
  asientos: [{ ...asiento('1A', 'Ana Pérez') }, { ...asiento('1B', 'Luis Gómez') }],
  ...cambios,
});

function asiento(numero: string, nombre: string) {
  return {
    asientoIda: numero,
    asientoVuelta: null,
    pagadorId: 7,
    precioCobrado: 100000,
    estadoPago: 'PAGADO',
    nombrePasajero: nombre,
    dniPasaporte: '1',
    tarifaNombre: 'Light',
  };
}

const vuelo = (cambios: Partial<FlightById> = {}): FlightById =>
  ({
    id: 'ida',
    flightNumber: 'DSC2456',
    departureTime: '2026-11-10T08:00:00',
    arrivalTime: '2026-11-10T10:20:00',
    originAirport: { code: 'AEP', city: 'Buenos Aires' },
    destinationAirport: { code: 'BRC', city: 'Bariloche' },
    ...cambios,
  }) as FlightById;

describe('bookingToReservation', () => {
  it('arma la tarjeta de una reserva con vuelo y hotel', () => {
    const r = bookingToReservation(reserva(), [vuelo()], AHORA);

    expect(r.id).toBe('15');
    expect(r.reservationCode).toBe('DSC-15');
    expect(r.status).toBe('upcoming');
    expect(r.origin).toEqual({
      iata: 'AEP',
      city: 'Buenos Aires',
      time: '08:00',
      date: '10 de noviembre 2026',
    });
    expect(r.destination).toEqual({ iata: 'BRC', city: 'Bariloche', time: '10:20' });
    expect(r.flightNumber).toBe('DSC2456');
    expect(r.duration).toBe('2 h 20 min');
    expect(r.seats).toBe('1A, 1B');
    expect(r.passengers).toEqual(['Ana Pérez', 'Luis Gómez']);
    expect(r.thumbnail).toBe('/bariloche.jpg');
    expect(r.totalPaid).toBe(260000);
    expect(r.flightPrice).toBe(200000);
    expect(r.hotels).toEqual([
      {
        id: 4,
        name: 'Hotel Lago',
        city: 'Bariloche',
        room: 'Doble',
        checkIn: '10 de noviembre 2026',
        checkOut: '12 de noviembre 2026',
        nights: 2,
        price: 60000,
        holder: 'Ana Pérez',
      },
    ]);
  });

  it('una reserva solo de hotel no tiene vuelo y usa la imagen de la marca', () => {
    const r = bookingToReservation(reserva({ vuelo: null, asientos: [] }), [], AHORA);

    expect(r.origin).toBeUndefined();
    expect(r.destination).toBeUndefined();
    expect(r.hotels).toHaveLength(1);
    expect(r.thumbnail).toBe('/despescar.webp');
    expect(r.passengerName).toBe('Ana Pérez');
  });

  it('si no se pudo leer el vuelo igual muestra la salida guardada en la reserva', () => {
    const r = bookingToReservation(reserva(), [undefined], AHORA);

    expect(r.origin).toEqual({
      iata: '—',
      city: 'Origen',
      time: '08:00',
      date: '10 de noviembre 2026',
    });
    expect(r.destination).toEqual({ iata: '—', city: 'Destino', time: '' });
    expect(r.flightNumber).toBe('—');
  });

  it('la llegada al día siguiente y la vuelta quedan indicadas', () => {
    const ida = vuelo({ departureTime: '2026-11-10T22:05:00', arrivalTime: '2026-11-11T01:50:00' });
    const vuelta = vuelo({
      id: 'vuelta',
      departureTime: '2026-11-15T09:00:00',
      arrivalTime: '2026-11-15T11:00:00',
    });
    const r = bookingToReservation(
      reserva({ vuelo: { ...reserva().vuelo!, flightIds: ['ida', 'vuelta'] } }),
      [ida, vuelta],
      AHORA,
    );

    expect(r.nextDayArrival).toBe(true);
    expect(r.returnDate).toBe('15 de noviembre 2026');
  });

  it('una reserva cancelada lleva lo reembolsado y si se pagó en grupo', () => {
    const r = bookingToReservation(
      reserva({
        estadoGeneral: 'CANCELADA',
        montoReembolsado: 230000,
        reembolsoPendiente: true,
        pagoEnGrupo: true,
      }),
      [vuelo()],
      AHORA,
    );

    expect(r.status).toBe('cancelled');
    expect(r.refunded).toBe(230000);
    expect(r.refundPending).toBe(true);
    expect(r.groupPaid).toBe(true);
  });

  it('pasa al historial cuando terminó todo: la última llegada y el último check-out', () => {
    const terminado = (ahora: string) =>
      bookingToReservation(reserva(), [vuelo()], new Date(ahora)).status;

    expect(terminado('2026-11-10T12:00:00')).toBe('upcoming');
    expect(terminado('2026-11-12T23:00:00')).toBe('upcoming');
    expect(terminado('2026-11-13T00:00:01')).toBe('completed');
    // Solo vuelo: termina cuando llega el último tramo
    const soloVuelo = reserva({ estadias: [] });
    expect(bookingToReservation(soloVuelo, [vuelo()], new Date('2026-11-10T10:19:00')).status).toBe(
      'upcoming',
    );
    expect(bookingToReservation(soloVuelo, [vuelo()], new Date('2026-11-10T10:21:00')).status).toBe(
      'completed',
    );
  });
});

describe('separarPorPestana', () => {
  it('reparte por estado y conserva el orden', () => {
    const proxima = bookingToReservation(reserva(), [vuelo()], AHORA);
    const pasada = bookingToReservation(
      reserva({ idCarrito: 9 }),
      [vuelo()],
      new Date('2027-01-01T00:00:00'),
    );
    const cancelada = bookingToReservation(
      reserva({ idCarrito: 3, estadoGeneral: 'CANCELADA' }),
      [vuelo()],
      AHORA,
    );

    const pestanas = separarPorPestana([proxima, pasada, cancelada]);

    expect(pestanas.upcoming.map((r) => r.id)).toEqual(['15']);
    expect(pestanas.history.map((r) => r.id)).toEqual(['9']);
    expect(pestanas.cancelled.map((r) => r.id)).toEqual(['3']);
  });
});
