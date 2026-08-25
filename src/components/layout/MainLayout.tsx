import { Outlet, useLocation } from 'react-router-dom';
import { Footer } from './Footer';
import { Nav } from './Nav';

// Rutas que corresponden a un usuario logueado. Provisorio: mientras no exista
// un store de autenticación real, se detecta acá por prefijo de ruta.
const PRIVATE_ROUTES = ['/my-reservations', '/my-data', '/settings'];

export const MainLayout = () => {
  const { pathname } = useLocation();
  const authenticated = PRIVATE_ROUTES.some((route) => pathname.startsWith(route));

  return (
    <div className="flex min-h-screen flex-col">
      <Nav authenticated={authenticated} />
      <main className="grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
