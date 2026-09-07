import { createBrowserRouter } from 'react-router-dom';
import { HomePage } from '../features/flights/pages/HomePage';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { RegisterPage } from '../features/auth/pages/RegisterPage';
import { ReservationsPage } from '../features/bookings/pages/ReservationsPage';
import { SeatSelectionPage } from '../features/bookings/pages/SeatSelectionPage';
import { BookingLayout } from '../features/bookings/pages/BookingLayout';
import { MainLayout } from '../components/layout/MainLayout';
import { ResultsPage } from '../features/flights/pages/ResultsPage';
import { RequireRole } from '../features/auth/components/RequireRole';
import { AdminLayout } from '../components/admin';
import { AdminDashboardPage } from '../features/admin/pages/AdminDashboardPage';
import { UsersPage } from '../features/admin/pages/UsersPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
      {
        path: '/results',
        element: <ResultsPage />,
      },
      {
        path: '/booking',
        element: <BookingLayout />,
        children: [
          {
            path: 'reservation',
            element: <ReservationsPage />,
          },
          {
            path: 'seats',
            element: <SeatSelectionPage />,
          },
        ],
      },
    ],
  },
  {
    path: '/admin',
    element: (
      <RequireRole allow={['GENERAL_ADMIN']}>
        <AdminLayout />
      </RequireRole>
    ),
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: 'usuarios', element: <UsersPage /> },
      // Agreguen acá el resto de rutas del admin general:
      // { path: 'reportes', element: <ReportsPage /> },
      // { path: 'ajustes', element: <SettingsPage /> },
    ],
  },
]);
