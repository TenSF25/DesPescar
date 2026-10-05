import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FlightStoreDate {
  reservationId: number | null;
  selectedDepartureFlight: string | null;
  selectedReturnFlight: string | null;
  selectedDepartureFare: string | null;
  selectedReturnFare: string | null;
  passengers: number | null;
  /** UUIDs de los asientos de ida bloqueados por el usuario, en orden de pasajero. */
  selectedSeats: string[];
  setReservationId: (id: number | null) => void;
  setSelectedDepartureFlight: (flightId: string | null) => void;
  setSelectedReturnFlight: (flightId: string | null) => void;
  setSelectedDepartureFare: (fare: string | null) => void;
  setSelectedReturnFare: (fare: string | null) => void;
  setPassengers: (passengers: number | null) => void;
  setSelectedSeats: (seatIds: string[]) => void;
  /** El vuelo salió del carrito (se quitó, se pagó o venció) o se cerró sesión: olvida los asientos. */
  limpiarCompra: () => void;
  clearSearch: () => void;
}

export const useFlightStore = create<FlightStoreDate>()(
  persist(
    (set) => ({
      reservationId: null,
      selectedDepartureFlight: null,
      selectedReturnFlight: null,
      selectedDepartureFare: null,
      selectedReturnFare: null,
      passengers: null,
      selectedSeats: [],
      setReservationId: (id: number | null) => set({ reservationId: id }),
      setSelectedDepartureFlight: (flight) =>
        set({
          selectedDepartureFlight: flight,
          selectedSeats: [],
        }),
      setSelectedReturnFlight: (flight) => set({ selectedReturnFlight: flight }),
      setSelectedDepartureFare: (fare) => set({ selectedDepartureFare: fare }),
      setSelectedReturnFare: (fare) => set({ selectedReturnFare: fare }),
      setPassengers: (passengers) =>
        set({
          passengers: passengers,
        }),
      setSelectedSeats: (seatIds) => set({ selectedSeats: seatIds }),
      limpiarCompra: () => set({ selectedSeats: [] }),
      clearSearch: () =>
        set({
          selectedDepartureFlight: null,
          selectedReturnFlight: null,
          selectedDepartureFare: null,
          selectedReturnFare: null,
          passengers: null,
          selectedSeats: [],
        }),
    }),
    {
      name: 'despescar-flights',
    },
  ),
);
