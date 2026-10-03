import { useAuthStore } from '@/store/useAuthStore';
import { getHomeForRole } from '@/features/admin/roles';
import { Navigate, Outlet } from 'react-router';

export const PublicRoute = () => {
  const { user } = useAuthStore();

  if (user) {
    return <Navigate to={getHomeForRole(user.role)} replace />;
  }

  return <Outlet />;
};
