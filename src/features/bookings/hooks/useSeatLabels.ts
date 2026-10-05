import { useEffect, useState } from 'react';
import { api } from '@/config/api';
import type { FlightSeatMapResponse } from '../bookings.types';

/** uuid del asiento -> número visible ("12A"), por vuelo. El mapa de asientos no cambia durante la compra. */
const cache = new Map<string, Record<string, string>>();

/**
 * Etiquetas de los asientos elegidos. La selección guarda UUIDs; el mapa de asientos del vuelo
 * permite mostrarlos como "12A". Mientras carga (o si falla) el objeto viene vacío.
 */
export const useSeatLabels = (flightId: string | null, passengerCount: number) => {
  const [labels, setLabels] = useState<Record<string, string>>(() =>
    flightId ? (cache.get(flightId) ?? {}) : {},
  );

  useEffect(() => {
    if (!flightId || cache.has(flightId)) return;

    let active = true;
    api
      .get<FlightSeatMapResponse>(
        `/api/bookings/flights/${flightId}/seat-map?selectionLimit=${passengerCount}`,
      )
      .then((res) => {
        const found: Record<string, string> = {};
        res.data.layout.forEach((element) => {
          if (element.type !== 'row') return;
          element.items.forEach((item) => {
            if (item.type === 'seat') found[item.seatUuid] = item.displayNumber;
          });
        });
        cache.set(flightId, found);
        if (active) setLabels(found);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [flightId, passengerCount]);

  return labels;
};
