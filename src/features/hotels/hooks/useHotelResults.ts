import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import axios from 'axios';
import type { HotelResumen } from '../hotels.types';
import { parseHotelSearchParams } from '../hotelSearchParams';
import {
  FILTROS_INICIALES,
  filtrarHoteles,
  ordenarHoteles,
  type HotelFiltros,
  type OrdenHotel,
} from '../hotelFilters';
import { buscarHoteles } from '../services/hotelsService';

export const useHotelResults = () => {
  const [searchParams] = useSearchParams();
  const params = useMemo(() => parseHotelSearchParams(searchParams), [searchParams]);
  const [hoteles, setHoteles] = useState<HotelResumen[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<HotelFiltros>(FILTROS_INICIALES);
  const [orden, setOrden] = useState<OrdenHotel>('recomendados');

  useEffect(() => {
    let activo = true;
    // Reinicio del estado de carga al cambiar la busqueda (sincronizacion con sistema externo).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    setError(null);
    buscarHoteles(params)
      .then((data) => activo && setHoteles(data))
      .catch((err: unknown) => {
        if (!activo) return;
        const mensaje = axios.isAxiosError(err)
          ? (err.response?.data as { error?: string })?.error
          : undefined;
        setError(mensaje ?? 'No pudimos buscar hoteles. Probá de nuevo en unos minutos.');
      })
      .finally(() => activo && setIsLoading(false));
    return () => {
      activo = false;
    };
  }, [params]);

  const resultados = useMemo(
    () => ordenarHoteles(filtrarHoteles(hoteles, filtros), orden),
    [hoteles, filtros, orden],
  );

  return { params, hoteles, resultados, isLoading, error, filtros, setFiltros, orden, setOrden };
};
