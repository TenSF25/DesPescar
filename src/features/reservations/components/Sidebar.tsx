import { NavLink, useNavigate } from 'react-router';
import { useAuthStore } from '@/store/useAuthStore';
import { cn } from '@/utils/cn';

const links = [
  { to: '/my-reservations', label: 'Mis reservas', icon: 'confirmation_number' },
  { to: '/my-data', label: 'Mis datos', icon: 'person' },
  { to: '/settings', label: 'Ajustes', icon: 'settings' },
];

export const Sidebar = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const cerrarSesion = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="lg:sticky lg:top-6 lg:h-fit lg:w-66 lg:shrink-0 lg:self-start">
      {/* Desktop: lista vertical */}
      <nav className="hidden flex-col gap-1 rounded-2xl border border-black/10 bg-white p-4 lg:flex">
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-[10px] px-4 py-2.5 text-sm font-semibold transition-colors',
                isActive
                  ? 'bg-primary text-white'
                  : 'text-neutral hover:bg-neutral/10 hover:text-secondary',
              )
            }
          >
            <span className="material-symbols-outlined text-[18px]!">{icon}</span>
            {label}
          </NavLink>
        ))}
        <button
          type="button"
          onClick={cerrarSesion}
          className="text-neutral hover:bg-neutral/10 hover:text-secondary mt-2 flex cursor-pointer items-center gap-3 rounded-[10px] border-t border-black/10 px-4 py-2.5 pt-3 text-sm font-semibold transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]!">logout</span>
          Cerrar sesión
        </button>
      </nav>

      {/* Mobile/tablet: fila de pills scrolleable */}
      <nav className="flex gap-2 overflow-x-auto rounded-2xl border border-black/10 bg-white p-2 lg:hidden">
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex min-h-10 shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors',
                isActive
                  ? 'bg-primary text-white'
                  : 'text-neutral hover:text-secondary bg-gray-100',
              )
            }
          >
            <span className="material-symbols-outlined text-[18px]!">{icon}</span>
            {label}
          </NavLink>
        ))}
        <button
          type="button"
          onClick={cerrarSesion}
          className="text-neutral hover:text-secondary flex min-h-10 shrink-0 cursor-pointer items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]!">logout</span>
          Cerrar sesión
        </button>
      </nav>
    </aside>
  );
};
