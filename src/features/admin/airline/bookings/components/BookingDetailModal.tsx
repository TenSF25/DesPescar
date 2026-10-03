import { Badge, DetailList, Modal } from '@/components/admin';
import { Button } from '@/components/ui/Button';
import type { AdminBooking } from '../admin-bookings.types';
import { BOOKING_STATUS_TONE } from '../booking.utils';

interface BookingDetailModalProps {
  booking: AdminBooking | null;
  onClose: () => void;
}

export const BookingDetailModal = ({ booking, onClose }: BookingDetailModalProps) => {
  return (
    <Modal
      open={booking !== null}
      onClose={onClose}
      title={booking ? `Reserva ${booking.codigo}` : ''}
      description="Detalle de la reserva."
    >
      {booking && (
        <>
          <DetailList
            items={[
              { label: 'Pasajero', value: booking.pasajero },
              { label: 'Email', value: booking.email },
              { label: 'Vuelo', value: booking.numeroVuelo },
              { label: 'Ruta', value: booking.ruta },
              { label: 'Fecha', value: booking.fecha },
              {
                label: 'Estado',
                value: <Badge tone={BOOKING_STATUS_TONE[booking.estado]}>{booking.estado}</Badge>,
              },
              { label: 'Monto', value: `USD ${booking.monto}` },
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
