import { useEffect, useMemo, useState } from 'react';
import { getBookings, getBookingStats, updateBookingStatus } from '../services/bookingsService';
import type { AdminBooking, BookingStats, BookingStatus } from '../admin-bookings.types';

const PAGE_SIZE = 6;

const STAT_FIELD: Partial<Record<BookingStatus, 'confirmadas' | 'pendientes' | 'canceladas'>> = {
  Confirmada: 'confirmadas',
  Pendiente: 'pendientes',
  Cancelada: 'canceladas',
};

/** Mueve una reserva de un contador a otro cuando cambia su estado. */
const moveBetweenStats = (
  stats: BookingStats | null,
  from: BookingStatus,
  to: BookingStatus,
): BookingStats | null => {
  if (!stats) return stats;
  const next = { ...stats };
  const fromField = STAT_FIELD[from];
  const toField = STAT_FIELD[to];
  if (fromField) next[fromField] -= 1;
  if (toField) next[toField] += 1;
  return next;
};

export const useBookingsPage = () => {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [stats, setStats] = useState<BookingStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('todos');
  const [page, setPage] = useState(1);

  const [bookingToView, setBookingToView] = useState<AdminBooking | null>(null);
  const [bookingToCancel, setBookingToCancel] = useState<AdminBooking | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

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

  const changeStatus = async (booking: AdminBooking, estado: BookingStatus) => {
    setIsUpdating(true);
    const updated = await updateBookingStatus(booking.id, estado);
    setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
    setStats((prev) => moveBetweenStats(prev, booking.estado, estado));
    setIsUpdating(false);
  };

  const handleConfirmBooking = (booking: AdminBooking) => changeStatus(booking, 'Confirmada');

  const handleConfirmCancel = async () => {
    if (!bookingToCancel) return;
    await changeStatus(bookingToCancel, 'Cancelada');
    setBookingToCancel(null);
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

    bookingToView,
    openViewBooking: setBookingToView,
    closeViewBooking: () => setBookingToView(null),
    bookingToCancel,
    askCancelBooking: setBookingToCancel,
    closeCancelBooking: () => setBookingToCancel(null),
    isUpdating,
    handleConfirmBooking,
    handleConfirmCancel,
  };
};
