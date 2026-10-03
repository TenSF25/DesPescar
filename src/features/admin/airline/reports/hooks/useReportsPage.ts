import { useEffect, useState } from 'react';
import { downloadTextFile } from '@/utils/downloadFile';
import {
  buildReportFile,
  createReport,
  deleteReport,
  getDefaultReportFilters,
  getRecentReports,
  getReportFlights,
  getReportsData,
  getReportsDateLimits,
} from '../services/reportsService';
import type {
  GeneratedReport,
  ReportFilters,
  ReportFlightOption,
  ReportsData,
  ReportType,
} from '../admin-reports.types';

const COLLAPSED_REPORTS = 5;

export const useReportsPage = () => {
  const [filters, setFilters] = useState<ReportFilters>(getDefaultReportFilters);
  const [reportType, setReportType] = useState<ReportType>('Ventas');
  const [data, setData] = useState<ReportsData | null>(null);
  const [flightOptions, setFlightOptions] = useState<ReportFlightOption[]>([]);
  const [recentReports, setRecentReports] = useState<GeneratedReport[]>([]);
  const [showAllReports, setShowAllReports] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  // Opciones de vuelo y lista de reportes: se cargan una sola vez.
  useEffect(() => {
    let isMounted = true;

    const loadStatic = async () => {
      const [flightsData, reportsData] = await Promise.all([
        getReportFlights(),
        getRecentReports(),
      ]);
      if (!isMounted) return;
      setFlightOptions(flightsData);
      setRecentReports(reportsData);
    };

    loadStatic();
    return () => {
      isMounted = false;
    };
  }, []);

  // Indicadores y gráficos: se recalculan cada vez que cambia un filtro.
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setIsLoading(true);
      const result = await getReportsData(filters);
      if (!isMounted) return;
      setData(result);
      setIsLoading(false);
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, [filters]);

  const handleExportReport = async () => {
    setIsExporting(true);
    const [report, file] = await Promise.all([
      createReport(reportType, filters),
      buildReportFile(reportType, filters),
    ]);
    downloadTextFile(file.filename, file.content);
    setRecentReports((prev) => [report, ...prev]);
    setIsExporting(false);
  };

  const handleDownloadReport = async (report: GeneratedReport) => {
    const file = await buildReportFile(report.tipo, report);
    downloadTextFile(file.filename, file.content);
  };

  const handleDeleteReport = async (id: string) => {
    await deleteReport(id);
    setRecentReports((prev) => prev.filter((r) => r.id !== id));
  };

  const visibleReports = showAllReports ? recentReports : recentReports.slice(0, COLLAPSED_REPORTS);

  const allData = data?.scope === 'all' ? data : null;
  const flightData = data?.scope === 'flight' ? data : null;

  const maxDestinationValue = Math.max(
    1,
    ...(allData?.topDestinations ?? []).map((d) => d.reservas),
  );

  return {
    isLoading,
    isExporting,
    dateLimits: getReportsDateLimits(),
    filters,
    onRangeChange: (range: { from: string; to: string }) =>
      setFilters((prev) => ({ ...prev, ...range })),
    onFlightChange: (flightId: string) => setFilters((prev) => ({ ...prev, flightId })),
    flightOptions,
    reportType,
    onReportTypeChange: setReportType,
    /** Solo cuando se ven todos los vuelos. */
    summary: allData?.summary ?? null,
    /** Solo cuando se filtra por un vuelo puntual. */
    flightData,
    salesByDay: data?.salesByDay ?? [],
    granularity: allData?.granularity ?? 'day',
    bookingsByOrigin: allData?.bookingsByOrigin ?? [],
    topDestinations: allData?.topDestinations ?? [],
    maxDestinationValue,
    visibleReports,
    canToggleReports: recentReports.length > COLLAPSED_REPORTS,
    showAllReports,
    toggleShowAllReports: () => setShowAllReports((prev) => !prev),
    handleExportReport,
    handleDownloadReport,
    handleDeleteReport,
  };
};
