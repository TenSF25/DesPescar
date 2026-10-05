import { useAuthStore } from '@/store/useAuthStore';

interface AdminHeaderProps {
  /** Si no se pasa, usa el nombre del usuario logueado. */
  userName?: string;
  /** Si no se pasa, se deduce del rol del usuario logueado. */
  userRole?: string;
  /** Abre el menú lateral (drawer) en pantallas chicas. */
  onMenuClick?: () => void;
}

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: 'Administrador general',
  AIRLINE_ADMIN: 'Administrador de aerolínea',
  HOTEL_ADMIN: 'Administrador de hotel',
};

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

export const AdminHeader = ({ userName, userRole, onMenuClick }: AdminHeaderProps) => {
  const user = useAuthStore((state) => state.user);
  const fullName = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim();
  const displayName = userName ?? (fullName || 'Admin');
  const displayRole = userRole ?? (user ? (ROLE_LABELS[user.role] ?? user.role) : '');

  return (
    <header className="flex w-full items-center justify-between gap-5 border-b border-black/10 bg-white px-4 py-4 sm:px-6 lg:justify-end lg:px-8">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Abrir menú"
        className="hover:text-secondary cursor-pointer text-[#44474E] lg:hidden"
      >
        <span className="material-symbols-outlined">menu</span>
      </button>
      <div className="flex items-center gap-5">
        <button type="button" className="hover:text-secondary cursor-pointer text-[#44474E]">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <button type="button" className="hover:text-secondary cursor-pointer text-[#44474E]">
          <span className="material-symbols-outlined">account_circle</span>
        </button>
        <div className="flex items-center gap-2">
          <div className="bg-primary flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white">
            {getInitials(displayName)}
          </div>
          <div className="hidden flex-col leading-tight sm:flex">
            <span className="text-secondary text-sm font-semibold">{displayName}</span>
            <span className="text-[11px] text-[#44474E]">{displayRole}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
