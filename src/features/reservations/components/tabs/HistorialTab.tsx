import { FlightCard } from '@/features/reservations/components/FlightCard';
import { HistorySummaryCard } from '@/features/reservations/components/HistorySummaryCard';
import { useReservations } from '@/features/reservations/hooks/useReservations';

export const HistorialTab = () => {
  const { history: historyFlights } = useReservations();

  const handleRepurchase = (id: string) => {
    // TODO: iniciar una búsqueda/compra nueva con la misma ruta que el vuelo `id`
    console.log('Repetir viaje', id);
  };

  const handleDownloadInvoice = (id: string) => {
    // TODO: descargar la factura del vuelo `id` cuando exista backend
    console.log('Descargar factura', id);
  };

  return (
    <div className="flex flex-col">
      <div className="mb-7 flex flex-wrap gap-4">
        <HistorySummaryCard icon="✈️" value={12} label="Vuelos realizados" />
        <HistorySummaryCard icon="🌍" value={8} label="Destinos visitados" />
        <HistorySummaryCard icon="⭐" value="4.6" label="Valoración media" />
      </div>

      <h2 className="text-secondary mb-5 text-xl font-extrabold">Historial de viajes</h2>

      {historyFlights.length === 0 ? (
        <div className="text-neutral rounded-2xl border border-dashed border-gray-200 p-10 text-center text-sm">
          Todavía no tenés viajes en tu historial.
        </div>
      ) : (
        historyFlights.map((flight) => (
          <FlightCard
            key={flight.id}
            flight={flight}
            onRepurchase={handleRepurchase}
            onDownloadInvoice={handleDownloadInvoice}
          />
        ))
      )}
    </div>
  );
};
