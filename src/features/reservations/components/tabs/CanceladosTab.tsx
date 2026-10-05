import { useNavigate } from 'react-router';
import { EstadoLista, SinReservas } from '@/features/reservations/components/EstadoLista';
import { FlightCard } from '@/features/reservations/components/FlightCard';
import { useReservations } from '@/features/reservations/hooks/useReservations';

export const CanceladosTab = () => {
  const navigate = useNavigate();
  const { cancelled, isLoading, error, recargar } = useReservations();

  return (
    <div className="flex flex-col">
      <h2 className="text-secondary mb-5 text-xl font-extrabold">Viajes cancelados</h2>

      <EstadoLista isLoading={isLoading} error={error} onRetry={recargar}>
        {cancelled.length === 0 ? (
          <SinReservas>No tenés viajes cancelados.</SinReservas>
        ) : (
          cancelled.map((flight) => (
            <FlightCard key={flight.id} flight={flight} onRepurchase={() => navigate('/')} />
          ))
        )}
      </EstadoLista>
    </div>
  );
};
