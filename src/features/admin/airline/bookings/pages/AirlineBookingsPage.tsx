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
import { useBookingsPage } from '../hooks/useBookingsPage';
import type { AdminBooking } from '../admin-bookings.types';
import { BOOKING_STATUS_TONE } from '../booking.utils';
import { BookingDetailModal } from '../components/BookingDetailModal';

export const AirlineBookingsPage = () => {
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
    paginatedBookings,
    totalFiltered,
    pageSize,
    bookingToView,
    openViewBooking,
    closeViewBooking,
    bookingToCancel,
    askCancelBooking,
    closeCancelBooking,
    isUpdating,
    handleConfirmBooking,
    handleConfirmCancel,
  } = useBookingsPage();

  const menuActionsFor = (booking: AdminBooking): ActionsMenuAction[] => [
    ...(booking.estado === 'Pendiente'
      ? [
          {
            label: 'Confirmar reserva',
            icon: 'check_circle',
            onClick: () => handleConfirmBooking(booking),
          },
        ]
      : []),
    ...(booking.estado !== 'Cancelada'
      ? [
          {
            label: 'Cancelar reserva',
            icon: 'cancel',
            tone: 'danger' as const,
            onClick: () => askCancelBooking(booking),
          },
        ]
      : []),
  ];

  const columns: TableColumn<AdminBooking>[] = [
    {
      key: 'codigo',
      header: 'Reserva',
      render: (booking) => (
        <div className="flex flex-col">
          <span className="font-semibold">{booking.codigo}</span>
          <span className="text-xs text-[#44474E]">{booking.numeroVuelo}</span>
        </div>
      ),
    },
    {
      key: 'pasajero',
      header: 'Pasajero',
      render: (booking) => (
        <div className="flex flex-col">
          <span className="font-semibold">{booking.pasajero}</span>
          <span className="text-xs text-[#44474E]">{booking.email}</span>
        </div>
      ),
    },
    { key: 'ruta', header: 'Ruta' },
    { key: 'fecha', header: 'Fecha' },
    {
      key: 'estado',
      header: 'Estado',
      render: (booking) => (
        <Badge tone={BOOKING_STATUS_TONE[booking.estado]}>{booking.estado}</Badge>
      ),
    },
    {
      key: 'monto',
      header: 'Monto',
      render: (booking) => `USD ${booking.monto}`,
    },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (booking) => (
        <ActionsMenu
          onView={() => openViewBooking(booking)}
          menuActions={menuActionsFor(booking)}
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Reservas"
        description="Administra las reservas de los vuelos de tu aerolínea."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard
          icon="confirmation_number"
          iconClassName="bg-primary/10 text-primary"
          label="Reservas totales"
          value={stats?.reservasTotales ?? '—'}
        />
        <StatCard
          icon="check_circle"
          iconClassName="bg-green-100 text-green-600"
          label="Confirmadas"
          value={stats?.confirmadas ?? '—'}
        />
        <StatCard
          icon="hourglass_empty"
          iconClassName="bg-amber-100 text-amber-600"
          label="Pendientes"
          value={stats?.pendientes ?? '—'}
        />
        <StatCard
          icon="cancel"
          iconClassName="bg-red-100 text-alert"
          label="Canceladas"
          value={stats?.canceladas ?? '—'}
        />
        <StatCard
          icon="payments"
          iconClassName="bg-blue-100 text-blue-600"
          label="Ingresos totales"
          value={stats ? formatCompactCurrency(stats.ingresosTotales) : '—'}
        />
      </div>

      <div className="flex flex-col gap-4">
        <SearchFilterBar
          searchValue={search}
          onSearchChange={onSearchChange}
          placeholder="Buscar por código, pasajero o vuelo..."
        >
          <Select
            value={estadoFilter}
            onChange={(e) => onEstadoFilterChange(e.target.value)}
            containerClassName="w-full md:w-44"
          >
            <option value="todos">Estado: Todos</option>
            <option value="Confirmada">Confirmada</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Cancelada">Cancelada</option>
          </Select>
        </SearchFilterBar>

        <DataTable
          columns={columns}
          data={paginatedBookings}
          keyExtractor={(booking) => booking.id}
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

      <BookingDetailModal booking={bookingToView} onClose={closeViewBooking} />

      <ConfirmDialog
        open={bookingToCancel !== null}
        title="¿Cancelar esta reserva?"
        description={
          bookingToCancel
            ? `La reserva ${bookingToCancel.codigo} de ${bookingToCancel.pasajero} (${bookingToCancel.ruta}) pasará a estado Cancelada.`
            : undefined
        }
        confirmLabel="Cancelar reserva"
        cancelLabel="Volver"
        loading={isUpdating}
        onConfirm={handleConfirmCancel}
        onCancel={closeCancelBooking}
      />
    </div>
  );
};
