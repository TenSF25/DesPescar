import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import {
  ActionsMenu,
  ChartCard,
  DataTable,
  DateRangeFilter,
  DonutChart,
  FilterField,
  IconCircle,
  LineChart,
  PageHeader,
  ProgressListItem,
  SegmentedControl,
  Select,
  StatCard,
  pctTrend,
  type TableColumn,
} from '@/components/admin';
import { formatUsd } from '../../shared/hotel.utils';
import { useHotelReportsPage } from '../hooks/useHotelReportsPage';
import type { GeneratedReport, ReportGranularity, ReportType } from '../admin-hotel-reports.types';

const TIPO_ICON: Record<ReportType, { icon: string; className: string }> = {
  Ventas: { icon: 'payments', className: 'bg-blue-100 text-blue-600' },
  Reservas: { icon: 'confirmation_number', className: 'bg-purple-100 text-purple-600' },
  Ocupación: { icon: 'hotel', className: 'bg-green-100 text-green-600' },
};

const GRANULARITY_LABEL: Record<ReportGranularity, string> = {
  day: 'día',
  week: 'semana',
  month: 'mes',
};

const formatDay = (iso: string) => format(parseISO(iso), 'dd/MM/yyyy');
const formatDateTime = (iso: string) => format(new Date(iso), 'dd/MM/yyyy, HH:mm');

export const HotelReportsPage = () => {
  const {
    isLoading,
    isExporting,
    dateLimits,
    filters,
    onRangeChange,
    onRoomChange,
    roomOptions,
    reportType,
    onReportTypeChange,
    data,
    visibleReports,
    canToggleReports,
    showAllReports,
    toggleShowAllReports,
    handleExportReport,
    handleDownloadReport,
    handleDeleteReport,
  } = useHotelReportsPage();

  const [chartMeasure, setChartMeasure] = useState<'ingresos' | 'reservas'>('ingresos');

  const summary = data?.summary;
  // Con una sola habitación elegida, el reparto por habitación no aporta nada.
  const showRoomBreakdown = (data?.revenueByRoom.length ?? 0) > 1;

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
        description="Visualiza estadísticas y métricas clave de tu hotel."
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
          <FilterField label="Habitación">
            <Select
              value={filters.roomId}
              onChange={(e) => onRoomChange(e.target.value)}
              containerClassName="w-56"
            >
              <option value="todas">Todas las habitaciones</option>
              {roomOptions.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.label}
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
              <option value="Reservas">Reservas</option>
              <option value="Ocupación">Ocupación</option>
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon="payments"
          iconClassName="bg-primary/10 text-primary"
          label="Ingresos"
          value={summary ? formatUsd(summary.ingresos) : '—'}
          {...pctTrend(summary?.ingresosDeltaPct)}
        />
        <StatCard
          icon="confirmation_number"
          iconClassName="bg-blue-100 text-blue-600"
          label="Reservas"
          value={summary?.reservas ?? '—'}
          {...pctTrend(summary?.reservasDeltaPct)}
        />
        <StatCard
          icon="hotel"
          iconClassName="bg-green-100 text-green-600"
          label="Ocupación promedio"
          value={summary ? `${summary.ocupacion}%` : '—'}
          {...pctTrend(summary?.ocupacionDeltaPts, 'pts')}
        />
        <StatCard
          icon="sell"
          iconClassName="bg-orange-100 text-orange-600"
          label="Tarifa promedio por noche"
          value={summary ? formatUsd(summary.tarifaPromedio) : '—'}
          {...pctTrend(summary?.tarifaDeltaPct)}
        />
        <StatCard
          icon="cancel"
          iconClassName="bg-red-100 text-alert"
          label="Tasa de cancelación"
          value={summary ? `${summary.tasaCancelacion}%` : '—'}
          caption={
            summary
              ? `${summary.cancelacionDeltaPts > 0 ? '+' : ''}${summary.cancelacionDeltaPts} pts vs periodo anterior`
              : undefined
          }
        />
        <StatCard
          icon="bedtime"
          iconClassName="bg-purple-100 text-purple-600"
          label="Estadía promedio"
          value={summary ? `${summary.estadiaPromedio} noches` : '—'}
          {...pctTrend(summary?.estadiaDeltaPct)}
        />
      </div>

      {showRoomBreakdown && data && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ChartCard title="Ingresos por habitación">
            <DonutChart
              data={data.revenueByRoom.map((item) => ({
                label: item.habitacion,
                value: item.ingresos,
                color: item.color,
              }))}
            />
          </ChartCard>

          <ChartCard title="Ocupación por habitación">
            <div className="flex flex-col gap-3">
              {data.occupancyByRoom.map((item) => (
                <ProgressListItem
                  key={item.habitacion}
                  label={item.habitacion}
                  value={item.ocupacion}
                  maxValue={100}
                  valueSuffix="%"
                />
              ))}
            </div>
          </ChartCard>
        </div>
      )}

      <ChartCard
        title={`${chartMeasure === 'ingresos' ? 'Ingresos' : 'Reservas'} por ${
          GRANULARITY_LABEL[data?.granularity ?? 'day']
        }`}
        action={
          <SegmentedControl
            aria-label="Medida del gráfico"
            value={chartMeasure}
            onChange={setChartMeasure}
            options={[
              { value: 'ingresos', label: 'Ingresos (USD)' },
              { value: 'reservas', label: 'Reservas' },
            ]}
          />
        }
      >
        <LineChart
          height={300}
          valueLabel={chartMeasure === 'ingresos' ? 'Ingresos' : 'Reservas'}
          valueFormatter={(value) =>
            chartMeasure === 'ingresos' ? formatUsd(value) : `${value} reservas`
          }
          data={(data?.series ?? []).map((item) => ({
            label: item.fecha,
            value: chartMeasure === 'ingresos' ? item.ingresos : item.reservas,
          }))}
        />
      </ChartCard>

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
