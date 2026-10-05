import { Link } from 'react-router';
import { EstadoLista, SinReservas } from '@/features/reservations/components/EstadoLista';
import { FlightCard } from '@/features/reservations/components/FlightCard';
import { useReservations } from '@/features/reservations/hooks/useReservations';

export const ProximosTab = () => {
  const { upcoming, isLoading, error, recargar } = useReservations();

  return (
    <div className="flex flex-col">
      <h2 className="text-secondary mb-5 text-xl font-extrabold">Próximos viajes</h2>

      <EstadoLista isLoading={isLoading} error={error} onRetry={recargar}>
        {upcoming.length === 0 ? (
          <SinReservas>
            No tenés próximos viajes reservados.{' '}
            <Link to="/" className="text-primary font-bold hover:underline">
              Buscá tu próximo viaje
            </Link>
          </SinReservas>
        ) : (
          upcoming.map((flight) => <FlightCard key={flight.id} flight={flight} />)
        )}
      </EstadoLista>
    </div>
  );
};
