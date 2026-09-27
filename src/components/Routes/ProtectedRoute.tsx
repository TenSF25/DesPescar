import { useAuthStore } from '@/store/useAuthStore';
import { Navigate, Outlet } from 'react-router';

export const ProtectedRoute = () => {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to={'/login'} state={{ from: location }} replace />;
  }

  return <Outlet />;
};
