import { useEffect, useState } from 'react';
import { downloadTextFile } from '@/utils/downloadFile';
import {
  buildReportFile,
  createReport,
  deleteReport,
  getDefaultReportFilters,
  getHotelReportsData,
  getRecentReports,
  getReportsDateLimits,
  getRoomOptions,
} from '../services/hotelReportsService';
import type {
  GeneratedReport,
  HotelReportsData,
  ReportFilters,
  ReportType,
  RoomOption,
} from '../admin-hotel-reports.types';

const COLLAPSED_REPORTS = 5;

export const useHotelReportsPage = () => {
  const [filters, setFilters] = useState<ReportFilters>(getDefaultReportFilters);
  const [reportType, setReportType] = useState<ReportType>('Ventas');
  const [data, setData] = useState<HotelReportsData | null>(null);
  const [roomOptions, setRoomOptions] = useState<RoomOption[]>([]);
  const [recentReports, setRecentReports] = useState<GeneratedReport[]>([]);
  const [showAllReports, setShowAllReports] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  // Opciones de habitación y lista de reportes: se cargan una sola vez.
  useEffect(() => {
    let isMounted = true;

    const loadStatic = async () => {
      const [rooms, reports] = await Promise.all([getRoomOptions(), getRecentReports()]);
      if (!isMounted) return;
      setRoomOptions(rooms);
      setRecentReports(reports);
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
      const result = await getHotelReportsData(filters);
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

  return {
    isLoading,
    isExporting,
    dateLimits: getReportsDateLimits(),
    filters,
    onRangeChange: (range: { from: string; to: string }) =>
      setFilters((prev) => ({ ...prev, ...range })),
    onRoomChange: (roomId: string) => setFilters((prev) => ({ ...prev, roomId })),
    roomOptions,
    reportType,
    onReportTypeChange: setReportType,
    data,
    visibleReports: showAllReports ? recentReports : recentReports.slice(0, COLLAPSED_REPORTS),
    canToggleReports: recentReports.length > COLLAPSED_REPORTS,
    showAllReports,
    toggleShowAllReports: () => setShowAllReports((prev) => !prev),
    handleExportReport,
    handleDownloadReport,
    handleDeleteReport,
  };
};
