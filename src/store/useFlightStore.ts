import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FlightStoreDate {
  selectedDepartureFlight: string | null;
  selectedReturnFlight: string | null;
  selectedDepartureFare: string | null;
  selectedReturnFare: string | null;
  passengers: number | null;
  setSelectedDepartureFlight: (flightId: string | null) => void;
  setSelectedReturnFlight: (flightId: string | null) => void;
  setSelectedDepartureFare: (fare: string | null) => void;
  setSelectedReturnFare: (fare: string | null) => void;
  setPassengers: (passengers: number | null) => void;
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
      setSelectedDepartureFlight: (flight) => set({ selectedDepartureFlight: flight }),
      setSelectedReturnFlight: (flight) => set({ selectedReturnFlight: flight }),
      setSelectedDepartureFare: (fare) => set({ selectedReturnFlight: fare }),
      setSelectedReturnFare: (fare) => set({ selectedReturnFlight: fare }),
      setPassengers: (passengers) =>
        set({
          passengers: passengers,
        }),
      clearSearch: () =>
        set({
          selectedDepartureFlight: null,
          selectedReturnFlight: null,
          selectedDepartureFare: null,
          selectedReturnFare: null,
          passengers: null,
        }),
    }),
    {
      name: 'despescar-flights',
    },
  ),
);
