import { FlightCard } from '@/features/reservations/components/FlightCard';
import { useReservations } from '@/features/reservations/hooks/useReservations';

export const CanceladosTab = () => {
  const { cancelled: cancelledFlights } = useReservations();

  const handleRepurchase = (id: string) => {
    // TODO: iniciar una búsqueda/compra nueva con la misma ruta que el vuelo `id`
    console.log('Reservar de nuevo', id);
  };

  return (
    <div className="flex flex-col">
      <h2 className="text-secondary mb-5 text-xl font-extrabold">Viajes cancelados</h2>

      {cancelledFlights.length === 0 ? (
        <div className="text-neutral rounded-2xl border border-dashed border-gray-200 p-10 text-center text-sm">
          No tenés viajes cancelados.
        </div>
      ) : (
        cancelledFlights.map((flight) => (
          <FlightCard key={flight.id} flight={flight} onRepurchase={handleRepurchase} />
        ))
      )}
    </div>
  );
};
