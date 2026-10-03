import { Badge, DetailList, Modal } from '@/components/admin';
import { Button } from '@/components/ui/Button';
import type { HotelReservation } from '../../shared/hotel.types';
import { RESERVATION_STATUS_TONE, formatHotelDate, formatUsd } from '../../shared/hotel.utils';

interface ReservationDetailModalProps {
  reservation: HotelReservation | null;
  onClose: () => void;
}

export const ReservationDetailModal = ({ reservation, onClose }: ReservationDetailModalProps) => {
  return (
    <Modal
      open={reservation !== null}
      onClose={onClose}
      title={reservation ? `Reserva ${reservation.codigo}` : ''}
      description="Detalle de la reserva."
    >
      {reservation && (
        <>
          <DetailList
            items={[
              { label: 'Huésped', value: reservation.huesped },
              { label: 'Email', value: reservation.email },
              { label: 'Teléfono', value: reservation.telefono },
              { label: 'Habitación', value: reservation.habitacion },
              { label: 'Check-in', value: formatHotelDate(reservation.checkIn) },
              { label: 'Check-out', value: formatHotelDate(reservation.checkOut) },
              { label: 'Noches', value: reservation.noches },
              { label: 'Total', value: formatUsd(reservation.total) },
              {
                label: 'Estado',
                value: (
                  <Badge tone={RESERVATION_STATUS_TONE[reservation.estado]}>
                    {reservation.estado}
                  </Badge>
                ),
              },
              { label: 'Reservada el', value: formatHotelDate(reservation.creadaEl) },
            ]}
          />
          <Button variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
        </>
      )}
    </Modal>
  );
};
