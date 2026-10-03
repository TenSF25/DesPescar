import { Link } from 'react-router';
import {
  ActivityListItem,
  Badge,
  ChartCard,
  DataTable,
  DonutChart,
  IconCircle,
  LineChart,
  PageHeader,
  ProgressListItem,
  StatCard,
  type TableColumn,
} from '@/components/admin';
import type { HotelReservation } from '../../shared/hotel.types';
import { RESERVATION_STATUS_TONE, formatHotelDate, formatUsd } from '../../shared/hotel.utils';
import { useHotelDashboardPage } from '../hooks/useHotelDashboardPage';

const arrivalColumns: TableColumn<HotelReservation>[] = [
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
  { key: 'huesped', header: 'Huésped' },
  {
    key: 'checkIn',
    header: 'Llegada',
    render: (reservation) => formatHotelDate(reservation.checkIn),
  },
  { key: 'noches', header: 'Noches' },
  {
    key: 'estado',
    header: 'Estado',
    render: (reservation) => (
      <Badge tone={RESERVATION_STATUS_TONE[reservation.estado]}>{reservation.estado}</Badge>
    ),
  },
];

/**
 * Panel general del hotel: qué pasa hoy (llegadas, salidas, ocupación y ventas).
 * Usa las mismas reservas que las páginas de Reservas y Reportes, así los números coinciden.
 */
export const HotelDashboardPage = () => {
  const { data, isLoading } = useHotelDashboardPage();

  if (!data) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title="Panel general" description="Resumen del día de tu hotel." />
        <p className="text-sm text-[#44474E]">{isLoading ? 'Cargando panel...' : 'Sin datos.'}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Panel general"
        description="Resumen de la actividad de tu hotel del día de hoy."
        actions={
          <>
            <Link
              to="/admin/hotel/gestion"
              className="hover:text-secondary flex items-center gap-2 rounded-xl border border-black/15 bg-white px-4 py-2.5 text-sm font-semibold text-[#44474E] transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">tune</span>
              Gestionar mi hotel
            </Link>
            <Link
              to="/admin/hotel/reservas"
              className="bg-secondary hover:bg-secondary/90 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">confirmation_number</span>
              Ver reservas
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon="login"
          iconClassName="bg-green-100 text-green-600"
          label="Check-ins de hoy"
          value={data.checkInsHoy}
          caption={`${data.huespedesAlojados} reservas en estadía ahora`}
        />
        <StatCard
          icon="logout"
          iconClassName="bg-amber-100 text-amber-600"
          label="Check-outs de hoy"
          value={data.checkOutsHoy}
          caption="Salidas previstas para hoy"
        />
        <StatCard
          icon="hotel"
          iconClassName="bg-blue-100 text-blue-600"
          label="Ocupación de hoy"
          value={`${data.ocupacionHoy}%`}
          caption={`${data.habitacionesOcupadas} de ${data.totalHabitaciones} habitaciones`}
        />
        <StatCard
          icon="payments"
          iconClassName="bg-primary/10 text-primary"
          label="Ventas de hoy"
          value={formatUsd(data.ventasHoy)}
          trendValue={`${Math.abs(data.ventasDeltaPct)}% vs ayer`}
          trendDirection={data.ventasDeltaPct >= 0 ? 'up' : 'down'}
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

        <ChartCard title="Reservas por estado (±30 días)">
          <DonutChart data={data.reservationsByStatus} />
        </ChartCard>

        <ChartCard title="Ocupación por habitación hoy">
          <div className="flex flex-col gap-3">
            {data.occupancyByRoom.map((room) => (
              <ProgressListItem
                key={room.habitacion}
                label={room.habitacion}
                value={room.ocupacion}
                maxValue={100}
                valueSuffix="%"
              />
            ))}
          </div>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="flex flex-col gap-4 xl:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-secondary font-semibold">Próximas llegadas</h3>
            <Link
              to="/admin/hotel/reservas"
              className="text-primary text-sm font-semibold hover:underline"
            >
              Ver todas las reservas
            </Link>
          </div>
          <DataTable
            columns={arrivalColumns}
            data={data.arrivals}
            keyExtractor={(reservation) => reservation.id}
            emptyMessage="No hay llegadas próximas."
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
