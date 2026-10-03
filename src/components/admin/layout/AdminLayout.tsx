import { Outlet } from 'react-router';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import type { AdminNavItem } from '../admin.types';

interface AdminLayoutProps {
  /** Menú lateral del panel (general, aerolínea u hotel). */
  navItems: AdminNavItem[];
  sidebarSubtitle?: string;
  /** Sobrescribe el nombre/rol del header (por defecto sale del usuario logueado). */
  userName?: string;
  userRole?: string;
}

/**
 * Layout raíz de cualquier panel de administrador. Es el mismo para los tres
 * (general, aerolínea, hotel): cada uno solo le pasa su menú.
 */
export const AdminLayout = ({
  navItems,
  sidebarSubtitle,
  userName,
  userRole,
}: AdminLayoutProps) => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F7F8FA]">
      <AdminSidebar items={navItems} subtitle={sidebarSubtitle} />
      <div className="flex h-screen min-w-0 flex-1 flex-col">
        <AdminHeader userName={userName} userRole={userRole} />
        <main className="flex flex-1 flex-col gap-6 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
