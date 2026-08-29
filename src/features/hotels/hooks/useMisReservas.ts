import { useEffect, useState } from 'react';
import type { ReservaHotel } from '../hotels.types';

export const useMisReservas = () => {
  const [reservas, setReservas] = useState<ReservaHotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/json/reservas-hotel.json')
      .then((res) => res.json())
      .then((datos: ReservaHotel[]) => setReservas(datos))
      .catch((e) => console.log(e))
      .finally(() => setLoading(false));
  }, []);

  return { reservas, loading };
};
