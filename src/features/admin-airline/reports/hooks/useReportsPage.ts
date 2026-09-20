import { useEffect, useState } from 'react';
import {
  exportReport,
  getBookingsByOrigin,
  getRecentReports,
  getReportsSummary,
  getSalesByDay,
  getTopDestinations,
} from '../services/reportsService';
import type {
  BookingsByOriginDatum,
  GeneratedReport,
  ReportsSummary,
  SalesByDayDatum,
  TopDestinationDatum,
} from '../admin-reports.types';

export const useReportsPage = () => {
  const [summary, setSummary] = useState<ReportsSummary | null>(null);
  const [salesByDay, setSalesByDay] = useState<SalesByDayDatum[]>([]);
  const [bookingsByOrigin, setBookingsByOrigin] = useState<BookingsByOriginDatum[]>([]);
  const [topDestinations, setTopDestinations] = useState<TopDestinationDatum[]>([]);
  const [recentReports, setRecentReports] = useState<GeneratedReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setIsLoading(true);
      const [summaryData, salesData, originData, destinationsData, reportsData] = await Promise.all([
        getReportsSummary(),
        getSalesByDay(),
        getBookingsByOrigin(),
        getTopDestinations(),
        getRecentReports(),
      ]);

      if (!isMounted) return;
      setSummary(summaryData);
      setSalesByDay(salesData);
      setBookingsByOrigin(originData);
      setTopDestinations(destinationsData);
      setRecentReports(reportsData);
      setIsLoading(false);
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleExportReport = async () => {
    setIsExporting(true);
    await exportReport();
    setIsExporting(false);
  };

  const maxDestinationValue = Math.max(1, ...topDestinations.map((d) => d.reservas));

  return {
    isLoading,
    summary,
    salesByDay,
    bookingsByOrigin,
    topDestinations,
    maxDestinationValue,
    recentReports,
    isExporting,
    handleExportReport,
  };
};
