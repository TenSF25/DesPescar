import { FlightCard } from '../FlightCard';
import { upcomingFlights } from '../../data/upcomingFlights';

export const ProximosTab = () => {
  const handleManage = (id: string) => {
    // TODO: navegar a la sub-tab "Gestionar" del vuelo `id` cuando esté implementada
    console.log('Gestionar viaje', id);
  };

  const handleViewDetails = (id: string) => {
    // TODO: navegar a la sub-tab "Detalles" del vuelo `id` cuando esté implementada
    console.log('Ver detalles', id);
  };

  const handleCancel = (id: string) => {
    // TODO: navegar a la sub-tab "Cancelar" del vuelo `id` cuando esté implementada
    console.log('Cancelar', id);
  };

  return (
    <div className="flex flex-col">
      <h2 className="text-secondary mb-5 text-xl font-extrabold">Próximos viajes</h2>

      {upcomingFlights.length === 0 ? (
        <div className="text-neutral rounded-2xl border border-dashed border-gray-200 p-10 text-center text-sm">
          No tenés próximos viajes reservados.
        </div>
      ) : (
        upcomingFlights.map((flight) => (
          <FlightCard
            key={flight.id}
            flight={flight}
            onManage={handleManage}
            onViewDetails={handleViewDetails}
            onCancel={handleCancel}
          />
        ))
      )}
    </div>
  );
};
