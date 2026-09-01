import { createBrowserRouter } from 'react-router-dom';
import { HomePage } from '../features/flights/pages/HomePage';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { RegisterPage } from '../features/auth/pages/RegisterPage';
import { ReservationsPage } from '../features/bookings/pages/ReservationsPage';
import { SeatSelectionPage } from '../features/bookings/pages/SeatSelectionPage';
import { BookingLayout } from '../features/bookings/pages/BookingLayout';
import { MainLayout } from '../components/layout/MainLayout';
import { ResultsPage } from '../features/flights/pages/ResultsPage';
import { AdminLayout } from '../components/admin';
import { AdminDashboardPage } from '../features/admin/pages/AdminDashboardPage';

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
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboardPage /> },
      // Agreguen aca la ruta real del panel de administrador:
      // { path: 'usuarios', element: <UsersPage /> },
      // { path: 'vuelos', element: <FlightsManagementPage /> },
      // { path: 'reportes', element: <ReportsPage /> },
      // { path: 'reservas', element: <BookingsManagementPage /> },
      // { path: 'ajustes', element: <SettingsPage /> },
    ],
  },
]);
