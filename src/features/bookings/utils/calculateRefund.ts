import type { CancellableReservation, FareType, RefundBreakdown } from '../bookings.types';

const PENALTY_BY_FARE: Record<FareType, number> = {
  Flex: 0.1,
  Classic: 0.3,
  Promo: 1,
};

export const getPenaltyRate = (fare: FareType) => PENALTY_BY_FARE[fare];

export const calculateRefund = (reservation: CancellableReservation): RefundBreakdown => {
  const penalty = reservation.farePaid * getPenaltyRate(reservation.fare);

  return {
    farePaid: reservation.farePaid,
    taxes: reservation.taxes,
    penalty,
    total: reservation.farePaid + reservation.taxes - penalty,
  };
};
