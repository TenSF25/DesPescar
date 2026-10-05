import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router';
import axios from 'axios';
import type { HotelDetalle } from '../hotels.types';
import { parseHotelSearchParams } from '../hotelSearchParams';
import { obtenerHotel } from '../services/hotelsService';

export const useHotelDetail = () => {
  const { id = '' } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useMemo(() => parseHotelSearchParams(searchParams), [searchParams]);
  const [hotel, setHotel] = useState<HotelDetalle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [avisoFechas, setAvisoFechas] = useState<string | null>(null);

  useEffect(() => {
    let activo = true;
    const cargar = async () => {
      setIsLoading(true);
      setError(null);
      setAvisoFechas(null);
      try {
        let h: HotelDetalle;
        try {
          h = await obtenerHotel(id, params);
        } catch (err: unknown) {
          const conFechas = params.checkIn !== null && params.checkOut !== null;
          if (!conFechas || !axios.isAxiosError(err) || err.response?.status !== 400) throw err;
          const aviso = (err.response.data as { error?: string })?.error;
          h = await obtenerHotel(id, { ...params, checkIn: null, checkOut: null });
          if (activo) setAvisoFechas(aviso ?? 'Las fechas elegidas no son válidas. Elegí otras.');
        }
        if (activo) setHotel(h);
      } catch (err: unknown) {
        if (!activo) return;
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setError('Este hotel no existe o ya no está disponible.');
        } else {
          const mensaje = axios.isAxiosError(err)
            ? (err.response?.data as { error?: string })?.error
            : undefined;
          setError(mensaje ?? 'No pudimos cargar el hotel. Probá de nuevo en unos minutos.');
        }
      } finally {
        if (activo) setIsLoading(false);
      }
    };
    cargar();
    return () => {
      activo = false;
    };
  }, [id, params]);

  return { hotel, params, setSearchParams, isLoading, error, avisoFechas };
};
