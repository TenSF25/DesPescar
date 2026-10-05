import type { ReactNode } from 'react';
import { useSeatsState } from '../hooks/useSeatsState';
import { SeatsContext } from './seatsContext';

/**
 * Crea una única instancia del estado de asientos para toda la pantalla. Antes cada asiento del avión
 * (unos 180) llamaba al hook por su cuenta: cientos de pedidos y de conexiones WebSocket por página.
 */
export const SeatsProvider = ({ children }: { children: ReactNode }) => {
  const seats = useSeatsState();
  return <SeatsContext.Provider value={seats}>{children}</SeatsContext.Provider>;
};
