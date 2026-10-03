import { useEffect, useState } from 'react';
import { getHotelDashboardData } from '../services/hotelDashboardService';
import type { HotelDashboardData } from '../admin-hotel-dashboard.types';

export const useHotelDashboardPage = () => {
  const [data, setData] = useState<HotelDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setIsLoading(true);
      const result = await getHotelDashboardData();
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
