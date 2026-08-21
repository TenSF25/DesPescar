import { Button } from '../../../../components/ui/Button';
import type { CancelReason, FareType } from '../../bookings.types';
import { getPenaltyRate } from '../../utils/calculateRefund';

interface CancelReasonFormProps {
  fare: FareType;
  reason: CancelReason | null;
  onReasonChange: (reason: CancelReason) => void;
  comment: string;
  onCommentChange: (comment: string) => void;
  canConfirm: boolean;
  isConfirming: boolean;
  onConfirm: () => void;
  onBack: () => void;
}

const REASONS: { value: CancelReason; label: string }[] = [
  { value: 'PLAN_CHANGE', label: 'Cambios en mis planes' },
  { value: 'PERSONAL', label: 'Problemas personales' },
  { value: 'HEALTH', label: 'Problemas de salud' },
  { value: 'FLIGHT_ISSUE', label: 'Problemas con el vuelo' },
  { value: 'OTHER', label: 'Otro motivo' },
];

export const CancelReasonForm = ({
  fare,
  reason,
  onReasonChange,
  comment,
  onCommentChange,
  canConfirm,
  isConfirming,
  onConfirm,
  onBack,
}: CancelReasonFormProps) => {
  const isOther = reason === 'OTHER';

  return (
    <div className="flex flex-col gap-4">
      <section className="flex flex-col gap-4 rounded-2xl border border-black/10 p-5">
        <fieldset className="flex flex-col gap-3">
          <legend className="text-secondary flex flex-row items-center gap-2 font-bold">
            <span className="material-symbols-outlined" aria-hidden="true">
              help
            </span>
            ¿Por qué cancelás tu vuelo?
          </legend>

          {REASONS.map((item) => (
            <div key={item.value} className="flex flex-row items-center gap-3">
              <input
                type="radio"
                name="cancelReason"
                id={item.value}
                value={item.value}
                checked={reason === item.value}
                onChange={() => onReasonChange(item.value)}
                className="accent-primary w-4"
              />
              <label htmlFor={item.value} className="cursor-pointer text-[14px]">
                {item.label}
              </label>
            </div>
          ))}
        </fieldset>

        <textarea
          value={comment}
          onChange={(event) => onCommentChange(event.target.value)}
          required={isOther}
          aria-label="Comentario sobre el motivo de la cancelación"
          placeholder={isOther ? 'Contanos el motivo (requerido)' : 'Contanos el motivo (opcional)'}
          className="min-h-20 w-full resize-none rounded-xl border border-black/20 p-2 text-[14px]"
        />
      </section>

      <section className="bg-[#eef4ff] flex flex-col gap-3 rounded-2xl p-5">
        <h3 className="text-secondary font-semibold">Política de cancelación – Tarifa {fare}</h3>
        <ul className="text-secondary flex flex-col gap-2 text-[14px]">
          <li className="flex flex-row gap-2">
            <span className="material-symbols-outlined text-[18px]!" aria-hidden="true">
              check_circle
            </span>
            Cancelación permitida hasta 24 hs antes del vuelo.
          </li>
          <li className="flex flex-row gap-2">
            <span className="material-symbols-outlined text-[18px]!" aria-hidden="true">
              check_circle
            </span>
            Penalización del {getPenaltyRate(fare) * 100}% del valor de la tarifa.
          </li>
          <li className="flex flex-row gap-2">
            <span className="material-symbols-outlined text-[18px]!" aria-hidden="true">
              check_circle
            </span>
            Reembolso del saldo restante.
          </li>
        </ul>
      </section>

      <Button
        variant="danger"
        className="bg-primary hover:bg-[#a34400]"
        disabled={!canConfirm || isConfirming}
        onClick={onConfirm}
      >
        <span className="material-symbols-outlined" aria-hidden="true">
          delete
        </span>
        {isConfirming ? 'Cancelando…' : 'Confirmar cancelación'}
      </Button>

      <Button variant="secondary" onClick={onBack}>
        Volver
      </Button>
    </div>
  );
};
