import type { Itinerary } from '../flights.types';

/**
 * Duración del vuelo en minutos, calculada con la salida y la llegada (coincide con el
 * `durationMinutes` que informa el backend, que se usa si faltan las horas).
 */
export const getDurationMinutes = (itinerary: Itinerary) => {
  const salida = new Date(itinerary.departure.dateTime).getTime();
  const llegada = new Date(itinerary.arrival.dateTime).getTime();
  const minutos = Math.round((llegada - salida) / 60000);
  return Number.isFinite(minutos) && minutos > 0 ? minutos : itinerary.durationMinutes;
};
