import { Link } from 'react-router';
import {
  PageHeader,
  StatCard,
  ChartCard,
  DonutChart,
  LineChart,
  ProgressListItem,
  ActivityListItem,
  DataTable,
  Badge,
  IconCircle,
  type TableColumn,
} from '@/components/admin';
import { FLIGHT_STATUS_TONE, formatFlightDate } from '../../flights/flights.utils';
import { useDashboardPage } from '../hooks/useDashboardPage';
import type { UpcomingDeparture } from '../admin-dashboard.types';

const occupancyBarColor = (pct: number) =>
  pct < 50 ? 'bg-alert' : pct < 80 ? 'bg-amber-500' : 'bg-green-600';

const formatMoney = (amount: number) => `$${amount.toLocaleString('es-AR')}`;

const upcomingColumns: TableColumn<UpcomingDeparture>[] = [
  {
    key: 'numero',
    header: 'Vuelo',
    render: ({ flight }) => <span className="font-semibold">{flight.numero}</span>,
  },
  { key: 'ruta', header: 'Ruta', render: ({ flight }) => `${flight.origen} → ${flight.destino}` },
  {
    key: 'salida',
    header: 'Salida',
    render: ({ flight }) => `${formatFlightDate(flight.fecha)}, ${flight.hora}`,
  },
  {
    key: 'estado',
    header: 'Estado',
    render: ({ flight }) => <Badge tone={FLIGHT_STATUS_TONE[flight.estado]}>{flight.estado}</Badge>,
  },
  {
    key: 'ocupacion',
    header: 'Ocupación',
    render: ({ occupancy }) => (
      <div className="flex items-center gap-2">
        <div className="h-2 w-24 overflow-hidden rounded-full bg-black/10">
          <div
            className={`h-full rounded-full ${occupancyBarColor(occupancy)}`}
            style={{ width: `${occupancy}%` }}
          />
        </div>
        <span className="text-xs font-semibold">{occupancy}%</span>
      </div>
    ),
  },
];

const ViewAllLink = ({ to, children }: { to: string; children: string }) => (
  <Link to={to} className="text-primary text-sm font-semibold hover:underline">
    {children}
  </Link>
);

/**
 * Panel general de la aerolínea: qué pasa hoy con sus vuelos y reservas.
 * Usa las mismas fuentes que Vuelos, Reservas y Reportes, así los números coinciden.
 */
export const AirlineDashboardPage = () => {
  const { data, isLoading } = useDashboardPage();

  if (!data) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title="Panel general" description="Resumen del día de tu aerolínea." />
        <p className="text-sm text-[#44474E]">{isLoading ? 'Cargando panel...' : 'Sin datos.'}</p>
      </div>
    );
  }

  const maxRouteValue = Math.max(1, ...data.topRoutes.map((route) => route.reservas));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Panel general"
        description="Resumen de la actividad de tu aerolínea del día de hoy."
        actions={
          <>
            <Link
              to="/admin/aerolinea/reservas"
              className="hover:text-secondary flex items-center gap-2 rounded-xl border border-black/15 bg-white px-4 py-2.5 text-sm font-semibold text-[#44474E] transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">confirmation_number</span>
              Ver reservas
            </Link>
            <Link
              to="/admin/aerolinea/vuelos"
              state={{ openAddFlight: true }}
              className="bg-secondary hover:bg-secondary/90 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Agregar vuelo
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon="payments"
          iconClassName="bg-primary/10 text-primary"
          label="Ventas de hoy"
          value={formatMoney(data.ventasHoy)}
          trendValue={`${Math.abs(data.ventasDeltaPct)}% vs ayer`}
          trendDirection={data.ventasDeltaPct >= 0 ? 'up' : 'down'}
        />
        <StatCard
          icon="confirmation_number"
          iconClassName="bg-green-100 text-green-600"
          label="Reservas de hoy"
          value={data.reservasHoy}
          trendValue={`${Math.abs(data.reservasDeltaVsAyer)} ${
            data.reservasDeltaVsAyer >= 0 ? 'más' : 'menos'
          } que ayer`}
          trendDirection={data.reservasDeltaVsAyer >= 0 ? 'up' : 'down'}
        />
        <StatCard
          icon="flight_takeoff"
          iconClassName="bg-blue-100 text-blue-600"
          label="Vuelos de hoy"
          value={data.vuelosHoy}
          caption={`${data.vuelosEnCurso} en curso ahora`}
        />
        <StatCard
          icon="airline_seat_recline_normal"
          iconClassName="bg-orange-100 text-orange-600"
          label="Ocupación próximas salidas"
          value={`${data.ocupacionProximas}%`}
          caption="Promedio de los próximos vuelos"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard title="Reservas de hoy por hora">
          <LineChart
            data={data.bookingsByHour}
            valueLabel="Reservas"
            valueFormatter={(value) => `${value} reservas`}
          />
        </ChartCard>

        <ChartCard title="Estado de los vuelos">
          <DonutChart data={data.flightsByStatus} />
        </ChartCard>

        <ChartCard title="Rutas con más reservas hoy">
          <div className="flex flex-col gap-3">
            {data.topRoutes.length > 0 ? (
              data.topRoutes.map((route) => (
                <ProgressListItem
                  key={route.ruta}
                  label={route.ruta}
                  value={route.reservas}
                  maxValue={maxRouteValue}
                />
              ))
            ) : (
              <p className="text-sm text-[#44474E]">Todavía no hay reservas hoy.</p>
            )}
          </div>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="flex flex-col gap-4 xl:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-secondary font-semibold">Próximas salidas</h3>
            <ViewAllLink to="/admin/aerolinea/vuelos">Ver todos los vuelos</ViewAllLink>
          </div>
          <DataTable
            columns={upcomingColumns}
            data={data.upcoming}
            keyExtractor={({ flight }) => flight.id}
            emptyMessage="No hay salidas programadas."
          />
        </div>

        <ChartCard title="Requiere atención">
          <div className="flex flex-col gap-3">
            {data.alerts.length > 0 ? (
              data.alerts.map((alert) => (
                <Link
                  key={alert.id}
                  to={alert.to}
                  className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-black/5"
                >
                  <IconCircle size="sm" icon={alert.icon} className={alert.iconClassName} />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="text-secondary text-sm font-semibold">{alert.title}</span>
                    <span className="text-xs text-[#44474E]">{alert.subtitle}</span>
                  </div>
                  <span className="material-symbols-outlined text-[18px] text-[#44474E]">
                    chevron_right
                  </span>
                </Link>
              ))
            ) : (
              <p className="text-sm text-[#44474E]">Todo en orden, no hay alertas.</p>
            )}
          </div>
        </ChartCard>
      </div>

      <ChartCard title="Actividad reciente">
        <div className="flex flex-col gap-4">
          {data.activity.map((item) => (
            <ActivityListItem
              key={item.id}
              icon={item.icon}
              iconClassName={item.iconClassName}
              title={item.title}
              subtitle={item.subtitle}
              time={item.time}
            />
          ))}
        </div>
      </ChartCard>
    </div>
  );
};
