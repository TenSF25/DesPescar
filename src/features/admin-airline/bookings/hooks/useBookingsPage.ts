import { useEffect, useMemo, useState } from 'react';
import { getBookings, getBookingStats } from '../services/bookingsService';
import type { AdminBooking, BookingStats } from '../admin-bookings.types';

const PAGE_SIZE = 6;

export const useBookingsPage = () => {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [stats, setStats] = useState<BookingStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('todos');
  const [page, setPage] = useState(1);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setIsLoading(true);
      const [bookingsData, statsData] = await Promise.all([getBookings(), getBookingStats()]);
      if (!isMounted) return;
      setBookings(bookingsData);
      setStats(statsData);
      setIsLoading(false);
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const query = search.trim().toLowerCase();
      const matchesSearch =
        query === '' ||
        booking.codigo.toLowerCase().includes(query) ||
        booking.pasajero.toLowerCase().includes(query) ||
        booking.numeroVuelo.toLowerCase().includes(query);
      const matchesEstado = estadoFilter === 'todos' || booking.estado === estadoFilter;
      return matchesSearch && matchesEstado;
    });
  }, [bookings, search, estadoFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / PAGE_SIZE));
  const paginatedBookings = filteredBookings.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleEstadoFilterChange = (value: string) => {
    setEstadoFilter(value);
    setPage(1);
  };

  return {
    isLoading,
    stats,
    search,
    onSearchChange: handleSearchChange,
    estadoFilter,
    onEstadoFilterChange: handleEstadoFilterChange,
    page,
    setPage,
    totalPages,
    paginatedBookings,
    totalFiltered: filteredBookings.length,
    pageSize: PAGE_SIZE,
  };
};
