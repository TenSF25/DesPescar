import { describe, expect, it } from 'vitest';
import type { HotelResumen } from './hotels.types';
import { FILTROS_INICIALES, filtrarHoteles, ordenarHoteles } from './hotelFilters';

const hotel = (over: Partial<HotelResumen>): HotelResumen => ({
  id: over.nombre ?? 'x',
  nombre: 'x',
  ciudad: 'c',
  pais: 'p',
  estrellas: 4,
  imagenPrincipal: null,
  servicios: [],
  allInclusive: false,
  precioDesde: 100,
  calificacionPromedio: 0,
  cantidadResenas: 0,
  disponible: null,
  precioTotalDesde: null,
  ...over,
});

const a = hotel({
  nombre: 'A',
  estrellas: 5,
  precioDesde: 300,
  calificacionPromedio: 4.8,
  servicios: ['WIFI', 'SPA'],
  allInclusive: true,
});
const b = hotel({
  nombre: 'B',
  estrellas: 4,
  precioDesde: 100,
  calificacionPromedio: 4.1,
  servicios: ['WIFI'],
});
const c = hotel({
  nombre: 'C',
  estrellas: 3,
  precioDesde: 200,
  calificacionPromedio: 0,
  servicios: [],
});

describe('filtrarHoteles', () => {
  it('sin filtros devuelve todo', () => {
    expect(filtrarHoteles([a, b, c], FILTROS_INICIALES)).toHaveLength(3);
  });

  it('combina estrellas, precio, servicios, calificación y all inclusive', () => {
    expect(
      filtrarHoteles([a, b, c], { ...FILTROS_INICIALES, estrellas: [4, 5] }).map((h) => h.nombre),
    ).toEqual(['A', 'B']);
    expect(
      filtrarHoteles([a, b, c], { ...FILTROS_INICIALES, precioMax: 200 }).map((h) => h.nombre),
    ).toEqual(['B', 'C']);
    expect(
      filtrarHoteles([a, b, c], { ...FILTROS_INICIALES, servicios: ['WIFI', 'SPA'] }).map(
        (h) => h.nombre,
      ),
    ).toEqual(['A']);
    expect(
      filtrarHoteles([a, b, c], { ...FILTROS_INICIALES, calificacionMin: 4.5 }).map(
        (h) => h.nombre,
      ),
    ).toEqual(['A']);
    expect(
      filtrarHoteles([a, b, c], { ...FILTROS_INICIALES, soloAllInclusive: true }).map(
        (h) => h.nombre,
      ),
    ).toEqual(['A']);
  });

  it('con fechas, el precio filtra por el total de la estadía', () => {
    const conFechas = hotel({
      nombre: 'D',
      precioDesde: 100,
      precioTotalDesde: 900,
      disponible: true,
    });
    expect(filtrarHoteles([conFechas], { ...FILTROS_INICIALES, precioMax: 500 })).toHaveLength(0);
  });
});

describe('ordenarHoteles', () => {
  it('ordena por precio y calificación', () => {
    expect(ordenarHoteles([a, b, c], 'precio_asc').map((h) => h.nombre)).toEqual(['B', 'C', 'A']);
    expect(ordenarHoteles([a, b, c], 'precio_desc').map((h) => h.nombre)).toEqual(['A', 'C', 'B']);
    expect(ordenarHoteles([a, b, c], 'calificacion').map((h) => h.nombre)).toEqual(['A', 'B', 'C']);
  });

  it('los no disponibles van siempre al final', () => {
    const lleno = hotel({
      nombre: 'Lleno',
      precioDesde: 1,
      disponible: false,
      calificacionPromedio: 5,
    });
    const libre = hotel({
      nombre: 'Libre',
      precioDesde: 500,
      disponible: true,
      precioTotalDesde: 1000,
    });
    expect(ordenarHoteles([lleno, libre], 'precio_asc').map((h) => h.nombre)).toEqual([
      'Libre',
      'Lleno',
    ]);
    expect(ordenarHoteles([lleno, libre], 'recomendados').map((h) => h.nombre)).toEqual([
      'Libre',
      'Lleno',
    ]);
  });

  it('no modifica el arreglo original', () => {
    const lista = [a, b, c];
    ordenarHoteles(lista, 'precio_asc');
    expect(lista.map((h) => h.nombre)).toEqual(['A', 'B', 'C']);
  });
});
