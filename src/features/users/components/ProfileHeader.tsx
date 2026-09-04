import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faPenToSquare } from '@fortawesome/free-solid-svg-icons';

type ProfileHeaderProps = {
  photo: string | null;
  onEditPhoto: () => void;
};

export const ProfileHeader = ({ photo, onEditPhoto }: ProfileHeaderProps) => {
  return (
    <section className="flex min-h-28 items-center justify-between rounded-xl bg-blue-950 px-8 py-5 text-white shadow-md">
      <div className="flex items-center gap-5">
        <div className="relative">
          {photo ? (
            <img src={photo} alt="Foto de perfil" className="h-16 w-16 rounded-md object-cover" />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-md bg-blue-900">
              <FontAwesomeIcon icon={faImage} className="text-3xl text-blue-950" />
            </div>
          )}

          <button
            type="button"
            onClick={onEditPhoto}
            className="absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded bg-blue-950 text-white"
            aria-label="Editar foto"
          >
            <FontAwesomeIcon icon={faPenToSquare} className="text-xs" />
          </button>
        </div>

        <div>
          <h2 className="text-lg font-bold">Melina Celeste Cora</h2>

          <p className="mt-1 text-sm text-gray-300">Cliente</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onEditPhoto}
        className="rounded-lg bg-gray-300 px-7 py-3 text-sm font-medium text-gray-700 shadow-lg transition hover:bg-gray-200"
      >
        Editar Perfil
      </button>
    </section>
  );
};
