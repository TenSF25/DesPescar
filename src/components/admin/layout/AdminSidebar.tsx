import { NavLink, useNavigate } from 'react-router';
import { cn } from '@/utils/cn';
import { useAuthStore } from '@/store/useAuthStore';
import type { AdminNavItem } from '../admin.types';

interface AdminSidebarProps {
  /** Menú del panel (cada panel define el suyo en su feature). */
  items: AdminNavItem[];
  /** Texto chico bajo el logo, ej: "PANEL DE HOTELERA". */
  subtitle?: string;
}

export const AdminSidebar = ({ items, subtitle = 'VUELA DIFERENTE' }: AdminSidebarProps) => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

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
              {subtitle}
            </span>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
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
