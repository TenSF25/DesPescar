import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Notice } from '../../../components/ui/Notice';
import { CancelBanner } from '../components/cancel/CancelBanner';
import { CancelReasonForm } from '../components/cancel/CancelReasonForm';
import { ConfirmCancelModal } from '../components/cancel/ConfirmCancelModal';
import { FlightDetailsCard } from '../components/cancel/FlightDetailsCard';
import { NextStepsAside } from '../components/cancel/NextStepsAside';
import { RefundSummary } from '../components/cancel/RefundSummary';
import { useCancelFlight } from '../hooks/useCancelFlight';

export const CancelFlightPage = () => {
  const { reservationId } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    reservation,
    refund,
    notFound,
    alreadyCancelled,
    reason,
    setReason,
    comment,
    setComment,
    canConfirm,
    isConfirming,
    isConfirmed,
    confirm,
  } = useCancelFlight(reservationId);

  const goToReservations = () => navigate('/cuenta/reservas');

  if (notFound || !reservation || !refund) {
    return (
      <div className="flex flex-col gap-4 rounded-2xl border border-black/10 p-8">
        <h1 className="text-secondary text-2xl font-bold">
          {alreadyCancelled ? 'Esta reserva ya fue cancelada' : 'No encontramos esta reserva'}
        </h1>
        <p className="text-neutral text-[14px]">
          Revisá el listado de tus reservas para continuar.
        </p>
        <Button variant="secondary" className="w-full md:w-60" onClick={goToReservations}>
          Volver a mis reservas
        </Button>
      </div>
    );
  }

  const handleConfirm = async () => {
    await confirm();
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <CancelBanner variant={isConfirmed ? 'success' : 'form'} onBack={goToReservations} />

      {isConfirmed ? (
        <Notice variant="success" icon="mail">
          <p>
            Te enviamos los detalles de la cancelación a{' '}
            <span className="font-semibold">{reservation.contactEmail}</span>
          </p>
          <p>Revisá tu bandeja de entrada (y spam).</p>
        </Notice>
      ) : (
        <Notice variant="warning" icon="warning">
          <p>Al cancelar tu vuelo, se aplicarán las políticas de la tarifa adquirida.</p>
          <p>No podrás revertir esta acción.</p>
        </Notice>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-4">
          <FlightDetailsCard
            reservation={reservation}
            title={isConfirmed ? 'Detalles de la cancelación' : 'Detalles del vuelo'}
          />
          <RefundSummary reservation={reservation} refund={refund} />
          <Notice variant="success" icon="verified" title="Información importante">
            {isConfirmed
              ? 'Guardá el comprobante que te enviamos por email para cualquier consulta sobre el reembolso.'
              : 'Una vez confirmada la cancelación, recibirás un email con el comprobante y los detalles del reembolso.'}
          </Notice>
        </div>

        {isConfirmed ? (
          <NextStepsAside />
        ) : (
          <CancelReasonForm
            fare={reservation.fare}
            reason={reason}
            onReasonChange={setReason}
            comment={comment}
            onCommentChange={setComment}
            canConfirm={canConfirm}
            isConfirming={isConfirming}
            onConfirm={() => setIsModalOpen(true)}
            onBack={goToReservations}
          />
        )}
      </div>

      <ConfirmCancelModal
        open={isModalOpen}
        isConfirming={isConfirming}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
      />
    </div>
  );
};
