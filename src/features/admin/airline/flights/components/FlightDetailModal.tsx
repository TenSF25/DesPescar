import { Badge, DetailList, Modal } from '@/components/admin';
import { Button } from '@/components/ui/Button';
import type { AdminFlight } from '../admin-flights.types';
import { FLIGHT_STATUS_TONE, formatFlightDate } from '../flights.utils';

interface FlightDetailModalProps {
  flight: AdminFlight | null;
  onClose: () => void;
  onEdit: (flight: AdminFlight) => void;
}

export const FlightDetailModal = ({ flight, onClose, onEdit }: FlightDetailModalProps) => {
  return (
    <Modal
      open={flight !== null}
      onClose={onClose}
      title={flight ? `Vuelo ${flight.numero}` : ''}
      description="Detalle del vuelo en el cronograma."
    >
      {flight && (
        <>
          <DetailList
            items={[
              { label: 'Origen', value: flight.origen },
              { label: 'Destino', value: flight.destino },
              { label: 'Fecha', value: formatFlightDate(flight.fecha) },
              { label: 'Hora', value: flight.hora },
              {
                label: 'Estado',
                value: <Badge tone={FLIGHT_STATUS_TONE[flight.estado]}>{flight.estado}</Badge>,
              },
              { label: 'Precio promedio', value: `USD ${flight.precioProm}` },
            ]}
          />
          <div className="flex gap-3">
            <Button variant="secondary" onClick={onClose}>
              Cerrar
            </Button>
            <Button variant="primary" onClick={() => onEdit(flight)}>
              <span className="material-symbols-outlined text-[18px]">edit</span>
              Editar
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
};
