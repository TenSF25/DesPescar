import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { TopNav } from '../components/TopNav';

export const ReservationsLayout = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <TopNav />
      <div className="flex pt-15">
        <Sidebar />
        <main className="ml-66 w-full max-w-275 px-9 py-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
