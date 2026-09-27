import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState, TokenData, User } from '@/types/Interfaces';

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
      logout: () =>
        set({
          tokens: null,
          user: null,
        }),
    }),
    {
      name: 'despescar-auth',
    },
  ),
);
