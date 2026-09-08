import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import type { AdminNavItem } from '../admin.types';

interface AdminLayoutProps {
  /** Ítems del menú del dashboard que use este layout. Opcional: sin esto, usa el menú del admin general (comportamiento actual). */
  navItems?: AdminNavItem[];
}

/**
 * Layout raíz de cualquier dashboard administrativo (admin general,
 * aerolínea, hotel...). Es de Luciano y no cambia su diseño: lo único que
 * se agregó es `navItems`, opcional, para que cada dashboard le pase su
 * propio menú sin duplicar este componente.
 */
export const AdminLayout = ({ navItems }: AdminLayoutProps) => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F7F8FA]">
      <AdminSidebar items={navItems} />
      <div className="flex h-screen min-w-0 flex-1 flex-col">
        <AdminHeader />
        <main className="flex flex-1 flex-col gap-6 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
