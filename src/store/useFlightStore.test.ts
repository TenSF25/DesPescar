import { beforeEach, describe, expect, it } from 'vitest';
import { useFlightStore } from './useFlightStore';

describe('useFlightStore', () => {
  beforeEach(() => {
    useFlightStore.getState().clearSearch();
  });

  it('setSelectedDepartureFare escribe la tarifa de ida sin tocar los vuelos', () => {
    useFlightStore.getState().setSelectedReturnFlight('vuelo-vuelta');
    useFlightStore.getState().setSelectedDepartureFare('tarifa-ida');
    const s = useFlightStore.getState();
    expect(s.selectedDepartureFare).toBe('tarifa-ida');
    expect(s.selectedReturnFlight).toBe('vuelo-vuelta');
  });

  it('setSelectedReturnFare escribe la tarifa de vuelta', () => {
    useFlightStore.getState().setSelectedReturnFare('tarifa-vuelta');
    const s = useFlightStore.getState();
    expect(s.selectedReturnFare).toBe('tarifa-vuelta');
    expect(s.selectedReturnFlight).toBeNull();
  });

  it('limpiarCompra olvida el carrito y los asientos pero conserva la búsqueda', () => {
    const s0 = useFlightStore.getState();
    s0.setSelectedDepartureFlight('vuelo-ida');
    s0.setSelectedDepartureFare('tarifa-ida');
    s0.setPassengers(2);
    s0.setBookingId(12);
    s0.setSelectedSeats(['asiento-1', 'asiento-2']);
    useFlightStore.getState().limpiarCompra();
    const s = useFlightStore.getState();
    expect(s.bookingId).toBeNull();
    expect(s.selectedSeats).toEqual([]);
    expect(s.selectedDepartureFlight).toBe('vuelo-ida');
    expect(s.selectedDepartureFare).toBe('tarifa-ida');
    expect(s.passengers).toBe(2);
  });

  it('elegir otro vuelo de ida descarta el carrito y los asientos anteriores', () => {
    useFlightStore.getState().setBookingId(12);
    useFlightStore.getState().setSelectedSeats(['asiento-1']);
    useFlightStore.getState().setSelectedDepartureFlight('otro-vuelo');
    const s = useFlightStore.getState();
    expect(s.bookingId).toBeNull();
    expect(s.selectedSeats).toEqual([]);
    expect('passengersAssignedBookingId' in s).toBe(false);
  });
});
