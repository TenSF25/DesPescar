import { FooterLayout } from '@/components/layout/FooterLayout';
import { MainLayout } from '@/components/layout/MainLayout';
import { PublicRoute } from '@/components/Routes/PublicRoute';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { RegisterPage } from '@/features/auth/pages/RegisterPage';
import { Baggage } from '@/features/bookings/pages/Baggage';
import { Booking } from '@/features/bookings/pages/Booking';
import { SeatSelection } from '@/features/bookings/pages/SeatSelection';
import { HomePage } from '@/features/flights/pages/HomePage';
import { ResultsPage } from '@/features/flights/pages/ResultsPage';
import { createBrowserRouter } from 'react-router';

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
    ],
  },
]);
