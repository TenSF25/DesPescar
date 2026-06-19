import { Outlet } from 'react-router-dom';
import { Footer } from './Footer';
import { Nav } from './Nav';

export const MainLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
