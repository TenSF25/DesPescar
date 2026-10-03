import { cn } from '@/utils/cn';

interface ProfileAvatarProps {
  foto: string;
  iniciales: string;
  className?: string;
}

export const ProfileAvatar = ({ foto, iniciales, className }: ProfileAvatarProps) => (
  <div
    className={cn(
      'bg-secondary flex shrink-0 items-center justify-center overflow-hidden rounded-full font-extrabold text-white',
      className,
    )}
  >
    {foto ? (
      <img src={foto} alt="Tu foto de perfil" className="h-full w-full object-cover" />
    ) : (
      <span aria-hidden="true">{iniciales || '?'}</span>
    )}
  </div>
);
