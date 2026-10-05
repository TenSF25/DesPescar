import { createContext } from 'react';
import type { useSeatsState } from '../hooks/useSeatsState';

export type SeatsState = ReturnType<typeof useSeatsState>;

export const SeatsContext = createContext<SeatsState | null>(null);
