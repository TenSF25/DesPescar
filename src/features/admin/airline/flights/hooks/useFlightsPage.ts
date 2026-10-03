import { useEffect, useMemo, useState } from 'react';
import { createFlight, deleteFlight, getFlights, getFlightStats } from '../services/flightsService';
import type { AdminFlight, FlightStats, NewFlightInput } from '../admin-flights.types';

const PAGE_SIZE = 5;

export const useFlightsPage = () => {
  const [flights, setFlights] = useState<AdminFlight[]>([]);
  const [stats, setStats] = useState<FlightStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('todos');
  const [origenFilter, setOrigenFilter] = useState('todos');
  const [page, setPage] = useState(1);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [flightToDelete, setFlightToDelete] = useState<AdminFlight | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setIsLoading(true);
      const [flightsData, statsData] = await Promise.all([getFlights(), getFlightStats()]);
      if (!isMounted) return;
      setFlights(flightsData);
      setStats(statsData);
      setIsLoading(false);
    };

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const origenOptions = useMemo(
    () => Array.from(new Set(flights.map((f) => f.origen))).sort(),
    [flights],
  );

  const filteredFlights = useMemo(() => {
    return flights.filter((flight) => {
      const query = search.trim().toLowerCase();
      const matchesSearch =
        query === '' ||
        flight.numero.toLowerCase().includes(query) ||
        flight.origen.toLowerCase().includes(query) ||
        flight.destino.toLowerCase().includes(query);
      const matchesEstado = estadoFilter === 'todos' || flight.estado === estadoFilter;
      const matchesOrigen = origenFilter === 'todos' || flight.origen === origenFilter;
      return matchesSearch && matchesEstado && matchesOrigen;
    });
  }, [flights, search, estadoFilter, origenFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredFlights.length / PAGE_SIZE));
  const paginatedFlights = filteredFlights.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleEstadoFilterChange = (value: string) => {
    setEstadoFilter(value);
    setPage(1);
  };

  const handleOrigenFilterChange = (value: string) => {
    setOrigenFilter(value);
    setPage(1);
  };

  const handleCreateFlight = async (input: NewFlightInput) => {
    setIsSaving(true);
    const created = await createFlight(input);
    setFlights((prev) => [created, ...prev]);
    setIsSaving(false);
    setIsAddModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!flightToDelete) return;
    setIsDeleting(true);
    await deleteFlight(flightToDelete.id);
    setFlights((prev) => prev.filter((f) => f.id !== flightToDelete.id));
    setIsDeleting(false);
    setFlightToDelete(null);
  };

  return {
    isLoading,
    stats,
    search,
    onSearchChange: handleSearchChange,
    estadoFilter,
    onEstadoFilterChange: handleEstadoFilterChange,
    origenFilter,
    onOrigenFilterChange: handleOrigenFilterChange,
    origenOptions,
    page,
    setPage,
    totalPages,
    paginatedFlights,
    totalFiltered: filteredFlights.length,
    pageSize: PAGE_SIZE,

    isAddModalOpen,
    openAddModal: () => setIsAddModalOpen(true),
    closeAddModal: () => setIsAddModalOpen(false),
    isSaving,
    handleCreateFlight,

    flightToDelete,
    askDeleteFlight: setFlightToDelete,
    cancelDeleteFlight: () => setFlightToDelete(null),
    isDeleting,
    handleConfirmDelete,
  };
};
