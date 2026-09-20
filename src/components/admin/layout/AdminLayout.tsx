import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

/**
 * Layout raíz de todas las páginas del panel de administrador.
 */
export const AdminLayout = () => {
  return (
    <div className="flex min-h-screen w-full bg-[#F7F8FA]">
      <AdminSidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <AdminHeader />
        <main className="flex flex-1 flex-col gap-6 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
