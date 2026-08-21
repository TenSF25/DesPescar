import { NavLink } from 'react-router-dom';
import { cn } from '../../utils/cn';

const ITEMS = [
  { to: '/cuenta/reservas', label: 'Mis reservas', icon: 'confirmation_number' },
  { to: '/cuenta/datos', label: 'Mis datos', icon: 'person' },
  { to: '/cuenta/ajustes', label: 'Ajustes', icon: 'settings' },
];

export const AccountSidebar = () => {
  return (
    <aside className="h-max w-full rounded-2xl border border-black/10 p-4 lg:w-64">
      <nav>
        <ul className="flex flex-col gap-2">
          {ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'flex flex-row items-center gap-3 rounded-[10px] p-3 font-semibold transition-colors duration-200',
                    isActive ? 'bg-primary text-white' : 'text-secondary hover:bg-black/5',
                  )
                }
              >
                <span className="material-symbols-outlined" aria-hidden="true">
                  {item.icon}
                </span>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <hr className="my-4 text-black/10" />

      <NavLink
        to="/login"
        className="text-alert flex flex-row items-center gap-3 rounded-[10px] p-3 font-semibold transition-colors duration-200 hover:bg-black/5"
      >
        <span className="material-symbols-outlined" aria-hidden="true">
          logout
        </span>
        Cerrar sesión
      </NavLink>
    </aside>
  );
};
