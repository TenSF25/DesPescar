import { useSyncExternalStore } from 'react';
import type { FlightReservation } from '@/features/reservations/reservations.types';
import { upcomingFlights as upcomingFlightsIniciales } from '@/features/reservations/data/upcomingFlights';
import { cancelledFlights as cancelledFlightsIniciales } from '@/features/reservations/data/cancelledFlights';

type Listener = () => void;

const COMPRADAS_KEY = 'despescar_purchased_flights';
const CANCELADAS_KEY = 'despescar_cancelled_flights';

/** Aeropuertos argentinos: la app solo maneja vuelos nacionales. */
const AEROPUERTOS_AR = new Set([
  'EZE',
  'AEP',
  'COR',
  'MDZ',
  'BRC',
  'IGR',
  'USH',
  'SLA',
  'FTE',
  'NQN',
  'ROS',
  'TUC',
  'MDQ',
]);

const esNacional = (f: FlightReservation) =>
  AEROPUERTOS_AR.has(f.origin.iata) && AEROPUERTOS_AR.has(f.destination.iata);

/** Lee lo guardado en localStorage y descarta reservas que no sean nacionales (datos viejos). */
const leer = (key: string): FlightReservation[] => {
  try {
    const guardadas: FlightReservation[] = JSON.parse(localStorage.getItem(key) ?? '[]');
    return guardadas.filter(esNacional);
  } catch {
    return [];
  }
};

const persistir = (key: string, flights: FlightReservation[]) => {
  try {
    localStorage.setItem(key, JSON.stringify(flights));
  } catch {
    // localStorage no disponible (modo privado, etc.)
  }
};

/** Vuelos comprados en la demo que siguen vigentes. */
let compradas = leer(COMPRADAS_KEY);
/** Vuelos (comprados o de ejemplo) que el usuario canceló. */
let canceladasPorUsuario = leer(CANCELADAS_KEY);

const idsCanceladosPorUsuario = () => new Set(canceladasPorUsuario.map((f) => f.id));

const calcularUpcoming = () =>
  [...compradas, ...upcomingFlightsIniciales].filter((f) => !idsCanceladosPorUsuario().has(f.id));
const calcularCancelled = () => [...canceladasPorUsuario, ...cancelledFlightsIniciales];

let upcomingFlights: FlightReservation[] = calcularUpcoming();
let cancelledFlights: FlightReservation[] = calcularCancelled();
const listeners = new Set<Listener>();

const emit = () => listeners.forEach((listener) => listener());

/** Store mínimo tipo store externo, sin dependencias nuevas, para reflejar reservas en runtime. */
export const reservationsStore = {
  addUpcomingFlight: (flight: FlightReservation) => {
    if (upcomingFlights.some((f) => f.id === flight.id)) return;
    compradas = [flight, ...compradas];
    persistir(COMPRADAS_KEY, compradas);
    upcomingFlights = calcularUpcoming();
    emit();
  },
  cancelFlight: (id: string) => {
    const flight = upcomingFlights.find((f) => f.id === id);
    if (!flight) return;
    compradas = compradas.filter((f) => f.id !== id);
    canceladasPorUsuario = [{ ...flight, status: 'cancelled' }, ...canceladasPorUsuario];
    persistir(COMPRADAS_KEY, compradas);
    persistir(CANCELADAS_KEY, canceladasPorUsuario);
    upcomingFlights = calcularUpcoming();
    cancelledFlights = calcularCancelled();
    emit();
  },
  getSnapshot: () => upcomingFlights,
  getCancelledSnapshot: () => cancelledFlights,
  subscribe: (listener: Listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

export const useReservationsStore = () => {
  const flights = useSyncExternalStore(reservationsStore.subscribe, reservationsStore.getSnapshot);
  const cancelled = useSyncExternalStore(
    reservationsStore.subscribe,
    reservationsStore.getCancelledSnapshot,
  );

  return {
    upcomingFlights: flights,
    cancelledFlights: cancelled,
    addUpcomingFlight: reservationsStore.addUpcomingFlight,
    cancelFlight: reservationsStore.cancelFlight,
  };
};
