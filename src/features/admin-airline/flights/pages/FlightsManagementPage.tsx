import {
  PageHeader,
  StatCard,
  SearchFilterBar,
  Select,
  DataTable,
  Badge,
  ActionsMenu,
  Pagination,
  ConfirmDialog,
  type TableColumn,
  type BadgeTone,
} from '../../../../components/admin';
import { Button } from '../../../../components/ui/Button';
import { useFlightsPage } from '../hooks/useFlightsPage';
import { AddFlightModal } from '../components/AddFlightModal';
import type { AdminFlight, FlightStatus } from '../admin-flights.types';

const ESTADO_TONE: Record<FlightStatus, BadgeTone> = {
  Programado: 'warning',
  'En curso': 'info',
  Completado: 'success',
  Cancelado: 'danger',
};

export const FlightsManagementPage = () => {
  const {
    isLoading,
    stats,
    search,
    onSearchChange,
    estadoFilter,
    onEstadoFilterChange,
    origenFilter,
    onOrigenFilterChange,
    origenOptions,
    page,
    setPage,
    totalPages,
    paginatedFlights,
    totalFiltered,
    pageSize,
    isAddModalOpen,
    openAddModal,
    closeAddModal,
    isSaving,
    handleCreateFlight,
    flightToDelete,
    askDeleteFlight,
    cancelDeleteFlight,
    isDeleting,
    handleConfirmDelete,
  } = useFlightsPage();

  const columns: TableColumn<AdminFlight>[] = [
    { key: 'numero', header: 'Número de vuelo', className: 'font-semibold' },
    { key: 'origen', header: 'Origen' },
    { key: 'destino', header: 'Destino' },
    { key: 'fecha', header: 'Fecha' },
    { key: 'hora', header: 'Hora' },
    {
      key: 'estado',
      header: 'Estado',
      render: (flight) => <Badge tone={ESTADO_TONE[flight.estado]}>{flight.estado}</Badge>,
    },
    {
      key: 'precioProm',
      header: 'Precio prom.',
      render: (flight) => `USD ${flight.precioProm}`,
    },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (flight) => (
        <ActionsMenu
          onView={() => console.log('ver vuelo', flight.id)}
          onEdit={() => console.log('editar vuelo', flight.id)}
          onDelete={() => askDeleteFlight(flight)}
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Gestión de Vuelos"
        description="Administra y monitorea todos los vuelos de la plataforma."
        actions={
          <Button variant="primary" className="w-auto px-4" onClick={openAddModal}>
            <span className="material-symbols-outlined text-[18px]">add</span>
            Agregar nuevo vuelo
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon="flight"
          iconClassName="bg-blue-100 text-blue-600"
          label="Vuelos totales"
          value={stats?.vuelosTotales ?? '—'}
          trendValue={stats ? `${stats.vuelosEnCurso} en curso` : undefined}
          trendDirection="up"
        />
        <StatCard
          icon="check_circle"
          iconClassName="bg-green-100 text-green-600"
          label="Vuelos completados"
          value={stats?.completados ?? '—'}
          trendValue={stats ? `${stats.completadosDeltaPct}% vs mes anterior` : undefined}
          trendDirection="up"
        />
        <StatCard
          icon="schedule"
          iconClassName="bg-amber-100 text-amber-600"
          label="Vuelos programados"
          value={stats?.programados ?? '—'}
          caption="Próximos 7 días"
        />
        <StatCard
          icon="cancel"
          iconClassName="bg-purple-100 text-purple-600"
          label="Vuelos cancelados"
          value={stats?.cancelados ?? '—'}
          trendValue={stats ? `${Math.abs(stats.canceladosDeltaPct)}% vs mes anterior` : undefined}
          trendDirection="down"
        />
      </div>

      <div className="flex flex-col gap-4">
        <SearchFilterBar
          searchValue={search}
          onSearchChange={onSearchChange}
          placeholder="Buscar vuelo, destino o número..."
        >
          <Select
            value={estadoFilter}
            onChange={(e) => onEstadoFilterChange(e.target.value)}
            containerClassName="w-full md:w-44"
          >
            <option value="todos">Estado: Todos</option>
            <option value="Programado">Programado</option>
            <option value="En curso">En curso</option>
            <option value="Completado">Completado</option>
            <option value="Cancelado">Cancelado</option>
          </Select>
          <Select
            value={origenFilter}
            onChange={(e) => onOrigenFilterChange(e.target.value)}
            containerClassName="w-full md:w-44"
          >
            <option value="todos">Origen: Todos</option>
            {origenOptions.map((origen) => (
              <option key={origen} value={origen}>
                {origen}
              </option>
            ))}
          </Select>
        </SearchFilterBar>

        <DataTable
          columns={columns}
          data={paginatedFlights}
          keyExtractor={(flight) => flight.id}
          emptyMessage={isLoading ? 'Cargando vuelos...' : 'No se encontraron vuelos.'}
        />

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          totalItems={totalFiltered}
          itemsPerPage={pageSize}
          itemLabel="vuelos"
        />
      </div>

      <AddFlightModal
        open={isAddModalOpen}
        onClose={closeAddModal}
        onSubmit={handleCreateFlight}
        isSaving={isSaving}
      />

      <ConfirmDialog
        open={flightToDelete !== null}
        title="¿Eliminar este vuelo?"
        description={
          flightToDelete
            ? `El vuelo ${flightToDelete.numero} (${flightToDelete.origen} → ${flightToDelete.destino}) se eliminará del cronograma de vuelos.`
            : undefined
        }
        confirmLabel="Eliminar"
        loading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={cancelDeleteFlight}
      />
    </div>
  );
};
