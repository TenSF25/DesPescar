import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldHalved } from '@fortawesome/free-solid-svg-icons';

export const PaymentSummaryCard = () => {
  return (
    <div className="rounded-xl border bg-white p-6">
      <h2 className="text-xl font-bold">Resumen de pago</h2>

      <div className="mt-6 flex justify-between">
        <div>Tarifa (2 pasajeros)</div>
        <div>$1.200,00</div>
      </div>

      <div className="mt-4 flex justify-between">
        <div>Asientos</div>
        <div>$0,00</div>
      </div>

      <hr className="my-6" />

      <div className="flex justify-between font-bold">
        <div>Total</div>
        <div className="text-orange-500">$1.200,00</div>
      </div>

      <div className="mt-6 rounded-lg bg-orange-50 p-4">
        <div className="flex items-center gap-2 font-bold">
          <FontAwesomeIcon icon={faShieldHalved} className="w-4 text-orange-500" />
          <span>Reservá con tranquilidad</span>
        </div>

        <p className="mt-2 text-sm text-gray-600">
          Podés cambiar o cancelar tu reserva según las condiciones de tu tarifa.
        </p>
      </div>
    </div>
  );
};
