import { Outlet } from 'react-router-dom';
import { AdminHeader } from '../../../components/admin';
import { HotelAdminSidebar } from './HotelAdminSidebar';

/**
 * Layout raíz del panel de "dueño de hotel". Reutiliza AdminHeader (genérico,
 * no depende de adminNavItems) pero usa NUESTRO propio sidebar, no el
 * compartido con admin general / aerolíneas.
 */
export const HotelAdminLayout = () => {
  return (
    <div className="flex min-h-screen w-full bg-[#F7F8FA]">
      <HotelAdminSidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <AdminHeader userName="Hotel Mediterráneo" userRole="Hotelera" />
        <main className="flex flex-1 flex-col gap-6 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
