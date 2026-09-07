import {
  PageHeader,
  StatCard,
  ChartCard,
  DonutChart,
  LineChart,
  ProgressListItem,
  ActivityListItem,
} from '../../../components/admin';

/**
 * Dashboard principal del Admin General de Despescar.
 *
 * Muestra dos cosas bien distintas, a propósito:
 * 1) KPIs generales de la plataforma (totales acumulados: aerolíneas,
 *    hoteles, clientes, ingresos).
 * 2) Actividad y gráficos del DÍA ACTUAL (no tendencias mensuales) — para
 *    que el admin vea de un vistazo cómo viene el día de hoy.
 *
 * La gestión de cuentas (altas/bajas/permisos) vive en /admin/usuarios,
 * no acá — este dashboard es solo de lectura/resumen.
 */
export const AdminDashboardPage = () => {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Dashboard"
        description="Resumen general de la plataforma y actividad de hoy."
      />

      {/* KPIs generales (totales acumulados de la plataforma) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon="payments"
          iconClassName="bg-primary/10 text-primary"
          label="Ingresos totales"
          value="$8,420,600"
          trendValue="11.4% vs periodo anterior"
          trendDirection="up"
        />
        <StatCard
          icon="flight_takeoff"
          iconClassName="bg-blue-100 text-blue-600"
          label="Aerolíneas activas"
          value="18"
          trendValue="2 nuevas este mes"
          trendDirection="up"
        />
        <StatCard
          icon="apartment"
          iconClassName="bg-green-100 text-green-600"
          label="Hoteles activos"
          value="34"
          trendValue="3 nuevos este mes"
          trendDirection="up"
        />
        <StatCard
          icon="group"
          iconClassName="bg-orange-100 text-orange-600"
          label="Clientes registrados"
          value="4,912"
          trendValue="9.8% vs periodo anterior"
          trendDirection="up"
        />
      </div>

      {/* Gráficos del día actual */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard title="Reservas de hoy por hora">
          <LineChart
            data={[
              { label: '00h', value: 2 },
              { label: '03h', value: 1 },
              { label: '06h', value: 4 },
              { label: '09h', value: 12 },
              { label: '12h', value: 18 },
              { label: '15h', value: 15 },
              { label: '18h', value: 21 },
              { label: '21h', value: 9 },
            ]}
          />
        </ChartCard>

        <ChartCard title="Reservas de hoy por tipo">
          <DonutChart
            data={[
              { label: 'Vuelos', value: 48, color: '#1f3051' },
              { label: 'Hoteles', value: 27, color: '#3457a6' },
              { label: 'Paquetes', value: 7, color: '#c85300' },
            ]}
          />
        </ChartCard>

        <ChartCard title="Proveedores con más reservas hoy">
          <div className="flex flex-col gap-3">
            <ProgressListItem label="LATAM Argentina" value={16} maxValue={16} />
            <ProgressListItem label="Hotel Costanera" value={11} maxValue={16} />
            <ProgressListItem label="Vuela Andes" value={8} maxValue={16} />
            <ProgressListItem label="Hotel Bahía Norte" value={5} maxValue={16} />
          </div>
        </ChartCard>
      </div>

      {/* Actividad del día */}
      <ChartCard title="Actividad de hoy">
        <div className="flex flex-col gap-4">
          <ActivityListItem
            icon="new_releases"
            iconClassName="bg-amber-100 text-amber-700"
            title="Nueva solicitud de alta de aerolínea"
            subtitle="Aerolíneas del Sur solicitó unirse a la plataforma"
            time="Hoy, 09:40 AM"
          />
          <ActivityListItem
            icon="block"
            iconClassName="bg-red-100 text-alert"
            title="Cuenta suspendida por incumplimiento"
            subtitle="Vuela Andes fue suspendida por el equipo de Despescar"
            time="Hoy, 08:15 AM"
          />
          <ActivityListItem
            icon="verified_user"
            iconClassName="bg-green-100 text-green-600"
            title="Permisos actualizados"
            subtitle="Hotel Costanera ahora puede publicar promociones"
            time="Hoy, 07:50 AM"
          />
        </div>
      </ChartCard>
    </div>
  );
};
