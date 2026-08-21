import { useMemo, useState } from 'react';
import type { CancelReason } from '../bookings.types';
import { findReservation } from '../data/reservationMock';
import { calculateRefund } from '../utils/calculateRefund';

export const useCancelFlight = (reservationId?: string) => {
  const reservation = useMemo(() => findReservation(reservationId), [reservationId]);

  const [reason, setReason] = useState<CancelReason | null>(null);
  const [comment, setComment] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const refund = useMemo(() => (reservation ? calculateRefund(reservation) : null), [reservation]);

  const alreadyCancelled = reservation?.status === 'CANCELLED';
  const notFound = !reservation || alreadyCancelled;

  const canConfirm = reason !== null && (reason !== 'OTHER' || comment.trim().length > 0);

  const confirm = async () => {
    if (!canConfirm || isConfirming || notFound) return;

    setIsConfirming(true);
    // Punto de integración con el backend: acá irá el POST de cancelación.
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsConfirming(false);
    setIsConfirmed(true);
  };

  return {
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
  };
};
