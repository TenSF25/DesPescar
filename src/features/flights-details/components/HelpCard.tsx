import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeadset } from '@fortawesome/free-solid-svg-icons';

type HelpCardProps = {
  onSupport: () => void;
};

export const HelpCard = ({ onSupport }: HelpCardProps) => {
  return (
    <div className="mt-6 rounded-xl border bg-white p-6">
      <div className="flex items-center gap-3">
        <FontAwesomeIcon icon={faHeadset} className="w-5 text-blue-950" />

        <h2 className="text-xl font-bold">¿Necesitás ayuda?</h2>
      </div>

      <p className="mt-3 text-sm text-gray-600">Estamos para asistirte en lo que necesites.</p>

      <button
        onClick={onSupport}
        className="mt-5 flex items-center gap-2 rounded-lg border border-blue-950 px-5 py-3 font-medium text-blue-950"
      >
        <FontAwesomeIcon icon={faHeadset} className="w-4" />
        <span>Contactar soporte</span>
      </button>
    </div>
  );
};
