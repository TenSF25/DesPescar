import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState, TokenData, User } from '@/types/Interfaces';
import { useFlightStore } from './useFlightStore';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      tokens: null,
      user: null,
      login: (tokensData: TokenData, userData: User) =>
        set({
          tokens: tokensData,
          user: userData,
        }),
      logout: () => {
        // Los asientos bloqueados son de esta cuenta: no deben quedar para la próxima sesión.
        useFlightStore.getState().limpiarCompra();
        set({
          tokens: null,
          user: null,
        });
      },
    }),
    {
      name: 'despescar-auth',
    },
  ),
);
