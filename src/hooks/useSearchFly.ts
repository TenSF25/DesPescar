import { useState } from 'react';
import { useAeropuerto } from './useAPI';
import type { Airport } from '../types/Interfaces';

/** Cómo se muestra un aeropuerto elegido en el campo: corto, y distingue Aeroparque de Ezeiza. */
export const etiquetaAeropuerto = (aero: Airport) => `${aero.city} (${aero.code})`;

/** Minúsculas y sin tildes, para que "cord" encuentre "Córdoba". */
const normalizar = (texto: string) =>
  texto
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();

const coincide = (aero: Airport, busqueda: string) =>
  [aero.name, aero.city, aero.country, aero.code].some((campo) =>
    normalizar(campo).includes(busqueda),
  );

/** Búsqueda previa con la que se precarga el formulario (códigos IATA, como viajan en la URL). */
export interface ValoresIniciales {
  origin?: string;
  destination?: string;
  passengers?: number;
}

/**
 * Estado de un campo de aeropuerto (origen o destino). Solo vale un aeropuerto elegido de la lista:
 * lo que se escribe sirve para filtrar y se descarta al salir del campo si no se eligió nada.
 * La elección vive en el padre para que cada campo pueda excluir la del otro.
 */
const useAirportField = (
  aeropuertos: Airport[],
  excluido: Airport | null,
  seleccionado: Airport | null,
  setEleccion: (aero: Airport | null) => void,
) => {
  // null = no se está escribiendo: el campo muestra el aeropuerto elegido (o queda vacío).
  const [escrito, setEscrito] = useState<string | null>(null);
  const [abierto, setAbierto] = useState(false);

  const texto = escrito ?? (seleccionado ? etiquetaAeropuerto(seleccionado) : '');
  // Sin escribir se muestran todas las opciones, no solo el aeropuerto ya elegido.
  const busqueda = escrito === null ? '' : normalizar(escrito.trim());
  const opciones = aeropuertos
    .filter((aero) => aero.code !== excluido?.code)
    .filter((aero) => coincide(aero, busqueda));

  return {
    texto,
    seleccionado,
    abierto,
    opciones,
    abrir: () => setAbierto(true),
    escribir: (valor: string) => {
      setEscrito(valor);
      setEleccion(null);
      setAbierto(true);
    },
    seleccionar: (aero: Airport) => {
      setEscrito(null);
      setEleccion(aero);
      setAbierto(false);
    },
    // Al salir del campo se cierra la lista y se descarta lo escrito que no se eligió.
    cerrar: () => {
      setAbierto(false);
      setEscrito(null);
    },
  };
};

export const useSearchFly = (iniciales?: ValoresIniciales) => {
  const { aeropuertos } = useAeropuerto();
  const [pasajeros, setPasajeros] = useState(iniciales?.passengers ?? 1);

  // undefined = el usuario todavía no tocó el campo: vale la búsqueda previa (cuando cargan los aeropuertos).
  const [origenEleccion, setOrigenEleccion] = useState<Airport | null | undefined>(undefined);
  const [destinoEleccion, setDestinoEleccion] = useState<Airport | null | undefined>(undefined);

  const resolver = (eleccion: Airport | null | undefined, code?: string) =>
    eleccion !== undefined
      ? eleccion
      : (aeropuertos.find((aero) => aero.code === code?.toUpperCase()) ?? null);
  const origenElegido = resolver(origenEleccion, iniciales?.origin);
  const destinoElegido = resolver(destinoEleccion, iniciales?.destination);

  // Cada campo excluye el aeropuerto elegido en el otro, para no armar un vuelo de A a A.
  const origen = useAirportField(aeropuertos, destinoElegido, origenElegido, setOrigenEleccion);
  const destino = useAirportField(aeropuertos, origenElegido, destinoElegido, setDestinoEleccion);

  return { origen, destino, pasajeros, setPasajeros };
};
