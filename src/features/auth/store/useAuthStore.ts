import { useSyncExternalStore } from 'react';
import type { AuthResponse } from '../auth.types';

/**
 * Store de autenticación mínimo, sin librerías externas (no hay zustand
 * instalado en este kit). Usa useSyncExternalStore para que cualquier
 * componente que lea useAuthStore() se re-renderice cuando cambia el user.
 *
 * Persiste en localStorage para no perder la sesión al recargar la página
 * mientras se prueba el dashboard.
 */

const STORAGE_KEY = 'despescar_auth_user';

type Listener = () => void;

const listeners = new Set<Listener>();

function readFromStorage(): AuthResponse | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthResponse) : null;
  } catch {
    return null;
  }
}

let currentUser: AuthResponse | null = readFromStorage();

function emitChange() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return currentUser;
}

/** Guarda el usuario autenticado (o null para cerrar sesión). */
export function setAuthUser(user: AuthResponse | null) {
  currentUser = user;
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
  emitChange();
}

export function useAuthStore() {
  const user = useSyncExternalStore(subscribe, getSnapshot);

  return {
    user,
    isAuthenticated: user !== null,
    login: setAuthUser,
    logout: () => setAuthUser(null),
  };
}
