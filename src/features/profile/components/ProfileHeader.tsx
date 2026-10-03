import { ProfileAvatar } from './ProfileAvatar';

interface ProfileHeaderProps {
  foto: string;
  iniciales: string;
  nombreCompleto: string;
  email: string;
  onEditPhoto: () => void;
}

export const ProfileHeader = ({
  foto,
  iniciales,
  nombreCompleto,
  email,
  onEditPhoto,
}: ProfileHeaderProps) => (
  <section className="flex flex-col items-center gap-4 rounded-2xl border border-black/10 bg-white p-5 text-center sm:flex-row sm:p-6 sm:text-left">
    <div className="relative">
      <ProfileAvatar foto={foto} iniciales={iniciales} className="h-24 w-24 text-3xl" />
      <button
        type="button"
        onClick={onEditPhoto}
        aria-label="Editar foto de perfil"
        className="bg-primary absolute right-0 bottom-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-white text-white transition-opacity hover:opacity-90"
      >
        <span className="material-symbols-outlined text-[16px]!">photo_camera</span>
      </button>
    </div>
    <div className="min-w-0">
      <h2 className="text-secondary truncate text-xl font-extrabold">
        {nombreCompleto || 'Tu perfil'}
      </h2>
      <p className="text-neutral truncate text-sm">{email}</p>
      <button
        type="button"
        onClick={onEditPhoto}
        className="text-primary mt-2 cursor-pointer text-sm font-bold hover:opacity-70"
      >
        {foto ? 'Cambiar foto' : 'Subir foto'}
      </button>
    </div>
  </section>
);
