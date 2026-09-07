import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import type { RolId } from '../auth.types';

interface RequireRoleProps {
  allow: RolId[];
  children: ReactNode;
}

/**
 * Deja pasar solo si hay un usuario logueado y su rol está en `allow`.
 * Si no, redirige a /login. Envuelve al layout de cada dashboard
 * (ej: <RequireRole allow={['GENERAL_ADMIN']}><AdminLayout /></RequireRole>).
 */
export const RequireRole = ({ allow, children }: RequireRoleProps) => {
  const { user } = useAuthStore();

  if (!user || !allow.includes(user.rolId)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
