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
} from '@/components/admin';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Button } from '@/components/ui/Button';
import { useFlightsPage } from '../hooks/useFlightsPage';
import { FlightFormModal } from '../components/FlightFormModal';
import { FlightDetailModal } from '../components/FlightDetailModal';
import { FLIGHT_STATUS_TONE, formatFlightDate } from '../flights.utils';
import type { AdminFlight } from '../admin-flights.types';

export const AirlineFlightsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // El estado del acceso rápido se usa una sola vez: se limpia para que recargar no reabra el modal.
  useEffect(() => {
    if (location.state?.openAddFlight) navigate(location.pathname, { replace: true, state: null });
  }, [location, navigate]);
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
    flightToView,
    openViewFlight,
    closeViewFlight,
    flightToEdit,
    openEditFlight,
    closeEditFlight,
    isUpdating,
    handleUpdateFlight,
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
  } = useFlightsPage(Boolean(location.state?.openAddFlight));

  const columns: TableColumn<AdminFlight>[] = [
    { key: 'numero', header: 'Número de vuelo', className: 'font-semibold' },
    { key: 'origen', header: 'Origen' },
    { key: 'destino', header: 'Destino' },
    {
      key: 'fecha',
      header: 'Fecha',
      render: (flight) => formatFlightDate(flight.fecha),
    },
    { key: 'hora', header: 'Hora' },
    {
      key: 'estado',
      header: 'Estado',
      render: (flight) => <Badge tone={FLIGHT_STATUS_TONE[flight.estado]}>{flight.estado}</Badge>,
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
          onView={() => openViewFlight(flight)}
          onEdit={() => openEditFlight(flight)}
          onDelete={() => askDeleteFlight(flight)}
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Gestión de Vuelos"
        description="Administra y monitorea los vuelos de tu aerolínea."
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

      <FlightFormModal
        key="new"
        open={isAddModalOpen}
        onClose={closeAddModal}
        onSubmit={handleCreateFlight}
        isSaving={isSaving}
      />

      <FlightFormModal
        key={flightToEdit?.id ?? 'edit'}
        open={flightToEdit !== null}
        flight={flightToEdit}
        onClose={closeEditFlight}
        onSubmit={handleUpdateFlight}
        isSaving={isUpdating}
      />

      <FlightDetailModal flight={flightToView} onClose={closeViewFlight} onEdit={openEditFlight} />

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
