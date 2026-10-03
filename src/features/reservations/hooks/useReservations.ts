import { useMemo } from 'react';
import { historyFlights } from '@/features/reservations/data/historyFlights';
import { useReservationsStore } from '@/features/reservations/store/useReservationsStore';

/**
 * Único punto de acceso de la interfaz a las reservas. Hoy lee datos de ejemplo
 * (data/ + store local); al conectar el backend solo cambia esta implementación.
 */
export const useReservations = () => {
  const { upcomingFlights, cancelledFlights, addUpcomingFlight, cancelFlight } =
    useReservationsStore();

  return {
    upcoming: upcomingFlights,
    history: historyFlights,
    cancelled: cancelledFlights,
    isLoading: false,
    error: null as string | null,
    addReservation: addUpcomingFlight,
    cancelReservation: cancelFlight,
  };
};

export const useReservation = (id: string | undefined) => {
  const { upcoming, history, cancelled } = useReservations();

  return useMemo(
    () =>
      id ? [...upcoming, ...history, ...cancelled].find((flight) => flight.id === id) : undefined,
    [id, upcoming, history, cancelled],
  );
};
