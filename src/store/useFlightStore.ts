import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FlightStoreDate {
  selectedDepartureFlight: string | null;
  selectedReturnFlight: string | null;
  selectedDepartureFare: string | null;
  selectedReturnFare: string | null;
  passengers: number | null;
  bookingId: number | null;
  selectedSeats: string[];
  passengersAssignedBookingId: number | null;
  setSelectedDepartureFlight: (flightId: string | null) => void;
  setSelectedReturnFlight: (flightId: string | null) => void;
  setSelectedDepartureFare: (fare: string | null) => void;
  setSelectedReturnFare: (fare: string | null) => void;
  setPassengers: (passengers: number | null) => void;
  setBookingId: (bookingId: number | null) => void;
  setSelectedSeats: (seatIds: string[]) => void;
  setPassengersAssignedBookingId: (bookingId: number | null) => void;
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
      passengersAssignedBookingId: null,
      setSelectedDepartureFlight: (flight) =>
        set({
          selectedDepartureFlight: flight,
          bookingId: null,
          selectedSeats: [],
          passengersAssignedBookingId: null,
        }),
      setSelectedReturnFlight: (flight) => set({ selectedReturnFlight: flight }),
      setSelectedDepartureFare: (fare) => set({ selectedReturnFlight: fare }),
      setSelectedReturnFare: (fare) => set({ selectedReturnFlight: fare }),
      setPassengers: (passengers) =>
        set({
          passengers: passengers,
        }),
      setBookingId: (bookingId) => set({ bookingId, passengersAssignedBookingId: null }),
      setSelectedSeats: (seatIds) => set({ selectedSeats: seatIds }),
      setPassengersAssignedBookingId: (bookingId) => set({ passengersAssignedBookingId: bookingId }),
      clearSearch: () =>
        set({
          selectedDepartureFlight: null,
          selectedReturnFlight: null,
          selectedDepartureFare: null,
          selectedReturnFare: null,
          passengers: null,
          bookingId: null,
          selectedSeats: [],
          passengersAssignedBookingId: null,
        }),
    }),
    {
      name: 'despescar-flights',
    },
  ),
);
