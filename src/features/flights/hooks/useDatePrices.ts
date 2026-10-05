import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '@/config/api';

/** Precio mínimo por fecha ya consultado; `null` = ese día no hay vuelos. Se comparte entre renders y búsquedas. */
const cache = new Map<string, number | null>();
const CONCURRENCY = 5;

const diasEntre = (a: string, b: string) =>
  Math.abs(new Date(a + 'T00:00:00').getTime() - new Date(b + 'T00:00:00').getTime());

const fetchMinPrice = async (
  origin: string,
  destination: string,
  passengers: number,
  date: string,
) => {
  const params = new URLSearchParams({
    origin: origin.toUpperCase(),
    destination: destination.toUpperCase(),
    departureDate: date,
    passengers: String(passengers),
  });
  const res = await api.get<{
    departureFlights?: Array<{ price: { transparentFinalPrice: number } }>;
  }>(`/api/flights/search?${params}`);
  const precios = (res.data.departureFlights ?? []).map((f) => f.price.transparentFinalPrice);
  return precios.length > 0 ? Math.min(...precios) : null;
};

/**
 * Precio mínimo de cada fecha del carrusel para una ruta. Consulta el backend de a pocas fechas a la vez,
 * empezando por las más cercanas a la elegida (las que se ven primero). Una fecha sin entrada todavía carga.
 */
export const useDatePrices = (
  origin: string,
  destination: string,
  passengers: number,
  dates: string[],
  centerDate: string,
) => {
  // Solo sirve para volver a renderizar cuando llega un precio: los valores viven en `cache`.
  const [, setVersion] = useState(0);
  const datesKey = dates.join(',');
  const keyOf = useCallback(
    (date: string) => `${origin}|${destination}|${passengers}|${date}`,
    [origin, destination, passengers],
  );

  const ordered = useMemo(
    () =>
      datesKey
        .split(',')
        .filter(Boolean)
        .sort((a, b) => diasEntre(a, centerDate) - diasEntre(b, centerDate)),
    [datesKey, centerDate],
  );

  useEffect(() => {
    if (!origin || !destination) return;

    let active = true;
    const queue = ordered.filter((date) => !cache.has(keyOf(date)));

    const worker = async () => {
      for (let date = queue.shift(); date; date = queue.shift()) {
        try {
          cache.set(keyOf(date), await fetchMinPrice(origin, destination, passengers, date));
        } catch {
          continue; // sin precio: la fecha queda cargando
        }
        if (!active) return;
        setVersion((version) => version + 1);
      }
    };

    Promise.all(Array.from({ length: CONCURRENCY }, worker));

    return () => {
      active = false;
    };
  }, [origin, destination, passengers, ordered, keyOf]);

  return Object.fromEntries(dates.map((date) => [date, cache.get(keyOf(date))])) as Record<
    string,
    number | null | undefined
  >;
};
