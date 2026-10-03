import { FooterLayout } from '@/components/layout/FooterLayout';
import { MainLayout } from '@/components/layout/MainLayout';
import { PublicRoute } from '@/components/Routes/PublicRoute';
import { ProtectedRoute } from '@/components/Routes/ProtectedRoute';
import { MyDataPage } from '@/features/profile/pages/MyDataPage';
import { ReservationsLayout } from '@/features/reservations/layouts/ReservationsLayout';
import { CancelTripPage } from '@/features/reservations/pages/CancelTripPage';
import { FlightDetailsPage } from '@/features/reservations/pages/FlightDetailsPage';
import { ManageTripPage } from '@/features/reservations/pages/ManageTripPage';
import { MyReservationsPage } from '@/features/reservations/pages/MyReservationsPage';
import { SettingsPage } from '@/features/settings/pages/SettingsPage';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { RegisterPage } from '@/features/auth/pages/RegisterPage';
import { Baggage } from '@/features/bookings/pages/Baggage';
import { Booking } from '@/features/bookings/pages/Booking';
import { SeatSelection } from '@/features/bookings/pages/SeatSelection';
import { HomePage } from '@/features/flights/pages/HomePage';
import { ResultsPage } from '@/features/flights/pages/ResultsPage';
import { AdminLayout } from '@/components/admin';
import { generalNavItems } from '@/features/admin/general/general.nav';
import { GeneralDashboardPage } from '@/features/admin/general/pages/GeneralDashboardPage';
import { GeneralUsersPage } from '@/features/admin/general/pages/GeneralUsersPage';
import { airlineNavItems } from '@/features/admin/airline/airline.nav';
import { AirlineBookingsPage } from '@/features/admin/airline/bookings/pages/AirlineBookingsPage';
import { AirlineFlightsPage } from '@/features/admin/airline/flights/pages/AirlineFlightsPage';
import { AirlineReportsPage } from '@/features/admin/airline/reports/pages/AirlineReportsPage';
import { AirlineUsersPage } from '@/features/admin/airline/users/pages/AirlineUsersPage';
import { createBrowserRouter, Navigate } from 'react-router';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        element: <FooterLayout />,
        children: [
          {
            path: '/',
            element: <HomePage />,
          },
          {
            path: '/vuelos',
            element: <ResultsPage />,
          },
        ],
      },
      {
        element: <PublicRoute />,
        children: [
          {
            path: '/login',
            element: <LoginPage />,
          },
          {
            path: '/register',
            element: <RegisterPage />,
          },
        ],
      },
      {
        path: '/booking',
        element: <ProtectedRoute />,
        children: [
          {
            path: 'baggage',
            element: <Baggage />,
          },
          {
            path: 'seats',
            element: <SeatSelection />,
          },
          {
            path: 'checkout',
            element: <Booking />,
          },
          {
            path: 'checkout/travelers-data',
            element: <h1>HOLA</h1>,
          },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <FooterLayout />,
            children: [
              {
                element: <ReservationsLayout />,
                children: [
                  { path: '/my-data', element: <MyDataPage /> },
                  { path: '/settings', element: <SettingsPage /> },
                  {
                    path: '/my-reservations',
                    children: [
                      { index: true, element: <MyReservationsPage /> },
                      { path: ':id/manage', element: <ManageTripPage /> },
                      { path: ':id/details', element: <FlightDetailsPage /> },
                      { path: ':id/cancel', element: <CancelTripPage /> },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '/admin',
    element: <ProtectedRoute allow={['SUPER_ADMIN']} />,
    children: [
      {
        element: <AdminLayout navItems={generalNavItems} />,
        children: [
          { index: true, element: <GeneralDashboardPage /> },
          { path: 'usuarios', element: <GeneralUsersPage /> },
        ],
      },
    ],
  },
  {
    path: '/admin/aerolinea',
    element: <ProtectedRoute allow={['AIRLINE_ADMIN']} />,
    children: [
      {
        element: <AdminLayout navItems={airlineNavItems} sidebarSubtitle="PANEL DE AEROLÍNEA" />,
        children: [
          { index: true, element: <Navigate to="usuarios" replace /> },
          { path: 'usuarios', element: <AirlineUsersPage /> },
          { path: 'vuelos', element: <AirlineFlightsPage /> },
          { path: 'reservas', element: <AirlineBookingsPage /> },
          { path: 'reportes', element: <AirlineReportsPage /> },
        ],
      },
    ],
  },
]);
