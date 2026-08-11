import { Link, NavLink } from 'react-router-dom';
import { cn } from '../../../utils/cn';

const links = [
  { to: '/', label: 'Dashboard', icon: 'dashboard' },
  { to: '/my-reservations', label: 'Mis reservas', icon: 'confirmation_number' },
  { to: '/my-data', label: 'Mis datos', icon: 'person' },
  { to: '/settings', label: 'Ajustes', icon: 'settings' },
];

export const Sidebar = () => {
  return (
    <aside className="fixed top-15 bottom-0 left-0 flex w-66 shrink-0 flex-col overflow-y-auto border-r border-black/10 bg-white py-6">
      <nav className="flex flex-1 flex-col gap-1 px-4">
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
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
      </nav>

      <div className="mt-auto border-t border-black/10 px-4 pt-4">
        <Link
          to="/login"
          className="text-alert flex items-center gap-3 rounded-[10px] px-4 py-2.5 text-sm font-semibold"
        >
          <span className="material-symbols-outlined text-[18px]!">logout</span>
          Cerrar sesión
        </Link>
      </div>
    </aside>
  );
};
