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
  type ActionsMenuAction,
  type TableColumn,
} from '@/components/admin';
import { formatCompactCurrency } from '@/utils/formatCompactCurrency';
import type { HotelReservation } from '../../shared/hotel.types';
import { RESERVATION_STATUS_TONE, formatHotelDate, formatUsd } from '../../shared/hotel.utils';
import { ReservationDetailModal } from '../components/ReservationDetailModal';
import { useReservationsPage } from '../hooks/useReservationsPage';

export const HotelReservationsPage = () => {
  const {
    isLoading,
    stats,
    search,
    onSearchChange,
    estadoFilter,
    onEstadoFilterChange,
    page,
    setPage,
    totalPages,
    paginatedReservations,
    totalFiltered,
    pageSize,
    reservationToView,
    openViewReservation,
    closeViewReservation,
    reservationToCancel,
    askCancelReservation,
    closeCancelReservation,
    isUpdating,
    handleCheckIn,
    handleCheckOut,
    handleConfirmCancel,
  } = useReservationsPage();

  const menuActionsFor = (reservation: HotelReservation): ActionsMenuAction[] => [
    ...(reservation.estado === 'Próxima'
      ? [
          {
            label: 'Registrar check-in',
            icon: 'login',
            onClick: () => handleCheckIn(reservation),
          },
        ]
      : []),
    ...(reservation.estado === 'En estadía'
      ? [
          {
            label: 'Registrar check-out',
            icon: 'logout',
            onClick: () => handleCheckOut(reservation),
          },
        ]
      : []),
    {
      label: 'Contactar huésped',
      icon: 'mail',
      onClick: () => window.open(`mailto:${reservation.email}`),
    },
    ...(reservation.estado === 'Próxima' || reservation.estado === 'En estadía'
      ? [
          {
            label: 'Cancelar reserva',
            icon: 'cancel',
            tone: 'danger' as const,
            onClick: () => askCancelReservation(reservation),
          },
        ]
      : []),
  ];

  const columns: TableColumn<HotelReservation>[] = [
    {
      key: 'codigo',
      header: 'Reserva',
      render: (reservation) => (
        <div className="flex flex-col">
          <span className="font-semibold">{reservation.codigo}</span>
          <span className="text-xs text-[#44474E]">{reservation.habitacion}</span>
        </div>
      ),
    },
    {
      key: 'huesped',
      header: 'Huésped',
      render: (reservation) => (
        <div className="flex flex-col">
          <span className="font-semibold">{reservation.huesped}</span>
          <span className="text-xs text-[#44474E]">{reservation.email}</span>
        </div>
      ),
    },
    {
      key: 'fechas',
      header: 'Check-in → Check-out',
      render: (reservation) =>
        `${formatHotelDate(reservation.checkIn)} → ${formatHotelDate(reservation.checkOut)}`,
    },
    { key: 'noches', header: 'Noches' },
    { key: 'total', header: 'Total', render: (reservation) => formatUsd(reservation.total) },
    {
      key: 'estado',
      header: 'Estado',
      render: (reservation) => (
        <Badge tone={RESERVATION_STATUS_TONE[reservation.estado]}>{reservation.estado}</Badge>
      ),
    },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (reservation) => (
        <ActionsMenu
          onView={() => openViewReservation(reservation)}
          menuActions={menuActionsFor(reservation)}
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Reservas"
        description="Administra las reservas de tu hotel: check-in, check-out y cancelaciones."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          icon="confirmation_number"
          iconClassName="bg-primary/10 text-primary"
          label="Reservas totales"
          value={stats.total}
        />
        <StatCard
          icon="event_upcoming"
          iconClassName="bg-blue-100 text-blue-600"
          label="Próximas"
          value={stats.proximas}
        />
        <StatCard
          icon="hotel"
          iconClassName="bg-amber-100 text-amber-600"
          label="En estadía"
          value={stats.enEstadia}
        />
        <StatCard
          icon="task_alt"
          iconClassName="bg-green-100 text-green-600"
          label="Completadas"
          value={stats.completadas}
        />
        <StatCard
          icon="cancel"
          iconClassName="bg-red-100 text-alert"
          label="Canceladas"
          value={stats.canceladas}
        />
        <StatCard
          icon="payments"
          iconClassName="bg-orange-100 text-orange-600"
          label="Ingresos totales"
          value={formatCompactCurrency(stats.ingresos)}
        />
      </div>

      <div className="flex flex-col gap-4">
        <SearchFilterBar
          searchValue={search}
          onSearchChange={onSearchChange}
          placeholder="Buscar por código, huésped o email..."
        >
          <Select
            value={estadoFilter}
            onChange={(e) => onEstadoFilterChange(e.target.value)}
            containerClassName="w-full md:w-44"
          >
            <option value="todos">Estado: Todos</option>
            <option value="Próxima">Próxima</option>
            <option value="En estadía">En estadía</option>
            <option value="Completada">Completada</option>
            <option value="Cancelada">Cancelada</option>
          </Select>
        </SearchFilterBar>

        <DataTable
          columns={columns}
          data={paginatedReservations}
          keyExtractor={(reservation) => reservation.id}
          emptyMessage={isLoading ? 'Cargando reservas...' : 'No se encontraron reservas.'}
        />

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          totalItems={totalFiltered}
          itemsPerPage={pageSize}
          itemLabel="reservas"
        />
      </div>

      <ReservationDetailModal reservation={reservationToView} onClose={closeViewReservation} />

      <ConfirmDialog
        open={reservationToCancel !== null}
        title="¿Cancelar esta reserva?"
        description={
          reservationToCancel
            ? `La reserva ${reservationToCancel.codigo} de ${reservationToCancel.huesped} (${reservationToCancel.habitacion}) pasará a estado Cancelada.`
            : undefined
        }
        confirmLabel="Cancelar reserva"
        cancelLabel="Volver"
        loading={isUpdating}
        onConfirm={handleConfirmCancel}
        onCancel={closeCancelReservation}
      />
    </div>
  );
};
