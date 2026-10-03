import { FlightCard } from '@/features/reservations/components/FlightCard';
import { useReservations } from '@/features/reservations/hooks/useReservations';

export const ProximosTab = () => {
  const { upcoming: upcomingFlights } = useReservations();

  return (
    <div className="flex flex-col">
      <h2 className="text-secondary mb-5 text-xl font-extrabold">Próximos viajes</h2>

      {upcomingFlights.length === 0 ? (
        <div className="text-neutral rounded-2xl border border-dashed border-gray-200 p-10 text-center text-sm">
          No tenés próximos viajes reservados.
        </div>
      ) : (
        upcomingFlights.map((flight) => <FlightCard key={flight.id} flight={flight} />)
      )}
    </div>
  );
};
