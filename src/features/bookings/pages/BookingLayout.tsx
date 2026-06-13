import { Outlet, useLocation } from 'react-router-dom';

export const BookingLayout = () => {
  const location = useLocation();

  return (
    <main>
      Layout Booking
      <div>
        <Outlet />
      </div>
    </main>
  );
};
