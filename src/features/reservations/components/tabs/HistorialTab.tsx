import { useNavigate } from 'react-router';
import { EstadoLista, SinReservas } from '@/features/reservations/components/EstadoLista';
import { FlightCard } from '@/features/reservations/components/FlightCard';
import { HistorySummaryCard } from '@/features/reservations/components/HistorySummaryCard';
import { useReservations } from '@/features/reservations/hooks/useReservations';

export const HistorialTab = () => {
  const navigate = useNavigate();
  const { history, isLoading, error, recargar } = useReservations();
  const destinos = new Set(
    history.flatMap((r) => [r.destination?.city, ...r.hotels.map((h) => h.city)]).filter(Boolean),
  );

  return (
    <div className="flex flex-col">
      <EstadoLista isLoading={isLoading} error={error} onRetry={recargar}>
        <div className="mb-7 flex flex-wrap gap-4">
          <HistorySummaryCard icon="✈️" value={history.length} label="Viajes realizados" />
          <HistorySummaryCard icon="🌍" value={destinos.size} label="Destinos visitados" />
        </div>

        <h2 className="text-secondary mb-5 text-xl font-extrabold">Historial de viajes</h2>

        {history.length === 0 ? (
          <SinReservas>Todavía no tenés viajes en tu historial.</SinReservas>
        ) : (
          history.map((flight) => (
            <FlightCard key={flight.id} flight={flight} onRepurchase={() => navigate('/')} />
          ))
        )}
      </EstadoLista>
    </div>
  );
};
