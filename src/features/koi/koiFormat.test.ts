import { describe, expect, it } from 'vitest';
import { formatCurrency } from '@/utils/formatCurrency';
import type { KoiOpcion } from './koi.types';
import {
  desgloseOpcion,
  fechaDe,
  formatHabitaciones,
  formatViajeros,
  horaDe,
  resumenEstadia,
  textoExcedente,
  tramoVuelo,
} from './koiFormat';

const combo: KoiOpcion = {
  optionId: 'op-1',
  tipo: 'COMBO',
  vuelo: {
    departureFlightId: 'f1',
    returnFlightId: 'f2',
    departureFareId: 't1',
    returnFareId: 't2',
    aerolinea: 'Flybondi',
    numeroIda: 'FO1045',
    numeroVuelta: 'FO1046',
    salidaIda: '2026-11-19T08:00:00',
    llegadaIda: '2026-11-19T10:30:00',
    salidaVuelta: '2026-11-22T13:00:00',
    llegadaVuelta: '2026-11-22T15:30:00',
    precio: 520000,
  },
  hotel: {
    hotelId: 'h1',
    hotelNombre: 'Llao Llao',
    ciudad: 'San Carlos de Bariloche',
    estrellas: 5,
    tipoHabitacionId: 'th1',
    tipoHabitacionNombre: 'Doble superior',
    checkIn: '2026-11-19',
    checkOut: '2026-11-22',
    noches: 3,
    cantidadHabitaciones: 2,
    huespedes: 3,
    precio: 960000,
  },
  viajeros: 3,
  total: 1480000,
  moneda: 'ARS',
  motivo: '...',
};

describe('formato de las opciones de KOI', () => {
  it('toma la hora y la fecha de una fecha y hora ISO local', () => {
    expect(horaDe('2026-11-19T08:05:00')).toBe('08:05');
    expect(fechaDe('2026-11-19T08:05:00')).toMatch(/^19 nov/);
    expect(tramoVuelo('2026-11-19T08:00:00', '2026-11-19T10:30:00')).toMatch(/^19 nov.* · 08:00 → 10:30$/);
  });

  it('pluraliza viajeros y habitaciones', () => {
    expect(formatViajeros(1)).toBe('1 viajero');
    expect(formatViajeros(3)).toBe('3 viajeros');
    expect(formatHabitaciones(1)).toBe('1 habitación');
    expect(formatHabitaciones(2)).toBe('2 habitaciones');
  });

  it('resume la estadía', () => {
    expect(resumenEstadia(combo.hotel!)).toBe('Doble superior · 2 habitaciones · 3 noches');
  });

  it('desglosa vuelo y hotel en pesos', () => {
    expect(desgloseOpcion(combo)).toEqual([
      { etiqueta: 'Vuelo ida y vuelta · 3 viajeros', monto: 520000 },
      { etiqueta: 'Hotel · 3 noches', monto: 960000 },
    ]);
    const soloIda: KoiOpcion = {
      ...combo,
      tipo: 'VUELO',
      hotel: undefined,
      vuelo: { ...combo.vuelo!, returnFlightId: undefined, returnFareId: undefined },
      viajeros: 1,
    };
    expect(desgloseOpcion(soloIda)).toEqual([{ etiqueta: 'Vuelo solo ida · 1 viajero', monto: 520000 }]);
  });

  it('describe el excedente con el formato de pesos del sitio', () => {
    expect(textoExcedente(400)).toBe(`Se pasa por ${formatCurrency(400)} de tu presupuesto`);
  });
});
