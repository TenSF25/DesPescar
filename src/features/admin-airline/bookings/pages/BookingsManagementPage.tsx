import {
  PageHeader,
  StatCard,
  SearchFilterBar,
  Select,
  DataTable,
  Badge,
  ActionsMenu,
  Pagination,
  type TableColumn,
  type BadgeTone,
} from '../../../../components/admin';
import { formatCompactCurrency } from '../../../../utils/formatCompactCurrency';
import { useBookingsPage } from '../hooks/useBookingsPage';
import type { AdminBooking, BookingStatus } from '../admin-bookings.types';

const ESTADO_TONE: Record<BookingStatus, BadgeTone> = {
  Confirmada: 'success',
  Pendiente: 'warning',
  Cancelada: 'danger',
};

export const BookingsManagementPage = () => {
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
  } = useBookingsPage();

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
      render: (booking) => <Badge tone={ESTADO_TONE[booking.estado]}>{booking.estado}</Badge>,
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
          onView={() => console.log('ver reserva', booking.id)}
          onMore={() => console.log('mas opciones', booking.id)}
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Reservas"
        description="Administra las reservas realizadas en la plataforma."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
    </div>
  );
};
