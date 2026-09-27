import { useState, useEffect, useRef } from 'react';
import { useAeropuerto } from './useAPI';
import type { Airport } from '../types/Interfaces';
import type { SearchProps } from '../types/Interfaces';

export const useSearchFly = (valoresIniciales?: SearchProps) => {
  const { aeropuertos } = useAeropuerto();

  const contenedorOrigenRef = useRef<HTMLDivElement>(null);
  const contenedorDestinoRef = useRef<HTMLDivElement>(null);

  const [origenInput, setOrigen] = useState(valoresIniciales?.origen?.name ?? '');
  const [origenSelect, setOrigenSelect] = useState(Boolean(valoresIniciales?.origen));
  const [origenSeleccionado, setOrigenSeleccionado] = useState<Airport | null>(
    valoresIniciales?.origen ?? null,
  );

  const [destinoInput, setDestino] = useState(valoresIniciales?.destino?.name ?? '');
  const [destinoSelect, setDestinoSelect] = useState(Boolean(valoresIniciales?.destino));
  const [destinoSeleccionado, setDestinoSeleccionado] = useState<Airport | null>(
    valoresIniciales?.destino ?? null,
  );

  const origen = aeropuertos
    .filter((aero) => !destinoSeleccionado || aero.code !== destinoSeleccionado.code)
    .filter((aero) => {
      const busqueda = origenInput.toLowerCase();
      return (
        aero.name.toLowerCase().includes(busqueda) ||
        aero.city.toLowerCase().includes(busqueda) ||
        aero.country.toLowerCase().includes(busqueda) ||
        aero.code.toLowerCase().includes(busqueda)
      );
    });

  const destino = aeropuertos
    .filter((aero) => !origenSeleccionado || aero.code !== origenSeleccionado.code)
    .filter((aero) => {
      const busqueda = destinoInput.toLowerCase();
      return (
        aero.name.toLowerCase().includes(busqueda) ||
        aero.city.toLowerCase().includes(busqueda) ||
        aero.country.toLowerCase().includes(busqueda) ||
        aero.code.toLowerCase().includes(busqueda)
      );
    });
  const [pasajeros, setPasajeros] = useState(valoresIniciales?.pasajeros ?? 1);

  const seleccionarOrigen = (aero: Airport) => {
    if (destinoSeleccionado && aero.code === destinoSeleccionado.code) {
      setDestino('');
      setDestinoSeleccionado(null);
    }
    setOrigen(aero.name);
    setOrigenSeleccionado(aero);
    setOrigenSelect(true);
  };

  const seleccionarDestino = (aero: Airport) => {
    if (origenSeleccionado && aero.code === origenSeleccionado.code) {
      setOrigen('');
      setOrigenSeleccionado(null);
    }
    setDestino(aero.name);
    setDestinoSeleccionado(aero);
    setDestinoSelect(true);
  };

  useEffect(() => {
    const clickExterno = (e: MouseEvent) => {
      if (contenedorOrigenRef.current && !contenedorOrigenRef.current.contains(e.target as Node)) {
        setOrigenSelect(true);
      }
      if (
        contenedorDestinoRef.current &&
        !contenedorDestinoRef.current.contains(e.target as Node)
      ) {
        setDestinoSelect(true);
      }
    };

    window.addEventListener('mousedown', clickExterno);
    return () => window.removeEventListener('mousedown', clickExterno);
  }, [setDestinoSelect, setOrigenSelect]);

  return {
    origen,
    destino,
    setDestino,
    setDestinoSelect,
    setOrigen,
    setOrigenSelect,
    origenSelect,
    origenInput,
    destinoSelect,
    destinoInput,
    origenSeleccionado,
    destinoSeleccionado,
    seleccionarOrigen,
    seleccionarDestino,
    setPasajeros,
    pasajeros,
    contenedorOrigenRef,
    contenedorDestinoRef,
  };
};
