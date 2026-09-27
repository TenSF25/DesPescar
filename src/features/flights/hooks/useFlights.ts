import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { useVuelos } from '@/hooks/useAPI'; // Tu hook que hace el fetch al backend
import type { FiltroEscala, Flight } from '../flights.types';
// Ajustá la importación del tipo de tu DTO si es necesario
// import type { DetailedFlightResponseDto } from '../flights.types';

export type Orden = 'mejor' | 'precio_asc' | 'precio_desc' | 'duracion';
export type EquipajeFiltro = 'Todos' | 'mano' | 'bodega';

export const useFlights = () => {
  const [escalaFiltro, setEscalaFiltro] = useState<FiltroEscala>('Todos');
  const [aerolineasFiltro, setAerolineasFiltro] = useState<string[]>([]);
  const [equipajeFiltro, setEquipajeFiltro] = useState<EquipajeFiltro>('Todos');
  const [horarioMin, setHorarioMin] = useState(0);
  const [horarioMax, setHorarioMax] = useState(1439);
  const [orden, setOrden] = useState<Orden>('mejor');

  const [searchParams] = useSearchParams();
  const origin = searchParams.get('origin') || 'EZE';
  const destination = searchParams.get('destination') || 'MAD';
  const departureDate = searchParams.get('departureDate') || '';
  const returnDate = searchParams.get('returnDate') || '';
  const passengers = Number(searchParams.get('passengers')) || 1;

  const formatDepartureDate = useMemo(() => {
    if (!departureDate) return '';
    const fechaObj = new Date(departureDate);
    if (isNaN(fechaObj.getTime())) return '';
    return fechaObj.toISOString().split('T')[0];
  }, [departureDate]);

  const formatReturnDate = useMemo(() => {
    if (!returnDate) return '';
    const fechaObj = new Date(returnDate);
    if (isNaN(fechaObj.getTime())) return '';
    return fechaObj.toISOString().split('T')[0];
  }, [returnDate]);

  const ruta = useMemo(
    () => ({
      origin,
      destination,
      departureDate,
      returnDate,
      passengers,
    }),
    [origin, destination, departureDate, returnDate, passengers],
  );

  const {
    departureFlights = [],
    returnFlights = [],
    metadatos,
    isLoading,
    error,
  } = useVuelos(ruta);

  const extraerAerolineas = (listaVuelos: Flight[]) => {
    const mapa = new Map<string, number>();
    listaVuelos.forEach((v) => {
      const nombre = v.airline.name;
      const precio = v.price.transparentFinalPrice;
      const actual = mapa.get(nombre);
      if (actual === undefined || precio < actual) {
        mapa.set(nombre, precio);
      }
    });

    return Array.from(mapa.entries())
      .map(([nombre, precioDesde]) => ({ nombre, precioDesde }))
      .sort((a, b) => a.nombre.localeCompare(b.nombre));
  };

  const aerolineasIda = useMemo(() => extraerAerolineas(departureFlights), [departureFlights]);
  const aerolineasVuelta = useMemo(() => extraerAerolineas(returnFlights), [returnFlights]);

  const toggleAerolinea = (nombre: string) => {
    setAerolineasFiltro((prev) =>
      prev.includes(nombre) ? prev.filter((a) => a !== nombre) : [...prev, nombre],
    );
  };

  const aplicarFiltrosYOrden = useCallback(
    (listaOriginal: Flight[]) => {
      let lista = [...listaOriginal];

      if (escalaFiltro !== 'Todos') {
        if (escalaFiltro === 'Directo') {
          lista = lista.filter((v) => v.itinerary.flightType === 'DIRECTO');
        } else if (escalaFiltro === '1 escala') {
          lista = lista.filter(
            (v) =>
              v.itinerary.flightType === 'CON_ESCALA' &&
              Array.isArray(v.scales) &&
              v.scales.length === 1,
          );
        } else if (escalaFiltro === '2 escalas') {
          lista = lista.filter(
            (v) =>
              v.itinerary.flightType === 'CON_ESCALA' &&
              Array.isArray(v.scales) &&
              v.scales.length === 2,
          );
        }
      }

      if (aerolineasFiltro.length > 0) {
        lista = lista.filter((v) => aerolineasFiltro.includes(v.airline.name));
      }

      if (equipajeFiltro === 'mano') {
        lista = lista.filter((v) => v.includedServices.carryOn);
      } else if (equipajeFiltro === 'bodega') {
        lista = lista.filter((v) => v.includedServices.checkedBaggage);
      }

      lista = lista.filter((v) => {
        const fechaObj = new Date(v.itinerary.departure.dateTime);
        const minutosDesdeMedianoche = fechaObj.getHours() * 60 + fechaObj.getMinutes();
        return minutosDesdeMedianoche >= horarioMin && minutosDesdeMedianoche <= horarioMax;
      });

      return lista.sort((a, b) => {
        switch (orden) {
          case 'precio_desc':
            return b.price.transparentFinalPrice - a.price.transparentFinalPrice;
          case 'duracion':
            return a.itinerary.durationMinutes - b.itinerary.durationMinutes;
          case 'precio_asc':
          case 'mejor':
          default:
            return a.price.transparentFinalPrice - b.price.transparentFinalPrice;
        }
      });
    },
    [escalaFiltro, aerolineasFiltro, equipajeFiltro, horarioMin, horarioMax, orden],
  );

  const vuelosIdaFiltrados = useMemo(
    () => aplicarFiltrosYOrden(departureFlights),
    [aplicarFiltrosYOrden, departureFlights],
  );

  const vuelosVueltaFiltrados = useMemo(
    () => aplicarFiltrosYOrden(returnFlights),
    [aplicarFiltrosYOrden, returnFlights],
  );

  return {
    isLoading,
    error,
    origin,
    destination,
    metadatos,
    aerolineasIda,
    aerolineasVuelta,
    vuelosIdaFiltrados,
    vuelosVueltaFiltrados,
    escalaFiltro,
    setEscalaFiltro,
    aerolineasFiltro,
    toggleAerolinea,
    equipajeFiltro,
    setEquipajeFiltro,
    horarioMin,
    horarioMax,
    setHorarioMin,
    setHorarioMax,
    orden,
    setOrden,
    formatDepartureDate,
    formatReturnDate,
  };
};
