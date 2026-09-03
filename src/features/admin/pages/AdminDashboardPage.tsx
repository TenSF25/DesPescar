import { useState } from 'react';
import {
  PageHeader,
  StatCard,
  ChartCard,
  DonutChart,
  LineChart,
  ProgressListItem,
  ActivityListItem,
  SearchFilterBar,
  Select,
  DataTable,
  Badge,
  ActionsMenu,
  Pagination,
  type TableColumn,
} from '../../../components/admin';

/**
 * PÁGINA DE EJEMPLO 
  demo que muestra cómo se combinan los componentes de
  `src/components/admin`. 
  crear página dentro de `src/features/admin/pages/` y agregar su ruta en `src/routes/index.tsx`.
 */

interface DemoUsuario {
  id: number;
  nombre: string;
  email: string;
  rol: 'Admin' | 'Cliente';
  estado: 'Activo' | 'Inactivo';
}

const usuariosDemo: DemoUsuario[] = [
  {
    id: 1,
    nombre: 'Susana Gómez',
    email: 'susana.gomez@email.com',
    rol: 'Admin',
    estado: 'Inactivo',
  },
  {
    id: 2,
    nombre: 'Roberto Roa',
    email: 'roberto.roa@email.com',
    rol: 'Cliente',
    estado: 'Activo',
  },
  {
    id: 3,
    nombre: 'Pablo Molina',
    email: 'pablo.molina@email.com',
    rol: 'Admin',
    estado: 'Activo',
  },
];

const columns: TableColumn<DemoUsuario>[] = [
  {
    key: 'nombre',
    header: 'Nombre / Email',
    render: (u) => (
      <div className="flex flex-col">
        <span className="font-semibold">{u.nombre}</span>
        <span className="text-xs text-[#44474E]">{u.email}</span>
      </div>
    ),
  },
  {
    key: 'rol',
    header: 'Rol',
    render: (u) => <Badge tone={u.rol === 'Admin' ? 'dark' : 'info'}>{u.rol}</Badge>,
  },
  {
    key: 'estado',
    header: 'Estado',
    render: (u) => <Badge tone={u.estado === 'Activo' ? 'success' : 'danger'}>{u.estado}</Badge>,
  },
  {
    key: 'acciones',
    header: 'Acciones',
    render: () => <ActionsMenu onView={() => {}} onEdit={() => {}} onMore={() => {}} />,
  },
];

export const AdminDashboardPage = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Dashboard"
        description="Ejemplo de uso de los componentes de administrador."
      />

      {/* Grilla de KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon="payments"
          iconClassName="bg-primary/10 text-primary"
          label="Ventas totales"
          value="$1,902,450"
          trendValue="15.2% vs periodo anterior"
          trendDirection="up"
        />
        <StatCard
          icon="group"
          iconClassName="bg-blue-100 text-blue-600"
          label="Reservas totales"
          value="1,250"
          trendValue="8.7% vs periodo anterior"
          trendDirection="up"
        />
        <StatCard
          icon="flight"
          iconClassName="bg-green-100 text-green-600"
          label="Vuelos completados"
          value="62"
          trendValue="5.3% vs periodo anterior"
          trendDirection="up"
        />
        <StatCard
          icon="verified_user"
          iconClassName="bg-orange-100 text-orange-600"
          label="Usuarios activos"
          value="842"
          trendValue="12.1% vs periodo anterior"
          trendDirection="up"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard title="Ventas por día">
          <LineChart
            data={[
              { label: '01 Oct', value: 90 },
              { label: '03 Oct', value: 140 },
              { label: '05 Oct', value: 110 },
              { label: '07 Oct', value: 160 },
              { label: '09 Oct', value: 130 },
              { label: '11 Oct', value: 170 },
              { label: '13 Oct', value: 150 },
              { label: '15 Oct', value: 185 },
            ]}
          />
        </ChartCard>

        <ChartCard title="Reservas por origen">
          <DonutChart
            data={[
              { label: 'MAD', value: 438, color: '#1f3051' },
              { label: 'MIA', value: 313, color: '#3457a6' },
              { label: 'JFK', value: 250, color: '#6f8fd6' },
              { label: 'LIM', value: 125, color: '#a9bdec' },
              { label: 'Otros', value: 124, color: '#d9d9d9' },
            ]}
          />
        </ChartCard>

        <ChartCard title="Top destinos">
          <div className="flex flex-col gap-3">
            <ProgressListItem label="Ciudad de México" value={320} maxValue={320} />
            <ProgressListItem label="Bogotá" value={280} maxValue={320} />
            <ProgressListItem label="Miami" value={210} maxValue={320} />
            <ProgressListItem label="Santiago" value={180} maxValue={320} />
          </div>
        </ChartCard>
      </div>

      {/* Actividad reciente */}
      <ChartCard title="Actividad reciente">
        <div className="flex flex-col gap-4">
          <ActivityListItem
            icon="shield"
            iconClassName="bg-red-100 text-alert"
            title="Nuevo inicio de sesión en dispositivo desconocido"
            subtitle="Usuario: susana.gomez@email.com"
            time="Hoy, 14:23 PM"
          />
          <ActivityListItem
            icon="person"
            iconClassName="bg-green-100 text-green-600"
            title="Actualización de perfil"
            subtitle="Usuario: roberto.roa@email.com"
            time="Hoy, 12:15 PM"
          />
          <ActivityListItem
            icon="flight"
            iconClassName="bg-blue-100 text-blue-600"
            title="Nueva reserva realizada"
            subtitle="Usuario: pablo.molina@email.com"
            time="Hoy, 10:45 AM"
          />
        </div>
      </ChartCard>

      {/* Tabla con búsqueda, filtros y paginación */}
      <div className="flex flex-col gap-4">
        <SearchFilterBar
          searchValue={search}
          onSearchChange={setSearch}
          placeholder="Buscar usuario, email o ID..."
        >
          <Select defaultValue="todos" containerClassName="w-full md:w-48">
            <option value="todos">Todos los roles</option>
            <option value="admin">Admin</option>
            <option value="cliente">Cliente</option>
          </Select>
        </SearchFilterBar>

        <DataTable columns={columns} data={usuariosDemo} keyExtractor={(u) => u.id} />

        <Pagination
          currentPage={page}
          totalPages={140}
          onPageChange={setPage}
          totalItems={1667}
          itemsPerPage={12}
          itemLabel="usuarios"
        />
      </div>
    </div>
  );
};
