import { useEffect, useMemo, useState } from 'react';
import type { Destino } from '../hotels.types';
import { obtenerDestinos } from '../services/hotelsService';

const normalizar = (s: string) => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim();

/** Destinos con hoteles, filtrados por lo que escribe el usuario (sin tildes). */
export const useDestinos = (texto: string) => {
  const [destinos, setDestinos] = useState<Destino[]>([]);

  useEffect(() => {
    let activo = true;
    obtenerDestinos()
      .then((d) => activo && setDestinos(d))
      .catch(() => activo && setDestinos([]));
    return () => {
      activo = false;
    };
  }, []);

  const sugerencias = useMemo(() => {
    const filtro = normalizar(texto);
    if (!filtro) return [];
    return destinos
      .filter((d) => normalizar(d.ciudad).includes(filtro) || normalizar(d.pais).includes(filtro))
      .slice(0, 8);
  }, [destinos, texto]);

  return { sugerencias };
};
