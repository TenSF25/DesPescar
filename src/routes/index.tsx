import { createBrowserRouter, Navigate } from 'react-router-dom';
import { HomePage } from '../features/flights/pages/HomePage';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { RegisterPage } from '../features/auth/pages/RegisterPage';
import { ReservationsPage } from '../features/bookings/pages/ReservationsPage';
import { SeatSelectionPage } from '../features/bookings/pages/SeatSelectionPage';
import { BookingLayout } from '../features/bookings/pages/BookingLayout';
import { MainLayout } from '../components/layout/MainLayout';
import { ResultsPage } from '../features/flights/pages/ResultsPage';
import { AdminLayout } from '../components/admin';
import { UsersPage } from '../features/admin-airline/users/pages/UsersPage';
import { FlightsManagementPage } from '../features/admin-airline/flights/pages/FlightsManagementPage';
import { BookingsManagementPage } from '../features/admin-airline/bookings/pages/BookingsManagementPage';
import { ReportsPage } from '../features/admin-airline/reports/pages/ReportsPage';

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
      // "Dashboard" es solo un título de sección en el sidebar (no una
      // página), por eso /admin redirige a la primera sección real.
      { index: true, element: <Navigate to="/admin/usuarios" replace /> },
      { path: 'usuarios', element: <UsersPage /> },
      { path: 'vuelos', element: <FlightsManagementPage /> },
      { path: 'reservas', element: <BookingsManagementPage /> },
      { path: 'reportes', element: <ReportsPage /> },
      // 👇 Ajustes todavía no tiene página propia:
      // { path: 'ajustes', element: <SettingsPage /> },
    ],
  },
]);
