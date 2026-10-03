import { useEffect, useState } from 'react';
import { getDashboardData } from '../services/dashboardService';
import type { DashboardData } from '../admin-dashboard.types';

export const useDashboardPage = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setIsLoading(true);
      const result = await getDashboardData();
      if (!isMounted) return;
      setData(result);
      setIsLoading(false);
    };

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  return { data, isLoading };
};
