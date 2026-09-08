import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '../../../utils/cn';
import { adminNavItems } from './adminNav.config';
import { useAuthStore } from '../../../features/auth/store/useAuthStore';
import type { AdminNavItem } from '../admin.types';

interface AdminSidebarProps {
  /**
   * Ítems del menú lateral. Opcional: si no se pasa nada, usa
   * `adminNavItems` (el menú del admin general) para no romper a nadie
   * que ya use <AdminSidebar /> sin props.
   *
   * Cada dashboard (aerolínea, hotel, admin general) le pasa su propia
   * lista, así se reutiliza el mismo componente sin tocarlo.
   */
  items?: AdminNavItem[];
}

export const AdminSidebar = ({ items = adminNavItems }: AdminSidebarProps) => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <aside className="bg-secondary flex h-screen w-64 shrink-0 flex-col justify-between p-4 text-white">
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-2 px-2 py-2">
          <img
            src="/despescar.webp"
            alt="Despescar"
            className="h-9 w-9 rounded-full object-cover"
          />
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-bold tracking-widest">DESPESCAR</span>
            <span className="text-primary text-[10px] font-semibold tracking-wider">
              VUELA DIFERENTE
            </span>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white',
                  isActive && 'bg-primary hover:bg-primary text-white',
                )
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
        onClick={handleLogout}
        className="text-primary flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-white/10"
      >
        <span className="material-symbols-outlined text-[20px]">logout</span>
        Cerrar sesión
      </button>
    </aside>
  );
};
