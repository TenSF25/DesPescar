import { Outlet } from 'react-router';
import { Nav } from './Nav';
import KoiChat from '@/features/koi/pages/KoiChat';

export const MainLayout = () => {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Nav />
      <main className="flex w-full flex-1 flex-col">
        <Outlet />
      </main>
      <KoiChat></KoiChat>
    </div>
  );
};
