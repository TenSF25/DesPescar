import { formatFechaCorta, formatNoches } from '@/features/hotels/hotelFormat';
import { formatCurrency } from '@/utils/formatCurrency';
import type { KoiHotelOpcion, KoiOpcion } from './koi.types';

/** "2026-11-19T08:05:00" → "08:05" (hora local de la aerolínea, sin convertir zonas). */
export const horaDe = (isoLocal: string) => isoLocal.slice(11, 16);

/** "2026-11-19T08:05:00" o "2026-11-19" → "19 nov." */
export const fechaDe = (iso: string) => formatFechaCorta(iso.slice(0, 10));

export const tramoVuelo = (salida: string, llegada: string) =>
  `${fechaDe(salida)} · ${horaDe(salida)} → ${horaDe(llegada)}`;

export const formatViajeros = (n: number) => `${n} ${n === 1 ? 'viajero' : 'viajeros'}`;

export const formatHabitaciones = (n: number) => `${n} ${n === 1 ? 'habitación' : 'habitaciones'}`;

export const resumenEstadia = (hotel: KoiHotelOpcion) =>
  `${hotel.tipoHabitacionNombre} · ${formatHabitaciones(hotel.cantidadHabitaciones)} · ${formatNoches(hotel.noches)}`;

/** Una línea por componente; el total va aparte (opcion.total). */
export const desgloseOpcion = (opcion: KoiOpcion): { etiqueta: string; monto: number }[] => {
  const lineas: { etiqueta: string; monto: number }[] = [];
  if (opcion.vuelo) {
    const tipo = opcion.vuelo.returnFlightId ? 'ida y vuelta' : 'solo ida';
    lineas.push({
      etiqueta: `Vuelo ${tipo} · ${formatViajeros(opcion.viajeros)}`,
      monto: opcion.vuelo.precio,
    });
  }
  if (opcion.hotel) {
    lineas.push({ etiqueta: `Hotel · ${formatNoches(opcion.hotel.noches)}`, monto: opcion.hotel.precio });
  }
  return lineas;
};

export const textoExcedente = (monto: number) =>
  `Se pasa por ${formatCurrency(monto)} de tu presupuesto`;
