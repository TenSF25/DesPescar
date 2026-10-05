import type { Itinerary } from '../flights.types';

/**
 * Duración del vuelo en minutos, calculada con la salida y la llegada. El backend manda un
 * `durationMinutes` fijo (120) para todos los vuelos, así que solo se usa si faltan las horas.
 */
export const getDurationMinutes = (itinerary: Itinerary) => {
  const salida = new Date(itinerary.departure.dateTime).getTime();
  const llegada = new Date(itinerary.arrival.dateTime).getTime();
  const minutos = Math.round((llegada - salida) / 60000);
  return Number.isFinite(minutos) && minutos > 0 ? minutos : itinerary.durationMinutes;
};
