import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import type { AdminNavEntry } from '../admin.types';

interface AdminLayoutProps {
  /** Menú de este dashboard. Sin esto usa el que ya venía por defecto. */
  navItems?: AdminNavEntry[];
}

/**
 * Layout raíz de todas las páginas del panel de administrador.
 *
 * El contenedor usa `min-h-screen` (crece con el contenido) y el menú
 * lateral se pega con `sticky`, así acompaña el scroll en vez de quedarse
 * arriba dejando un hueco.
 */
export const AdminLayout = ({ navItems }: AdminLayoutProps) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-[#F7F8FA]">
      <AdminSidebar
        items={navItems}
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* min-w-0 evita que una tabla ancha estire el layout y rompa el responsive */}
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
