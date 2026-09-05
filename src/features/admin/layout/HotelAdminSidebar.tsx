import { NavLink } from 'react-router-dom';

/**
 * Sidebar exclusivo del panel de "dueño de hotel". A propósito NO reutiliza
 * adminNavItems / AdminSidebar del kit general: ese sidebar es compartido por
 * admin general (Noelia) y aerolíneas (Luciano), y editarlo les rompería su
 * navegación. Acá tenemos nuestra propia lista de ítems, acotada a lo que
 * un dueño de hotel realmente necesita (sin "Gestión de vuelos", por ejemplo).
 */
const hotelAdminNavItems = [
  { label: 'Mi Hotel', path: '/admin/hoteles', icon: 'hotel', end: true },
  { label: 'Reportes', path: '/admin/hoteles/reportes', icon: 'bar_chart', end: false },
];

export const HotelAdminSidebar = () => {
  return (
    <aside className="bg-secondary flex h-screen w-64 shrink-0 flex-col justify-between p-4 text-white">
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-2 px-2 py-2">
          <img src="/despescar.webp" alt="Despescar" className="h-9 w-9 rounded-full object-cover" />
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-bold tracking-widest">DESPESCAR</span>
            <span className="text-primary text-[10px] font-semibold tracking-wider">
              PANEL DE HOTELERA
            </span>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {hotelAdminNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white ${
                  isActive ? 'bg-primary text-white hover:bg-primary' : ''
                }`
              }
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <button
        type="button"
        className="text-primary flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-white/10"
      >
        <span className="material-symbols-outlined text-[20px]">logout</span>
        Cerrar sesión
      </button>
    </aside>
  );
};
