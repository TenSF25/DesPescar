import { useState, useEffect, useRef } from 'react';
import { useAeropuerto } from './useAeropuerto';
import type { Aeropuerto } from '../types/Interfaces';

interface ValoresIniciales {
  origen?: Aeropuerto | null;
  destino?: Aeropuerto | null;
  fecha?: string;
  pasajeros?: number;
}

export const useSearchFly = (valoresIniciales?: ValoresIniciales) => {
  const { aeropuertos } = useAeropuerto();

  const contenedorOrigenRef = useRef<HTMLDivElement>(null);
  const contenedorDestinoRef = useRef<HTMLDivElement>(null);

  const [origenInput, setOrigen] = useState(valoresIniciales?.origen?.nombre ?? '');
  const [origenSelect, setOrigenSelect] = useState(Boolean(valoresIniciales?.origen));
  const [origenSeleccionado, setOrigenSeleccionado] = useState<Aeropuerto | null>(
    valoresIniciales?.origen ?? null,
  );

  const [destinoInput, setDestino] = useState(valoresIniciales?.destino?.nombre ?? '');
  const [destinoSelect, setDestinoSelect] = useState(Boolean(valoresIniciales?.destino));
  const [destinoSeleccionado, setDestinoSeleccionado] = useState<Aeropuerto | null>(
    valoresIniciales?.destino ?? null,
  );

  const [fecha, setFecha] = useState(valoresIniciales?.fecha ?? '');
  const [pasajeros, setPasajeros] = useState(valoresIniciales?.pasajeros ?? 1);

  const origen = aeropuertos.filter((aero) => {
    const busqueda = origenInput.toLowerCase();
    return (
      aero.nombre.toLocaleLowerCase().includes(busqueda) ||
      aero.ciudad.toLocaleLowerCase().includes(busqueda) ||
      aero.pais.toLocaleLowerCase().includes(busqueda) ||
      aero.codigo_iata.toLocaleLowerCase().includes(busqueda)
    );
  });

  const destino = aeropuertos.filter((aero) => {
    const busqueda = destinoInput.toLowerCase();
    return (
      aero.nombre.toLocaleLowerCase().includes(busqueda) ||
      aero.ciudad.toLocaleLowerCase().includes(busqueda) ||
      aero.pais.toLocaleLowerCase().includes(busqueda) ||
      aero.codigo_iata.toLocaleLowerCase().includes(busqueda)
    );
  });

  const seleccionarOrigen = (aero: Aeropuerto) => {
    setOrigen(aero.nombre);
    setOrigenSeleccionado(aero);
    setOrigenSelect(true);
  };

  const seleccionarDestino = (aero: Aeropuerto) => {
    setDestino(aero.nombre);
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
    return () => window.removeEventListener('mouseup', clickExterno);
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
    fecha,
    setFecha,
    pasajeros,
    setPasajeros,
    contenedorOrigenRef,
    contenedorDestinoRef,
  };
};
