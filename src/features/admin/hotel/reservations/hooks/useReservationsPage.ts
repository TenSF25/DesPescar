import { useEffect, useMemo, useState } from 'react';
import { getReservations, updateReservationStatus } from '../../shared/hotelService';
import type { HotelReservation, ReservationStatus } from '../../shared/hotel.types';

const PAGE_SIZE = 8;

export const useReservationsPage = () => {
  const [reservations, setReservations] = useState<HotelReservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('todos');
  const [page, setPage] = useState(1);

  const [reservationToView, setReservationToView] = useState<HotelReservation | null>(null);
  const [reservationToCancel, setReservationToCancel] = useState<HotelReservation | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setIsLoading(true);
      const data = await getReservations();
      if (!isMounted) return;
      // Las más recientes (por check-in) primero.
      setReservations([...data].sort((a, b) => b.checkIn.localeCompare(a.checkIn)));
      setIsLoading(false);
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    const count = (estado: ReservationStatus) =>
      reservations.filter((r) => r.estado === estado).length;
    return {
      total: reservations.length,
      proximas: count('Próxima'),
      enEstadia: count('En estadía'),
      completadas: count('Completada'),
      canceladas: count('Cancelada'),
      ingresos: reservations
        .filter((r) => r.estado !== 'Cancelada')
        .reduce((total, r) => total + r.total, 0),
    };
  }, [reservations]);

  const filteredReservations = useMemo(() => {
    const query = search.trim().toLowerCase();
    return reservations.filter((r) => {
      const matchesSearch =
        query === '' ||
        r.codigo.toLowerCase().includes(query) ||
        r.huesped.toLowerCase().includes(query) ||
        r.email.toLowerCase().includes(query);
      const matchesEstado = estadoFilter === 'todos' || r.estado === estadoFilter;
      return matchesSearch && matchesEstado;
    });
  }, [reservations, search, estadoFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredReservations.length / PAGE_SIZE));
  const paginatedReservations = filteredReservations.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  const changeStatus = async (reservation: HotelReservation, estado: ReservationStatus) => {
    setIsUpdating(true);
    const updated = await updateReservationStatus(reservation.id, estado);
    setReservations((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    setIsUpdating(false);
  };

  const handleConfirmCancel = async () => {
    if (!reservationToCancel) return;
    await changeStatus(reservationToCancel, 'Cancelada');
    setReservationToCancel(null);
  };

  return {
    isLoading,
    stats,
    search,
    onSearchChange: (value: string) => {
      setSearch(value);
      setPage(1);
    },
    estadoFilter,
    onEstadoFilterChange: (value: string) => {
      setEstadoFilter(value);
      setPage(1);
    },
    page,
    setPage,
    totalPages,
    paginatedReservations,
    totalFiltered: filteredReservations.length,
    pageSize: PAGE_SIZE,

    reservationToView,
    openViewReservation: setReservationToView,
    closeViewReservation: () => setReservationToView(null),
    reservationToCancel,
    askCancelReservation: setReservationToCancel,
    closeCancelReservation: () => setReservationToCancel(null),
    isUpdating,
    handleCheckIn: (reservation: HotelReservation) => changeStatus(reservation, 'En estadía'),
    handleCheckOut: (reservation: HotelReservation) => changeStatus(reservation, 'Completada'),
    handleConfirmCancel,
  };
};
