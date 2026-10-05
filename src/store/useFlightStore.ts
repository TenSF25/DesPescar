import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FlightStoreDate {
  selectedDepartureFlight: string | null;
  selectedReturnFlight: string | null;
  selectedDepartureFare: string | null;
  selectedReturnFare: string | null;
  passengers: number | null;
  /** Id del carrito al que entró el vuelo (POST /init). */
  bookingId: number | null;
  /** UUIDs de los asientos de ida bloqueados por el usuario, en orden de pasajero. */
  selectedSeats: string[];
  setSelectedDepartureFlight: (flightId: string | null) => void;
  setSelectedReturnFlight: (flightId: string | null) => void;
  setSelectedDepartureFare: (fare: string | null) => void;
  setSelectedReturnFare: (fare: string | null) => void;
  setPassengers: (passengers: number | null) => void;
  setBookingId: (bookingId: number | null) => void;
  setSelectedSeats: (seatIds: string[]) => void;
  /** El vuelo salió del carrito (se quitó o se pagó): olvida el carrito y los asientos. */
  limpiarCompra: () => void;
  clearSearch: () => void;
}

export const useFlightStore = create<FlightStoreDate>()(
  persist(
    (set) => ({
      selectedDepartureFlight: null,
      selectedReturnFlight: null,
      selectedDepartureFare: null,
      selectedReturnFare: null,
      passengers: null,
      bookingId: null,
      selectedSeats: [],
      setSelectedDepartureFlight: (flight) =>
        set({
          selectedDepartureFlight: flight,
          bookingId: null,
          selectedSeats: [],
        }),
      setSelectedReturnFlight: (flight) => set({ selectedReturnFlight: flight }),
      setSelectedDepartureFare: (fare) => set({ selectedDepartureFare: fare }),
      setSelectedReturnFare: (fare) => set({ selectedReturnFare: fare }),
      setPassengers: (passengers) =>
        set({
          passengers: passengers,
        }),
      setBookingId: (bookingId) => set({ bookingId }),
      setSelectedSeats: (seatIds) => set({ selectedSeats: seatIds }),
      limpiarCompra: () => set({ bookingId: null, selectedSeats: [] }),
      clearSearch: () =>
        set({
          selectedDepartureFlight: null,
          selectedReturnFlight: null,
          selectedDepartureFare: null,
          selectedReturnFare: null,
          passengers: null,
          bookingId: null,
          selectedSeats: [],
        }),
    }),
    {
      name: 'despescar-flights',
    },
  ),
);
