import type { HotelResumen, Servicio } from './hotels.types';

export type OrdenHotel = 'recomendados' | 'precio_asc' | 'precio_desc' | 'calificacion';

export interface HotelFiltros {
  estrellas: number[];
  precioMax: number | null;
  servicios: Servicio[];
  calificacionMin: number;
  soloAllInclusive: boolean;
}

export const FILTROS_INICIALES: HotelFiltros = {
  estrellas: [],
  precioMax: null,
  servicios: [],
  calificacionMin: 0,
  soloAllInclusive: false,
};

/** Con fechas compara el total de la estadía; sin fechas, el precio por noche "desde". */
export const precioDeReferencia = (h: HotelResumen): number | null =>
  h.precioTotalDesde ?? h.precioDesde;

export const filtrarHoteles = (hoteles: HotelResumen[], f: HotelFiltros): HotelResumen[] =>
  hoteles.filter((h) => {
    const precio = precioDeReferencia(h);
    if (f.estrellas.length > 0 && !f.estrellas.includes(h.estrellas)) return false;
    if (f.precioMax !== null && (precio === null || precio > f.precioMax)) return false;
    if (!f.servicios.every((s) => h.servicios.includes(s))) return false;
    if (h.calificacionPromedio < f.calificacionMin) return false;
    if (f.soloAllInclusive && !h.allInclusive) return false;
    return true;
  });

const porPrecio = (a: HotelResumen, b: HotelResumen) =>
  (precioDeReferencia(a) ?? Infinity) - (precioDeReferencia(b) ?? Infinity);

const comparadores: Record<OrdenHotel, (a: HotelResumen, b: HotelResumen) => number> = {
  recomendados: (a, b) => b.calificacionPromedio - a.calificacionPromedio || porPrecio(a, b),
  precio_asc: porPrecio,
  precio_desc: (a, b) =>
    (precioDeReferencia(b) ?? -Infinity) - (precioDeReferencia(a) ?? -Infinity),
  calificacion: (a, b) => b.calificacionPromedio - a.calificacionPromedio,
};

/** Los que no tienen lugar para las fechas van siempre al final. */
export const ordenarHoteles = (hoteles: HotelResumen[], orden: OrdenHotel): HotelResumen[] =>
  [...hoteles].sort(
    (a, b) =>
      Number(a.disponible === false) - Number(b.disponible === false) || comparadores[orden](a, b),
  );
