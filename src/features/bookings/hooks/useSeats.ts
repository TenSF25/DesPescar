import { useContext } from 'react';
import { SeatsContext } from '../context/seatsContext';

/** Estado compartido de la selección de asientos (debe usarse dentro de `SeatsProvider`). */
export const useSeats = () => {
  const seats = useContext(SeatsContext);
  if (!seats) throw new Error('useSeats debe usarse dentro de <SeatsProvider>.');
  return seats;
};
