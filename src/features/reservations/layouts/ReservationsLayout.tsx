import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';

export const ReservationsLayout = () => {
  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col gap-6 bg-gray-100 px-4 py-6 sm:px-6 lg:flex-row lg:items-start lg:px-9 lg:py-8">
      <Sidebar />
      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  );
};
