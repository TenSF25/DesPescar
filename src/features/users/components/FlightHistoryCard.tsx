import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClockRotateLeft, faPlane } from '@fortawesome/free-solid-svg-icons';

export const FlightHistoryCard = () => {
  return (
    <section className="mt-4 rounded-xl bg-white p-5 shadow-md">
      <div className="flex items-center justify-between border-b pb-3">
        <div className="flex items-center gap-3">
          <FontAwesomeIcon icon={faClockRotateLeft} className="text-xl text-gray-900" />

          <h2 className="text-xl font-medium text-gray-900">Historial de vuelos</h2>
        </div>

        <button type="button" className="text-sm font-medium text-orange-500">
          Ver más
        </button>
      </div>

      <div className="mt-3 space-y-3">
        <div className="flex items-center justify-between rounded-xl bg-gray-200 px-5 py-3">
          <div>
            <p className="text-sm font-bold">MAD</p>
            <p className="text-sm text-gray-600">Madrid</p>
          </div>

          <FontAwesomeIcon icon={faPlane} className="text-2xl text-orange-500" />

          <div>
            <p className="text-sm font-bold">MEX</p>
            <p className="text-sm text-gray-600">México</p>
          </div>

          <div className="text-right">
            <p className="text-xs text-gray-600">15 de octubre 2026</p>

            <span className="mt-1 inline-block rounded-md bg-orange-200 px-4 py-1 text-xs font-bold">
              ● &nbsp; PRÓXIMO
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-gray-100 px-5 py-3 text-gray-500">
          <div>
            <p className="text-sm font-bold">MAD</p>
            <p className="text-sm">Madrid</p>
          </div>

          <FontAwesomeIcon icon={faPlane} className="text-2xl" />

          <div>
            <p className="text-sm font-bold">MEX</p>
            <p className="text-sm">México</p>
          </div>

          <div className="text-right">
            <p className="text-xs">02 de enero 2026</p>

            <span className="mt-1 inline-block rounded-md bg-gray-300 px-4 py-1 text-xs font-bold text-gray-600">
              FINALIZADO
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
