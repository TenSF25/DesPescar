import type { HotelSearchParams } from './hotels.types';

export const HUESPEDES_POR_DEFECTO = 2;
export const MAX_HUESPEDES = 10;
const ISO = /^\d{4}-\d{2}-\d{2}$/;

/** Fecha local a YYYY-MM-DD (sin pasar por UTC, que puede correr el día). */
export const toIsoDate = (d: Date): string => {
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
};

export const fromIsoDate = (iso: string): Date => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export const parseHotelSearchParams = (sp: URLSearchParams): HotelSearchParams => {
  const checkIn = sp.get('checkIn');
  const checkOut = sp.get('checkOut');
  const fechasValidas = !!checkIn && !!checkOut && ISO.test(checkIn) && ISO.test(checkOut);
  const huespedes = Number(sp.get('huespedes'));
  return {
    destino: sp.get('destino') ?? '',
    checkIn: fechasValidas ? checkIn : null,
    checkOut: fechasValidas ? checkOut : null,
    huespedes:
      Number.isInteger(huespedes) && huespedes >= 1 && huespedes <= MAX_HUESPEDES
        ? huespedes
        : HUESPEDES_POR_DEFECTO,
  };
};

export const buildHotelSearchQuery = (p: HotelSearchParams): string => {
  const sp = new URLSearchParams();
  if (p.destino.trim()) sp.set('destino', p.destino.trim());
  if (p.checkIn && p.checkOut) {
    sp.set('checkIn', p.checkIn);
    sp.set('checkOut', p.checkOut);
  }
  sp.set('huespedes', String(p.huespedes));
  return sp.toString();
};

export const buildHotelsUrl = (p: HotelSearchParams) => `/hoteles?${buildHotelSearchQuery(p)}`;

export const buildHotelDetailUrl = (id: string, p: HotelSearchParams) =>
  `/hoteles/${encodeURIComponent(id)}?${buildHotelSearchQuery(p)}`;
