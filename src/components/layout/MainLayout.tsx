import { Outlet } from 'react-router';
import { Nav } from './Nav';

export const MainLayout = () => {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Nav />
      <main className="flex w-full flex-1 flex-col">
        <Outlet />
      </main>
    </div>
  );
};
