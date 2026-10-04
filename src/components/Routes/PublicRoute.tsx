import { useAuthStore } from '@/store/useAuthStore';
import { getPostLoginPath } from '@/features/auth/postLoginPath';
import { Navigate, Outlet, useLocation } from 'react-router';

export const PublicRoute = () => {
  const { user } = useAuthStore();
  const location = useLocation();

  if (user) {
    return <Navigate to={getPostLoginPath(location.state, user.role)} replace />;
  }

  return <Outlet />;
};
