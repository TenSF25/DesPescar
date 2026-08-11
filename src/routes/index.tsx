import { createBrowserRouter } from 'react-router-dom';
import { HomePage } from '../features/flights/pages/HomePage';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { RegisterPage } from '../features/auth/pages/RegisterPage';
import { ReservationsPage } from '../features/bookings/pages/ReservationsPage';
import { SeatSelectionPage } from '../features/bookings/pages/SeatSelectionPage';
import { BookingLayout } from '../features/bookings/pages/BookingLayout';
import { MainLayout } from '../components/layout/MainLayout';
import { ReservationsLayout } from '../features/reservations/layouts/ReservationsLayout';
import { MyReservationsPage } from '../features/reservations/pages/MyReservationsPage';

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
    path: '/my-reservations',
    element: <ReservationsLayout />,
    children: [{ index: true, element: <MyReservationsPage /> }],
  },
]);
