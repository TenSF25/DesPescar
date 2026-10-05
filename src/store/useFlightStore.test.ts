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
});
