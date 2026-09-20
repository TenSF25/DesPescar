import {
  PageHeader,
  StatCard,
  SearchFilterBar,
  Select,
  DataTable,
  Badge,
  ActionsMenu,
  Pagination,
  ChartCard,
  DonutChart,
  ActivityListItem,
  type TableColumn,
} from '../../../../components/admin';
import { formatCompactCurrency } from '../../../../utils/formatCompactCurrency';
import { useUsersPage } from '../hooks/useUsersPage';
import type { AdminUser } from '../admin-users.types';

const ROLE_COLORS: Record<string, string> = {
  Admin: '#1f3051',
  Cliente: '#c85300',
  Soporte: '#3457a6',
};

const columns: TableColumn<AdminUser>[] = [
  {
    key: 'nombre',
    header: 'Nombre / Email',
    render: (user) => (
      <div className="flex flex-col">
        <span className="font-semibold">{user.nombre}</span>
        <span className="text-xs text-[#44474E]">{user.email}</span>
      </div>
    ),
  },
  {
    key: 'rol',
    header: 'Rol',
    render: (user) => <Badge tone={user.rol === 'Admin' ? 'dark' : 'info'}>{user.rol}</Badge>,
  },
  {
    key: 'estado',
    header: 'Estado',
    render: (user) => (
      <Badge tone={user.estado === 'Activo' ? 'success' : 'danger'}>{user.estado}</Badge>
    ),
  },
  { key: 'fechaRegistro', header: 'Fecha de registro' },
  {
    key: 'acciones',
    header: 'Acciones',
    render: (user) => (
      <ActionsMenu
        onView={() => console.log('ver usuario', user.id)}
        onMore={() => console.log('mas opciones', user.id)}
      />
    ),
  },
];

export const UsersPage = () => {
  const {
    isLoading,
    stats,
    usersByRole,
    activity,
    search,
    onSearchChange,
    roleFilter,
    onRoleFilterChange,
    statusFilter,
    onStatusFilterChange,
    page,
    setPage,
    totalPages,
    paginatedUsers,
    totalFiltered,
    pageSize,
  } = useUsersPage();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Gestión de Usuarios"
        description="Administra los usuarios registrados en la plataforma."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon="group"
          iconClassName="bg-primary/10 text-primary"
          label="Total de usuarios"
          value={stats?.totalUsuarios ?? '—'}
          trendValue="12.4% vs mes anterior"
          trendDirection="up"
        />
        <StatCard
          icon="shield"
          iconClassName="bg-red-100 text-alert"
          label="Alertas de seguridad"
          value={stats?.alertasSeguridad ?? '—'}
          trendValue="8.7% vs mes anterior"
          trendDirection="up"
        />
        <StatCard
          icon="confirmation_number"
          iconClassName="bg-green-100 text-green-600"
          label="Reservas"
          value={stats?.reservas ?? '—'}
          trendValue="5.3% vs mes anterior"
          trendDirection="up"
        />
        <StatCard
          icon="payments"
          iconClassName="bg-blue-100 text-blue-600"
          label="Ventas totales"
          value={stats ? formatCompactCurrency(stats.ventasTotales) : '—'}
          trendValue="15.2% vs mes anterior"
          trendDirection="up"
        />
      </div>

      <div className="flex flex-col gap-4">
        <SearchFilterBar
          searchValue={search}
          onSearchChange={onSearchChange}
          placeholder="Buscar usuario, Email o ID..."
        >
          <Select
            value={roleFilter}
            onChange={(e) => onRoleFilterChange(e.target.value)}
            containerClassName="w-full md:w-44"
          >
            <option value="todos">Todos los Roles</option>
            <option value="Admin">Admin</option>
            <option value="Cliente">Cliente</option>
            <option value="Soporte">Soporte</option>
          </Select>
          <Select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            containerClassName="w-full md:w-44"
          >
            <option value="todos">Estado de Cuenta</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </Select>
        </SearchFilterBar>

        <DataTable
          columns={columns}
          data={paginatedUsers}
          keyExtractor={(user) => user.id}
          emptyMessage={isLoading ? 'Cargando usuarios...' : 'No se encontraron usuarios.'}
        />

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          totalItems={totalFiltered}
          itemsPerPage={pageSize}
          itemLabel="usuarios"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Usuarios por rol">
          <DonutChart
            data={usersByRole.map((item) => ({
              label: item.rol,
              value: item.cantidad,
              color: ROLE_COLORS[item.rol] ?? '#94a3b8',
            }))}
          />
        </ChartCard>

        <ChartCard title="Actividad reciente" action={<button className="text-primary text-sm font-semibold cursor-pointer">Ver todo</button>}>
          <div className="flex flex-col gap-4">
            {activity.map((item) => (
              <ActivityListItem
                key={item.id}
                icon={item.icon}
                iconClassName={item.iconClassName}
                title={item.titulo}
                subtitle={item.subtitulo}
                time={item.tiempo}
              />
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
};
