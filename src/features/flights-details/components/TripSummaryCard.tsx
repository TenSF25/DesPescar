import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faPlane } from '@fortawesome/free-solid-svg-icons';

type TripSummaryCardProps = {
  onDownload: () => void;
};

export const TripSummaryCard = ({ onDownload }: TripSummaryCardProps) => {
  return (
    <div className="mt-6 rounded-xl border bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="rounded-md bg-blue-950 px-3 py-2 text-sm font-bold text-white">
          PRÓXIMO VIAJE
        </div>

        <div>
          <div className="font-bold">BUE</div>
          <div className="text-sm text-gray-500">Buenos Aires</div>
        </div>

        <FontAwesomeIcon icon={faPlane} className="w-4 text-blue-950" />

        <div>
          <div className="font-bold">MEX</div>
          <div className="text-sm text-gray-500">México</div>
        </div>

        <div>
          <div className="text-sm text-gray-500">Código de reserva</div>
          <div className="font-bold">ABC123</div>
        </div>

        <div>
          <div className="text-sm text-gray-500">Estado</div>
          <div className="inline-block rounded-md bg-green-100 px-2 py-1 text-sm font-bold text-green-700">
            PRÓXIMO
          </div>
        </div>

        <button
          onClick={onDownload}
          className="flex items-center gap-2 rounded-lg border border-blue-950 px-5 py-3 font-semibold text-blue-950"
        >
          <FontAwesomeIcon icon={faDownload} className="w-4" />
          <span>Descargar comprobante</span>
        </button>
      </div>
    </div>
  );
};
