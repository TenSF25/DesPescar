import { getHomeForRole } from '@/features/admin/roles';

interface FromLocation {
  pathname?: string;
  search?: string;
  hash?: string;
}

/**
 * Ruta a la que ir tras iniciar sesion: la pagina protegida que el usuario intentaba abrir
 * (guardada por ProtectedRoute en location.state.from) o, si no hay, el inicio de su rol.
 */
export const getPostLoginPath = (state: unknown, role: string): string => {
  const from = (state as { from?: FromLocation } | null)?.from;

  if (from?.pathname?.startsWith('/')) {
    return `${from.pathname}${from.search ?? ''}${from.hash ?? ''}`;
  }

  return getHomeForRole(role);
};
