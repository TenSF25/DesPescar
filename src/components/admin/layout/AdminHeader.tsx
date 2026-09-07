import { useAuthStore } from '../../../features/auth/store/useAuthStore';

interface AdminHeaderProps {
  userName?: string;
  userRole?: string;
}

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

export const AdminHeader = ({ userName, userRole = 'Administradora' }: AdminHeaderProps) => {
  const { user } = useAuthStore();
  const fullName = `${user?.name ?? ''} ${user?.lastName ?? ''}`.trim();
  const displayName = userName ?? (fullName || 'Admin');

  return (
    <header className="flex w-full items-center justify-end gap-5 border-b border-black/10 bg-white px-8 py-4">
      <button type="button" className="hover:text-secondary cursor-pointer text-[#44474E]">
        <span className="material-symbols-outlined">notifications</span>
      </button>
      <button type="button" className="hover:text-secondary cursor-pointer text-[#44474E]">
        <span className="material-symbols-outlined">account_circle</span>
      </button>
      <div className="flex cursor-pointer items-center gap-2">
        <div className="bg-primary flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white">
          {getInitials(displayName)}
        </div>
        <div className="hidden flex-col leading-tight sm:flex">
          <span className="text-secondary text-sm font-semibold">{displayName}</span>
          <span className="text-[11px] text-[#44474E]">{userRole}</span>
        </div>
        <span className="material-symbols-outlined text-[18px] text-[#44474E]">expand_more</span>
      </div>
    </header>
  );
};
