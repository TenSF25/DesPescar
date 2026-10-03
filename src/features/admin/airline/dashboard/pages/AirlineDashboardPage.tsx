import {
  PageHeader,
  StatCard,
  ChartCard,
  DonutChart,
  LineChart,
  ProgressListItem,
  ActivityListItem,
} from '@/components/admin';

/**
 * Panel general de la aerolínea: resumen de lo que pasa HOY con sus vuelos
 * y reservas. Mismo formato que el dashboard del admin general, pero acotado
 * a una aerolínea. La gestión (vuelos, reservas) vive en sus propias páginas.
 *
 * TODO(backend): hoy son datos fijos. Cuando el backend exponga el airlineId
 * del usuario, pedir estos números filtrados por esa aerolínea.
 */
export const AirlineDashboardPage = () => {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Panel general"
        description="Resumen de la actividad de tu aerolínea del día de hoy."
      />

      {/* KPIs del día */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon="payments"
          iconClassName="bg-primary/10 text-primary"
          label="Ingresos de hoy"
          value="$184,300"
          trendValue="6.2% vs ayer"
          trendDirection="up"
        />
        <StatCard
          icon="flight_takeoff"
          iconClassName="bg-blue-100 text-blue-600"
          label="Vuelos de hoy"
          value="23"
          caption="4 en curso ahora"
        />
        <StatCard
          icon="confirmation_number"
          iconClassName="bg-green-100 text-green-600"
          label="Reservas de hoy"
          value="86"
          trendValue="9 más que ayer"
          trendDirection="up"
        />
        <StatCard
          icon="airline_seat_recline_normal"
          iconClassName="bg-orange-100 text-orange-600"
          label="Ocupación promedio"
          value="82%"
          trendValue="1.4% vs ayer"
          trendDirection="down"
        />
      </div>

      {/* Gráficos del día actual */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard title="Reservas de hoy por hora">
          <LineChart
            data={[
              { label: '00h', value: 1 },
              { label: '03h', value: 0 },
              { label: '06h', value: 5 },
              { label: '09h', value: 14 },
              { label: '12h', value: 19 },
              { label: '15h', value: 16 },
              { label: '18h', value: 22 },
              { label: '21h', value: 9 },
            ]}
          />
        </ChartCard>

        <ChartCard title="Vuelos de hoy por estado">
          <DonutChart
            data={[
              { label: 'Programados', value: 8, color: '#f59e0b' },
              { label: 'En curso', value: 4, color: '#3457a6' },
              { label: 'Completados', value: 10, color: '#16794c' },
              { label: 'Cancelados', value: 1, color: '#ba1a1a' },
            ]}
          />
        </ChartCard>

        <ChartCard title="Rutas con más reservas hoy">
          <div className="flex flex-col gap-3">
            <ProgressListItem label="EZE → MIA" value={18} maxValue={18} />
            <ProgressListItem label="AEP → BRC" value={15} maxValue={18} />
            <ProgressListItem label="EZE → MAD" value={12} maxValue={18} />
            <ProgressListItem label="COR → EZE" value={9} maxValue={18} />
          </div>
        </ChartCard>
      </div>

      {/* Actividad del día */}
      <ChartCard title="Actividad de hoy">
        <div className="flex flex-col gap-4">
          <ActivityListItem
            icon="schedule"
            iconClassName="bg-amber-100 text-amber-700"
            title="Vuelo demorado"
            subtitle="DSC7891 (EZE → MIA) sale 45 min más tarde"
            time="Hoy, 09:40 AM"
          />
          <ActivityListItem
            icon="cancel"
            iconClassName="bg-red-100 text-alert"
            title="Vuelo cancelado"
            subtitle="DSC6622 (AEP → BRC) fue cancelado por clima"
            time="Hoy, 08:15 AM"
          />
          <ActivityListItem
            icon="groups"
            iconClassName="bg-green-100 text-green-600"
            title="Nueva reserva grupal"
            subtitle="12 pasajeros reservaron DSC2456 (EZE → MAD)"
            time="Hoy, 07:50 AM"
          />
        </div>
      </ChartCard>
    </div>
  );
};
