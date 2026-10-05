import { describe, expect, it } from 'vitest';
import {
  buildHotelDetailUrl,
  buildHotelSearchQuery,
  buildHotelsUrl,
  fromIsoDate,
  parseHotelSearchParams,
  toIsoDate,
  validarRangoEstadia,
} from './hotelSearchParams';

describe('fechas ISO locales', () => {
  it('no corre el día por zona horaria', () => {
    expect(toIsoDate(new Date(2026, 10, 9, 23, 30))).toBe('2026-11-09');
    expect(fromIsoDate('2026-11-09').getDate()).toBe(9);
  });
});

describe('parseHotelSearchParams', () => {
  it('lee los parámetros', () => {
    const p = parseHotelSearchParams(
      new URLSearchParams('destino=Córdoba&checkIn=2026-11-10&checkOut=2026-11-12&huespedes=3'),
    );
    expect(p).toEqual({
      destino: 'Córdoba',
      checkIn: '2026-11-10',
      checkOut: '2026-11-12',
      huespedes: 3,
    });
  });

  it('usa valores por defecto y descarta lo inválido', () => {
    expect(parseHotelSearchParams(new URLSearchParams('huespedes=99&checkIn=mal'))).toEqual({
      destino: '',
      checkIn: null,
      checkOut: null,
      huespedes: 2,
    });
  });

  it('si falta una de las fechas descarta las dos', () => {
    const p = parseHotelSearchParams(new URLSearchParams('checkIn=2026-11-10'));
    expect(p.checkIn).toBeNull();
    expect(p.checkOut).toBeNull();
  });
});

describe('URLs', () => {
  const params = {
    destino: 'San Carlos',
    checkIn: '2026-11-10',
    checkOut: '2026-11-12',
    huespedes: 2,
  };

  it('arma la query omitiendo lo vacío', () => {
    expect(buildHotelSearchQuery(params)).toBe(
      'destino=San+Carlos&checkIn=2026-11-10&checkOut=2026-11-12&huespedes=2',
    );
    expect(
      buildHotelSearchQuery({ destino: '', checkIn: null, checkOut: null, huespedes: 1 }),
    ).toBe('huespedes=1');
  });

  it('arma las rutas del front', () => {
    expect(buildHotelsUrl(params)).toBe(
      '/hoteles?destino=San+Carlos&checkIn=2026-11-10&checkOut=2026-11-12&huespedes=2',
    );
    expect(buildHotelDetailUrl('abc', params)).toBe(
      '/hoteles/abc?destino=San+Carlos&checkIn=2026-11-10&checkOut=2026-11-12&huespedes=2',
    );
  });
});

describe('validarRangoEstadia', () => {
  const d = (dia: number) => new Date(2026, 10, dia);
  it('rechaza el mismo día y el check-out anterior', () => {
    expect(validarRangoEstadia(d(10), d(10))).toMatch(/al menos un día/);
    expect(validarRangoEstadia(d(10), d(9))).toMatch(/al menos un día/);
  });
  it('acepta de 1 a 30 noches', () => {
    expect(validarRangoEstadia(d(10), d(11))).toBeNull();
    expect(validarRangoEstadia(d(1), d(1 + 30))).toBeNull();
  });
  it('rechaza más de 30 noches', () => {
    expect(validarRangoEstadia(d(1), d(1 + 31))).toBe('La estadía puede ser de hasta 30 noches.');
  });
});
