import { Notice } from '../../../../components/ui/Notice';
import { formatCurrency } from '../../../../utils/formatCurrency';
import type { CancellableReservation, RefundBreakdown } from '../../bookings.types';

interface RefundSummaryProps {
  reservation: CancellableReservation;
  refund: RefundBreakdown;
}

export const RefundSummary = ({ reservation, refund }: RefundSummaryProps) => {
  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-black/10 p-5">
      <h2 className="text-secondary flex flex-row items-center gap-2 font-bold">
        <span className="material-symbols-outlined" aria-hidden="true">
          paid
        </span>
        Reembolso estimado
      </h2>

      <dl className="flex flex-col gap-2 text-[14px]">
        <div className="flex flex-row justify-between gap-4">
          <dt>Tarifa pagada ({reservation.passengers} pasajeros)</dt>
          <dd className="font-semibold">{formatCurrency(refund.farePaid)}</dd>
        </div>
        <div className="flex flex-row justify-between gap-4">
          <dt>Cargos y tasas</dt>
          <dd className="font-semibold">{formatCurrency(refund.taxes)}</dd>
        </div>
        <div className="flex flex-row justify-between gap-4">
          <dt>
            Penalización por cancelación{' '}
            <span className="text-primary">(según tarifa {reservation.fare})</span>
          </dt>
          <dd className="text-alert font-semibold">- {formatCurrency(refund.penalty)}</dd>
        </div>
      </dl>

      <hr className="text-black/10" />

      <div className="flex flex-row items-center justify-between gap-4">
        <h3 className="text-secondary font-bold">Monto a reembolsar</h3>
        <p className="text-primary text-2xl font-bold">{formatCurrency(refund.total)}</p>
      </div>

      <Notice variant="info" icon="info">
        El reembolso se realizará en el mismo método de pago dentro de 5 a 7 días hábiles.
      </Notice>
    </section>
  );
};
