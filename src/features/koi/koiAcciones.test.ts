import { describe, expect, it } from 'vitest';
import type { KoiOpcion } from './koi.types';
import {
  botonesDeOpcion,
  estadoDeAsientos,
  mensajeErrorCarrito,
  planDeCarrito,
} from './koiAcciones';

const vuelo = {
  departureFlightId: 'f-ida',
  returnFlightId: 'f-vuelta',
  departureFareId: 't-ida',
  returnFareId: 't-vuelta',
  aerolinea: 'Flybondi',
  numeroIda: 'FO1045',
  numeroVuelta: 'FO1046',
  salidaIda: '2026-11-19T08:00:00',
  llegadaIda: '2026-11-19T10:30:00',
  salidaVuelta: '2026-11-22T13:00:00',
  llegadaVuelta: '2026-11-22T15:30:00',
  precio: 520000,
};

const hotel = {
  hotelId: 'h1',
  hotelNombre: 'Llao Llao',
  ciudad: 'San Carlos de Bariloche',
  estrellas: 5,
  tipoHabitacionId: 'th1',
  tipoHabitacionNombre: 'Doble',
  checkIn: '2026-11-19',
  checkOut: '2026-11-22',
  noches: 3,
  cantidadHabitaciones: 2,
  huespedes: 3,
  precio: 960000,
};

const base = { optionId: 'op', viajeros: 3, total: 0, moneda: 'ARS' as const, motivo: '' };
const combo: KoiOpcion = { ...base, tipo: 'COMBO', vuelo, hotel };
const soloVuelo: KoiOpcion = { ...base, tipo: 'VUELO', vuelo };
const soloHotel: KoiOpcion = { ...base, tipo: 'HOTEL', hotel };

const estadiaEsperada = {
  hotelId: 'h1',
  tipoHabitacionId: 'th1',
  checkIn: '2026-11-19',
  checkOut: '2026-11-22',
  cantidadHabitaciones: 2,
  huespedes: 3,
};

const vueloEsperado = {
  selectedDepartureFlight: 'f-ida',
  selectedReturnFlight: 'f-vuelta',
  selectedDepartureFare: 't-ida',
  selectedReturnFare: 't-vuelta',
  passengers: 3,
};

describe('botones de cada opción', () => {
  it('un combo ofrece agregar todo, solo vuelo o solo hotel', () => {
    expect(botonesDeOpcion(combo)).toEqual([
      { accion: 'TODO', etiqueta: 'Agregar todo', principal: true },
      { accion: 'SOLO_VUELO', etiqueta: 'Solo vuelo', principal: false },
      { accion: 'SOLO_HOTEL', etiqueta: 'Solo hotel', principal: false },
    ]);
  });

  it('una opción de un solo componente tiene un solo botón', () => {
    expect(botonesDeOpcion(soloVuelo)).toEqual([
      { accion: 'SOLO_VUELO', etiqueta: 'Agregar vuelo', principal: true },
    ]);
    expect(botonesDeOpcion(soloHotel)).toEqual([
      { accion: 'SOLO_HOTEL', etiqueta: 'Agregar hotel', principal: true },
    ]);
  });
});

describe('planDeCarrito', () => {
  it('agregar todo suma la estadía y lleva el vuelo al paso de asientos', () => {
    expect(planDeCarrito(combo, 'TODO')).toEqual({
      estadia: estadiaEsperada,
      vuelo: vueloEsperado,
      navegarA: '/booking/seats',
    });
  });

  it('solo vuelo no toca el hotel', () => {
    expect(planDeCarrito(combo, 'SOLO_VUELO')).toEqual({
      estadia: null,
      vuelo: vueloEsperado,
      navegarA: '/booking/seats',
    });
    expect(planDeCarrito(soloVuelo, 'SOLO_VUELO').vuelo).toEqual(vueloEsperado);
  });

  it('solo hotel agrega la estadía y no navega', () => {
    expect(planDeCarrito(combo, 'SOLO_HOTEL')).toEqual({
      estadia: estadiaEsperada,
      vuelo: null,
      navegarA: null,
    });
    expect(planDeCarrito(soloHotel, 'SOLO_HOTEL').estadia).toEqual(estadiaEsperada);
  });

  it('un vuelo solo de ida deja la vuelta en null', () => {
    const ida: KoiOpcion = {
      ...soloVuelo,
      vuelo: { ...vuelo, returnFlightId: undefined, returnFareId: undefined },
      viajeros: 1,
    };
    expect(planDeCarrito(ida, 'SOLO_VUELO').vuelo).toEqual({
      selectedDepartureFlight: 'f-ida',
      selectedReturnFlight: null,
      selectedDepartureFare: 't-ida',
      selectedReturnFare: null,
      passengers: 1,
    });
  });

  it('rechaza una acción que la opción no tiene', () => {
    expect(() => planDeCarrito(soloVuelo, 'SOLO_HOTEL')).toThrow();
    expect(() => planDeCarrito(soloHotel, 'TODO')).toThrow();
    expect(() => planDeCarrito(soloHotel, 'SOLO_VUELO')).toThrow();
  });
});

describe('estadoDeAsientos', () => {
  it('carga el vuelo y limpia lo que había quedado de otra compra', () => {
    expect(estadoDeAsientos(vueloEsperado)).toEqual({
      ...vueloEsperado,
      bookingId: null,
      selectedSeats: [],
    });
  });
});

describe('mensajeErrorCarrito', () => {
  it('explica los errores conocidos del carrito', () => {
    expect(mensajeErrorCarrito(409, 'SIN_DISPONIBILIDAD_HOTEL')).toMatch(/no quedan habitaciones/i);
    expect(mensajeErrorCarrito(404, 'HOTEL_NO_ENCONTRADO')).toMatch(/ya no está disponible/);
    expect(mensajeErrorCarrito(401)).toMatch(/iniciá sesión/i);
    expect(mensajeErrorCarrito(503)).toMatch(/en un ratito/);
    expect(mensajeErrorCarrito(undefined)).toMatch(/No pude agregarlo/);
  });

  it('explica el carrito vencido y el carrito en uso', () => {
    expect(mensajeErrorCarrito(410, 'CARRITO_EXPIRADO')).toMatch(/venció/);
    expect(mensajeErrorCarrito(409, 'CARRITO_EN_USO')).toMatch(/otro pedido/);
    expect(mensajeErrorCarrito(409, 'CARRITO_YA_TIENE_VUELO')).toMatch(/ya tiene un vuelo/);
  });
});
