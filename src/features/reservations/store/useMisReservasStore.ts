import { create } from 'zustand';
import { leerErrorApi } from '@/features/cart/carrito';
import type { FlightById } from '@/features/flights/flights.types';
import { bookingToReservation } from '../bookingToReservation';
import type { FlightReservation } from '../reservations.types';
import { listarMisReservas, obtenerVuelo } from '../services/reservationsService';

interface MisReservasState {
  reservas: FlightReservation[];
  /** De quién son las reservas guardadas: otra cuenta no las ve mientras se cargan las suyas. */
  usuarioId: number | null;
  cargado: boolean;
  cargando: boolean;
  error: string | null;
  cargar: (usuarioId: number) => Promise<void>;
}

/** Los vuelos no cambian de aeropuertos ni horarios entre una carga y otra. */
const vuelos = new Map<string, FlightById>();
let enCurso: { usuarioId: number; promesa: Promise<void> } | null = null;

const leerVuelo = async (id: string): Promise<FlightById | undefined> => {
  const guardado = vuelos.get(id);
  if (guardado) return guardado;
  try {
    const vuelo = await obtenerVuelo(id);
    vuelos.set(id, vuelo);
    return vuelo;
  } catch {
    // La tarjeta se arma igual con la salida guardada en la reserva.
    return undefined;
  }
};

export const useMisReservasStore = create<MisReservasState>((set, get) => ({
  reservas: [],
  usuarioId: null,
  cargado: false,
  cargando: false,
  error: null,
  cargar: (usuarioId) => {
    if (enCurso?.usuarioId === usuarioId) return enCurso.promesa;
    const otraCuenta = get().usuarioId !== usuarioId;
    set({
      cargando: true,
      error: null,
      usuarioId,
      ...(otraCuenta ? { reservas: [], cargado: false } : {}),
    });
    const promesa = (async () => {
      try {
        const lista = await listarMisReservas();
        const reservas = await Promise.all(
          lista.map(async (reserva) =>
            bookingToReservation(
              reserva,
              await Promise.all((reserva.vuelo?.flightIds ?? []).map(leerVuelo)),
              new Date(),
            ),
          ),
        );
        if (get().usuarioId === usuarioId) set({ reservas, cargado: true });
      } catch (err) {
        if (get().usuarioId === usuarioId) {
          set({
            error: leerErrorApi(err, 'No pudimos cargar tus reservas. Probá de nuevo.').mensaje,
          });
        }
      } finally {
        if (enCurso?.usuarioId === usuarioId) enCurso = null;
        if (get().usuarioId === usuarioId) set({ cargando: false });
      }
    })();
    enCurso = { usuarioId, promesa };
    return promesa;
  },
}));
