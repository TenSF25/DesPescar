import { useAuthStore } from '@/store/useAuthStore';
import { getHomeForRole } from '@/features/admin/roles';
import { Navigate, Outlet } from 'react-router';

interface ProtectedRouteProps {
  /** Roles que pueden entrar. Si se omite, alcanza con estar logueado. */
  allow?: string[];
}

export const ProtectedRoute = ({ allow }: ProtectedRouteProps) => {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to={'/login'} state={{ from: location }} replace />;
  }

  if (allow && !allow.includes(user.role)) {
    return <Navigate to={getHomeForRole(user.role)} replace />;
  }

  return <Outlet />;
};
