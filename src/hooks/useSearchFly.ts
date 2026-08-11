import { useState, useEffect, useRef } from 'react';
import { useAeropuerto } from './useAeropuerto';

export const useSearchFly = () => {
  const { aeropuertos } = useAeropuerto();

  const contenedorOrigenRef = useRef<HTMLDivElement>(null);
  const contenedorDestinoRef = useRef<HTMLDivElement>(null);

  const [origenInput, setOrigen] = useState('');
  const [origenSelect, setOrigenSelect] = useState(false);

  const [destinoInput, setDestino] = useState('');
  const [destinoSelect, setDestinoSelect] = useState(false);

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
    contenedorOrigenRef,
    contenedorDestinoRef,
  };
};
