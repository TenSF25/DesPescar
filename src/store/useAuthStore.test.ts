import { describe, expect, it } from 'vitest';
import { useAuthStore } from './useAuthStore';
import { useFlightStore } from './useFlightStore';

describe('useAuthStore', () => {
  it('cerrar sesión olvida los asientos elegidos para que no los vea otra cuenta', () => {
    useFlightStore.setState({ selectedDepartureFlight: 'vuelo-ida', selectedSeats: ['asiento-1'] });
    useAuthStore.getState().logout();
    const s = useFlightStore.getState();
    expect(s.selectedSeats).toEqual([]);
    expect(s.selectedDepartureFlight).toBe('vuelo-ida');
    expect(useAuthStore.getState().user).toBeNull();
  });
});
