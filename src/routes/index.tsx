import { createBrowserRouter } from 'react-router-dom';
import { HomePage } from '../features/flights/pages/HomePage';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { RegisterPage } from '../features/auth/pages/RegisterPage';
import { ReservationsPage } from '../features/bookings/pages/ReservationsPage';
import { SeatSelectionPage } from '../features/bookings/pages/SeatSelectionPage';
import { BookingLayout } from '../features/bookings/pages/BookingLayout';
import { MainLayout } from '../components/layout/MainLayout';
import { ResultsPage } from '../features/flights/pages/ResultsPage';
import { HotelsPage } from '../features/hotels/pages/HotelsPage';
import { HotelDetailPage } from '../features/hotels/pages/HotelDetailPage';
import { HotelBookingPage } from '../features/hotels/pages/HotelBookingPage';
import { MisReservasPage } from '../features/hotels/pages/MisReservasPage';
import { HotelCancelPage } from '../features/hotels/pages/HotelCancelPage';
import { AdminLayout } from '../components/admin';
import { AdminDashboardPage } from '../features/admin/pages/AdminDashboardPage';
import { AdminHotelsPage } from '../features/admin/pages/AdminHotelsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      {
        path: '/hotels',
        element: <HotelsPage />,
      },
      {
        path: '/hotels/:id',
        element: <HotelDetailPage />,
      },
      {
        path: '/hotels/:id/reservar/:roomId',
        element: <HotelBookingPage />,
      },
      {
        path: '/hotels/mis-reservas',
        element: <MisReservasPage />, // Agrgar que solo se pueda ver una vez lugueado.
      },
      {
        path: '/hotels/mis-reservas/:reservaId/cancelar',
        element: <HotelCancelPage />,
      },
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
      { path: 'hoteles', element: <AdminHotelsPage /> },
      // Agreguen aca la ruta real del panel de administrador:
      // { path: 'usuarios', element: <UsersPage /> },
      // { path: 'vuelos', element: <FlightsManagementPage /> },
      // { path: 'reportes', element: <ReportsPage /> },
      // { path: 'reservas', element: <BookingsManagementPage /> },
      // { path: 'ajustes', element: <SettingsPage /> },
    ],
  },
]);
