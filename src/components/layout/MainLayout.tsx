import { Outlet, useLocation } from 'react-router-dom';
import { ChatWidget } from '../../features/chatbot';
import { Footer } from './Footer';
import { Nav } from './Nav';

export const MainLayout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="grow">
        <Outlet />
      </main>
      <Footer />
      {!isLoginPage && <ChatWidget />}
    </div>
  );
};
