import { useState, useEffect } from 'react';
import type { Airport, RutaBuscada } from '../types/Interfaces';
import type { MetadataSearch, Flight, FlightById } from '@/features/flights/flights.types';
import { api, gatewayBaseUrl } from '@/config/api';

export const useAeropuerto = () => {
  const [aeropuertos, setAero] = useState<Airport[]>([]);

  useEffect(() => {
    const fetchAeropuertos = async () => {
      try {
        const res = await api.get(`${gatewayBaseUrl}/api/airports`);
        setAero(res.data);
      } catch {
        console.error('ERROR');
      }
    };

    fetchAeropuertos();
  }, []);

  return {
    aeropuertos,
  };
};

export const useVuelos = (filtros?: RutaBuscada) => {
  const [departureFlights, setDepartureFlights] = useState<Flight[]>([]);
  const [returnFlights, setReturnFlights] = useState<Flight[]>([]);
  const [metadatos, setMetadatos] = useState<MetadataSearch | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const tieneFiltrosNecesarios = Boolean(
      filtros?.origin && filtros.destination && filtros.departureDate && filtros.passengers,
    );

    if (!tieneFiltrosNecesarios) {
      return;
    }

    let activo = true;

    const fetchVuelos = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          origin: (filtros?.origin ?? '').toUpperCase(),
          destination: (filtros?.destination ?? '').toUpperCase(),
          departureDate: filtros?.departureDate ?? '',
          ...(filtros?.returnDate && { returnDate: filtros.returnDate }),
          passengers: String(filtros?.passengers ?? 1),
        });

        const res = await api.get(`${gatewayBaseUrl}/api/flights/search?${params.toString()}`);
        if (!activo) return;
        setDepartureFlights(res.data.departureFlights || []);
        setReturnFlights(res.data.returnFlights || []);
        setMetadatos(res.data.metadata || null);
      } catch {
        if (!activo) return;
        console.log('ERROR');
        setError('Ocurrió un error al buscar los vuelos');
        setDepartureFlights([]);
      } finally {
        if (activo) setIsLoading(false);
      }
    };

    fetchVuelos();

    return () => {
      activo = false;
    };
  }, [
    filtros?.origin,
    filtros?.destination,
    filtros?.departureDate,
    filtros?.returnDate,
    filtros?.passengers,
  ]);

  return { departureFlights, returnFlights, metadatos, isLoading, error };
};

export const useFlightId = (id: string) => {
  const [flightById, setFlightById] = useState<FlightById>();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    let activo = true;

    const fetchFlightById = async () => {
      setIsLoading(true);
      setError('');

      try {
        const res = await api.get(`${gatewayBaseUrl}/api/flights/${id}`);
        if (activo) setFlightById(res.data);
      } catch {
        if (activo) setError('Ocurrio un error al buscar el vuelo por ID.');
      } finally {
        if (activo) setIsLoading(false);
      }
    };

    fetchFlightById();

    return () => {
      activo = false;
    };
  }, [id]);

  return {
    flightById: id ? flightById : undefined,
    error: id ? error : '',
    isLoading: id ? isLoading : false,
  };
};

export const useSearchAirportByCode = (code: string) => {
  const [airport, setAirport] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAirport = async () => {
      try {
        setIsLoading(true);
        const res = await api.get(`${gatewayBaseUrl}/api/airports/code/${code}`);
        setAirport(res.data);
      } catch {
        console.warn('ERROR');
        setError('Ocurrio un error al tratar de buscar el Aeropuerto.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAirport();
  });

  return {
    airport,
    isLoading,
    error,
  };
};
