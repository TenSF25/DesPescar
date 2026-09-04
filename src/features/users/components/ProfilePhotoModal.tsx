import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faCamera, faTrash, faXmark, faUser } from '@fortawesome/free-solid-svg-icons';

type ProfilePhotoModalProps = {
  isOpen: boolean;
  onClose: () => void;
  photo: string | null;
  onPhotoChange: (photo: string | null) => void;
};

export const ProfilePhotoModal = ({
  isOpen,
  onClose,
  photo,
  onPhotoChange,
}: ProfilePhotoModalProps) => {
  if (!isOpen) return null;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    onPhotoChange(imageUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 flex h-7 w-7 items-center justify-center rounded-full border border-gray-700 text-gray-700"
          aria-label="Cerrar"
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>

        <div className="flex flex-col items-center">
          {photo ? (
            <img src={photo} alt="Foto de perfil" className="h-24 w-24 rounded-full object-cover" />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-400">
              <FontAwesomeIcon icon={faUser} className="text-5xl text-black" />
            </div>
          )}
        </div>

        <div className="mt-8 space-y-5">
          <label className="flex cursor-pointer items-center gap-4 text-sm text-gray-800">
            <FontAwesomeIcon icon={faImage} className="w-5 text-gray-900" />

            <span>Elegir desde la biblioteca</span>

            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>

          <label className="flex cursor-pointer items-center gap-4 text-sm text-gray-800">
            <FontAwesomeIcon icon={faCamera} className="w-5 text-gray-900" />

            <span>Tomar foto</span>

            <input
              type="file"
              accept="image/*"
              capture="user"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          <button
            type="button"
            onClick={() => {
              onPhotoChange(null);
              onClose();
            }}
            className="flex items-center gap-4 text-sm text-red-500"
          >
            <FontAwesomeIcon icon={faTrash} className="w-5" />

            <span>Eliminar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
