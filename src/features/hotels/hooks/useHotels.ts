import { useState, useEffect } from 'react';
import type { Hotel } from '../hotels.types';

export const useHotels = () => {
  const [hoteles, setHoteles] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/json/hoteles.json')
      .then((res) => res.json())
      .then((datos: Hotel[]) => setHoteles(datos))
      .catch((e) => console.log(e))
      .finally(() => setLoading(false));
  }, []);

  return { hoteles, loading };
};
