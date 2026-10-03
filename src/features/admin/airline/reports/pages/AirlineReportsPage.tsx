import {
  PageHeader,
  StatCard,
  ChartCard,
  LineChart,
  DonutChart,
  ProgressListItem,
  Select,
  DataTable,
  DateRangeFilter,
  IconCircle,
  ActionsMenu,
  type TableColumn,
} from '@/components/admin';
import { format, parseISO } from 'date-fns';
import type { ReactNode } from 'react';
import { useReportsPage } from '../hooks/useReportsPage';
import type { GeneratedReport, ReportType } from '../admin-reports.types';

const TIPO_ICON: Record<ReportType, { icon: string; className: string }> = {
  Ventas: { icon: 'payments', className: 'bg-blue-100 text-blue-600' },
  Vuelos: { icon: 'flight', className: 'bg-purple-100 text-purple-600' },
  Pasajeros: { icon: 'group', className: 'bg-green-100 text-green-600' },
};

const formatDay = (iso: string) => format(parseISO(iso), 'dd/MM/yyyy');
const formatDateTime = (iso: string) => format(new Date(iso), 'dd/MM/yyyy, HH:mm');

const FilterField = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="flex flex-col gap-1.5">
    <span className="text-xs font-semibold tracking-wide text-[#44474E] uppercase">{label}</span>
    {children}
  </div>
);

export const AirlineReportsPage = () => {
  const {
    isLoading,
    isExporting,
    dateLimits,
    filters,
    onRangeChange,
    onFlightChange,
    flightOptions,
    reportType,
    onReportTypeChange,
    summary,
    salesByDay,
    bookingsByOrigin,
    topDestinations,
    maxDestinationValue,
    visibleReports,
    canToggleReports,
    showAllReports,
    toggleShowAllReports,
    handleExportReport,
    handleDownloadReport,
    handleDeleteReport,
  } = useReportsPage();

  // Con un solo origen (ej: filtrando por un vuelo) el donut tendría una única porción.
  const showOriginChart = bookingsByOrigin.length > 1;

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
    {
      key: 'periodo',
      header: 'Período',
      render: (report) => `${formatDay(report.from)} - ${formatDay(report.to)}`,
    },
    {
      key: 'generadoEl',
      header: 'Generado el',
      render: (report) => formatDateTime(report.generadoEl),
    },
    { key: 'formato', header: 'Formato' },
    {
      key: 'accion',
      header: 'Acción',
      render: (report) => (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleDownloadReport(report)}
            className="text-primary flex cursor-pointer items-center gap-1 text-sm font-semibold hover:underline"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Descargar
          </button>
          <ActionsMenu onDelete={() => handleDeleteReport(report.id)} />
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Reportes"
        description="Visualiza estadísticas y métricas clave de tu aerolínea."
      />

      <div className="flex flex-col gap-4 rounded-2xl border border-black/10 bg-white p-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-wrap items-end gap-4">
          <FilterField label="Período">
            <DateRangeFilter
              value={{ from: filters.from, to: filters.to }}
              onChange={onRangeChange}
              min={dateLimits.min}
              max={dateLimits.max}
            />
          </FilterField>
          <FilterField label="Vuelo">
            <Select
              value={filters.flightId}
              onChange={(e) => onFlightChange(e.target.value)}
              containerClassName="w-56"
            >
              <option value="todos">Todos los vuelos</option>
              {flightOptions.map((flight) => (
                <option key={flight.id} value={flight.id}>
                  {flight.label}
                </option>
              ))}
            </Select>
          </FilterField>
        </div>

        <div className="flex flex-wrap items-end gap-3 border-t border-black/10 pt-4 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-4">
          <FilterField label="Tipo de reporte">
            <Select
              value={reportType}
              onChange={(e) => onReportTypeChange(e.target.value as ReportType)}
              containerClassName="w-44"
            >
              <option value="Ventas">Ventas</option>
              <option value="Vuelos">Vuelos</option>
              <option value="Pasajeros">Pasajeros</option>
            </Select>
          </FilterField>
          <button
            type="button"
            onClick={handleExportReport}
            disabled={isExporting}
            className="bg-secondary hover:bg-secondary/90 flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-60"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            {isExporting ? 'Exportando...' : 'Exportar reporte'}
          </button>
        </div>
      </div>

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
          label="Pasajeros transportados"
          value={summary?.pasajeros ?? '—'}
          trendValue={summary ? `${summary.pasajerosDeltaPct}% vs periodo anterior` : undefined}
          trendDirection="up"
        />
      </div>

      <div
        className={`grid grid-cols-1 gap-4 ${showOriginChart ? 'lg:grid-cols-3' : 'lg:grid-cols-2'}`}
      >
        <ChartCard title="Ventas por día">
          <LineChart data={salesByDay.map((item) => ({ label: item.fecha, value: item.ventas }))} />
        </ChartCard>

        {showOriginChart && (
          <ChartCard title="Reservas por origen">
            <DonutChart
              data={bookingsByOrigin.map((item) => ({
                label: item.origen,
                value: item.cantidad,
                color: item.color,
              }))}
            />
          </ChartCard>
        )}

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
          data={visibleReports}
          keyExtractor={(report) => report.id}
          emptyMessage={isLoading ? 'Cargando reportes...' : 'No hay reportes generados.'}
        />
        {canToggleReports && (
          <button
            type="button"
            onClick={toggleShowAllReports}
            className="text-primary mx-auto flex cursor-pointer items-center gap-1 text-sm font-semibold hover:underline"
          >
            {showAllReports ? 'Ver menos' : 'Ver todos los reportes'}
            <span className="material-symbols-outlined text-[18px]">
              {showAllReports ? 'expand_less' : 'expand_more'}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
