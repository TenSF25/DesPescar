import { useState, useEffect } from 'react';
import type { Aeropuerto } from '../../../types/Interfaces';

export const useAeropuerto = () => {
  const [aeropuertos, setAero] = useState<Aeropuerto[]>([]);

  useEffect(() => {
    fetch('/json/aeropuertos.json')
      .then((res) => res.json())
      .then((datos: Aeropuerto[]) => {
        setAero(datos);
      })
      .catch((e) => console.log(e));
  }, []);

  return {
    aeropuertos,
  };
};
