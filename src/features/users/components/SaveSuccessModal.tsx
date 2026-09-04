import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faXmark } from '@fortawesome/free-solid-svg-icons';

type SaveSuccessModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const SaveSuccessModal = ({ isOpen, onClose }: SaveSuccessModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white px-8 py-10 text-center shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 flex h-7 w-7 items-center justify-center rounded-full border border-gray-500 text-gray-600"
          aria-label="Cerrar"
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>

        <FontAwesomeIcon icon={faCircleCheck} className="text-5xl text-green-500" />

        <h2 className="mt-5 text-xl font-semibold text-gray-900">Datos guardados correctamente</h2>

        <button
          type="button"
          onClick={onClose}
          className="mt-8 rounded-lg bg-gray-300 px-6 py-2 text-sm font-medium text-gray-800 shadow-md transition hover:bg-gray-400"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};
