import { Outlet, useLocation } from 'react-router';
import { Footer } from './Footer';
import { Nav } from './Nav';
import KoiChat from '@/features/koi/pages/KoiChat';

export const MainLayout = () => {
  const location = useLocation();
  const path = location.pathname;

  // 1. Listado exacto de rutas donde el footer NO debe aparecer bajo ningún punto de vista
  const rutasExactasSinFooter = ['/carrito', '/pago', '/checkout'];

  // 2. Prefijos de flujos completos (ej: todo lo que sea /booking/...)
  const prefijosSinFooter = ['/booking'];

  // Verificación estricta:
  const esRutaExacta = rutasExactasSinFooter.includes(path);
  const esPrefijoValido = prefijosSinFooter.some(
    (prefijo) => path === prefijo || path.startsWith(`${prefijo}/`),
  );

  const ocultarFooter = esRutaExacta || esPrefijoValido;

  return (
    <div className="relative flex min-h-screen flex-col">
      <Nav />
      <main className="flex w-full flex-1 flex-col">
        <Outlet />
      </main>
      {!ocultarFooter && <Footer />}
      <KoiChat></KoiChat>
    </div>
  );
};
