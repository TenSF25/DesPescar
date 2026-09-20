import {
  PageHeader,
  StatCard,
  ChartCard,
  LineChart,
  DonutChart,
  ProgressListItem,
  Select,
  DataTable,
  IconCircle,
  ActionsMenu,
  type TableColumn,
} from '../../../../components/admin';
import { useReportsPage } from '../hooks/useReportsPage';
import type { GeneratedReport, ReportType } from '../admin-reports.types';

const TIPO_ICON: Record<ReportType, { icon: string; className: string }> = {
  Ventas: { icon: 'payments', className: 'bg-blue-100 text-blue-600' },
  Vuelos: { icon: 'flight', className: 'bg-purple-100 text-purple-600' },
  Usuarios: { icon: 'group', className: 'bg-green-100 text-green-600' },
};

export const ReportsPage = () => {
  const {
    isLoading,
    summary,
    salesByDay,
    bookingsByOrigin,
    topDestinations,
    maxDestinationValue,
    recentReports,
    isExporting,
    handleExportReport,
  } = useReportsPage();

  const columns: TableColumn<GeneratedReport>[] = [
    {
      key: 'nombre',
      header: 'Nombre del reporte',
      render: (report) => (
        <div className="flex items-center gap-3">
          <IconCircle
            size="sm"
            icon={TIPO_ICON[report.tipo].icon}
            className={TIPO_ICON[report.tipo].className}
          />
          <span className="font-semibold">{report.nombre}</span>
        </div>
      ),
    },
    { key: 'tipo', header: 'Tipo' },
    { key: 'periodo', header: 'Período' },
    { key: 'generadoEl', header: 'Generado el' },
    { key: 'formato', header: 'Formato' },
    {
      key: 'accion',
      header: 'Acción',
      render: (report) => (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleExportReport}
            className="text-primary flex cursor-pointer items-center gap-1 text-sm font-semibold hover:underline"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Descargar
          </button>
          <ActionsMenu onMore={() => console.log('mas opciones', report.id)} />
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Reportes"
        description="Visualiza estadísticas y métricas clave de la plataforma."
        actions={
          <>
            {/* Placeholder visual: reemplazar por un date-range picker real */}
            <button
              type="button"
              className="flex cursor-pointer items-center gap-2 rounded-xl border border-black/15 bg-white px-3 py-2.5 text-sm text-[#44474E]"
            >
              <span className="material-symbols-outlined text-[18px]">calendar_today</span>
              01/10/2024 - 15/10/2024
            </button>
            <Select defaultValue="todos" containerClassName="w-44">
              <option value="todos">Todos los vuelos</option>
            </Select>
            <button
              type="button"
              onClick={handleExportReport}
              disabled={isExporting}
              className="bg-secondary flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white hover:bg-secondary/90 disabled:opacity-60"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              {isExporting ? 'Exportando...' : 'Exportar reporte'}
            </button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon="payments"
          iconClassName="bg-primary/10 text-primary"
          label="Ventas totales"
          value={summary ? `$${summary.ventasTotales.toLocaleString('es-AR')}` : '—'}
          trendValue={summary ? `${summary.ventasDeltaPct}% vs periodo anterior` : undefined}
          trendDirection="up"
        />
        <StatCard
          icon="confirmation_number"
          iconClassName="bg-blue-100 text-blue-600"
          label="Reservas totales"
          value={summary?.reservasTotales ?? '—'}
          trendValue={summary ? `${summary.reservasDeltaPct}% vs periodo anterior` : undefined}
          trendDirection="up"
        />
        <StatCard
          icon="flight"
          iconClassName="bg-green-100 text-green-600"
          label="Vuelos completados"
          value={summary?.vuelosCompletados ?? '—'}
          trendValue={summary ? `${summary.vuelosDeltaPct}% vs periodo anterior` : undefined}
          trendDirection="up"
        />
        <StatCard
          icon="group"
          iconClassName="bg-orange-100 text-orange-600"
          label="Usuarios activos"
          value={summary?.usuariosActivos ?? '—'}
          trendValue={summary ? `${summary.usuariosDeltaPct}% vs periodo anterior` : undefined}
          trendDirection="up"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard title="Ventas por día">
          <LineChart
            data={salesByDay.map((item) => ({ label: item.fecha, value: item.ventas }))}
          />
        </ChartCard>

        <ChartCard title="Reservas por origen">
          <DonutChart
            data={bookingsByOrigin.map((item) => ({
              label: item.origen,
              value: item.cantidad,
              color: item.color,
            }))}
          />
        </ChartCard>

        <ChartCard title="Top destinos">
          <div className="flex flex-col gap-3">
            {topDestinations.map((item) => (
              <ProgressListItem
                key={item.destino}
                label={item.destino}
                value={item.reservas}
                maxValue={maxDestinationValue}
              />
            ))}
          </div>
        </ChartCard>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-secondary font-semibold">Reportes generados recientemente</h3>
        <DataTable
          columns={columns}
          data={recentReports}
          keyExtractor={(report) => report.id}
          emptyMessage={isLoading ? 'Cargando reportes...' : 'No hay reportes generados.'}
        />
        <button
          type="button"
          className="text-primary mx-auto flex cursor-pointer items-center gap-1 text-sm font-semibold hover:underline"
        >
          Ver todos los reportes
          <span className="material-symbols-outlined text-[18px]">expand_more</span>
        </button>
      </div>
    </div>
  );
};
