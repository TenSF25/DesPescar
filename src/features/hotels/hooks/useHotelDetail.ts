import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Hotel } from '../hotels.types';

interface HotelesState {
  hoteles: Hotel[];
  cargado: boolean;
}

export const useHotelDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [datos, setDatos] = useState<HotelesState>({ hoteles: [], cargado: false });

  // Se ejecuta una sola vez: trae TODO el listado, sin depender de "id".
  useEffect(() => {
    fetch('/json/hoteles.json')
      .then((res) => res.json())
      .then((hoteles: Hotel[]) => setDatos({ hoteles, cargado: true }))
      .catch((e) => {
        console.log(e);
        setDatos({ hoteles: [], cargado: true });
      });
  }, []);

  // El hotel puntual se deriva en cada render a partir del "id" de la URL,
  // así que cambiar de hotel a hotel no necesita volver a pedir el JSON.
  const hotel = datos.hoteles.find((h) => h.id === Number(id)) ?? null;
  const loading = !datos.cargado;
  const notFound = datos.cargado && !hotel;

  return { hotel, loading, notFound };
};
