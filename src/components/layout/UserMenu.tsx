import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { logoutSession } from '@/features/auth/logout';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { ProfileAvatar } from '@/features/profile/components/ProfileAvatar';
import { Button } from '../ui/Button';
import { userMenuItems } from './userMenuItems';

const itemClass =
  'text-neutral hover:bg-neutral/10 hover:text-secondary flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left text-sm font-semibold transition-colors';

export const UserMenu = () => {
  const { pathname } = useLocation();
  const { profile } = useProfile();
  const enPerfil = userMenuItems.some(({ to }) => pathname.startsWith(to));
  const iniciales =
    `${profile.nombre.trim()[0] ?? ''}${profile.apellido.trim()[0] ?? ''}`.toUpperCase();
  const nombreCompleto = `${profile.nombre} ${profile.apellido}`.trim();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const cerrarSesion = () => {
    setOpen(false);
    logoutSession();
    navigate('/');
  };

  return (
    <div ref={ref} className="relative hidden md:block">
      {enPerfil ? (
        <div className="flex max-w-60 items-center gap-3 py-1 pr-3 pl-1">
          <ProfileAvatar foto={profile.foto} iniciales={iniciales} className="h-10 w-10 text-sm" />
          <span className="text-secondary truncate text-sm font-bold">{nombreCompleto}</span>
        </div>
      ) : (
        <Button
          variant="secondary"
          className="w-40 justify-center text-[14px]"
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
        >
          MI PERFIL
          <span className="material-symbols-outlined text-[18px]!">
            {open ? 'expand_less' : 'expand_more'}
          </span>
        </Button>
      )}
      {open && !enPerfil && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-black/10 bg-white py-2 shadow-lg"
        >
          {userMenuItems.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              role="menuitem"
              className={itemClass}
              onClick={() => setOpen(false)}
            >
              <span className="material-symbols-outlined text-[18px]!">{icon}</span>
              {label}
            </Link>
          ))}
          <button
            type="button"
            role="menuitem"
            className={`${itemClass} mt-1 border-t border-black/10 pt-3`}
            onClick={cerrarSesion}
          >
            <span className="material-symbols-outlined text-[18px]!">logout</span>
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
};
