import { createBrowserRouter } from 'react-router-dom';
import { HomePage } from '../features/flights/pages/HomePage';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { RegisterPage } from '../features/auth/pages/RegisterPage';
import { ReservationsPage } from '../features/bookings/pages/ReservationsPage';
import { SeatSelectionPage } from '../features/bookings/pages/SeatSelectionPage';
import { BookingLayout } from '../features/bookings/pages/BookingLayout';
import { MainLayout } from '../components/layout/MainLayout';
import { ResultsPage } from '../features/flights/pages/ResultsPage';
import { AccountLayout } from '../components/layout/AccountLayout';
import { CancelFlightPage } from '../features/bookings/pages/CancelFlightPage';
import { AccountPlaceholderPage } from '../features/bookings/pages/AccountPlaceholderPage';

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
        path: '/cuenta',
        element: <AccountLayout />,
        children: [
          { index: true, element: <AccountPlaceholderPage /> },
          { path: 'reservas', element: <AccountPlaceholderPage /> },
          { path: 'datos', element: <AccountPlaceholderPage /> },
          { path: 'ajustes', element: <AccountPlaceholderPage /> },
          {
            path: 'reservas/:reservationId/cancelar',
            element: <CancelFlightPage />,
          },
        ],
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
]);
