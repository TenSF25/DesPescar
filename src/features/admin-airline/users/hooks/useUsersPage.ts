import { useEffect, useMemo, useState } from 'react';
import { getRecentActivity, getUserStats, getUsers, getUsersByRole } from '../services/usersService';
import type { AdminUser, RecentActivityItem, UserStats, UsersByRoleDatum } from '../admin-users.types';

const PAGE_SIZE = 6;

/**
 * Toda la lógica de la página de Usuarios vive acá (carga de datos,
 * búsqueda, filtros y paginación). `UsersPage.tsx` solo consume lo que
 * este hook devuelve y arma el JSX.
 */
export const useUsersPage = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [usersByRole, setUsersByRole] = useState<UsersByRoleDatum[]>([]);
  const [activity, setActivity] = useState<RecentActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('todos');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [page, setPage] = useState(1);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setIsLoading(true);
      const [usersData, statsData, byRoleData, activityData] = await Promise.all([
        getUsers(),
        getUserStats(),
        getUsersByRole(),
        getRecentActivity(),
      ]);

      if (!isMounted) return;
      setUsers(usersData);
      setStats(statsData);
      setUsersByRole(byRoleData);
      setActivity(activityData);
      setIsLoading(false);
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filtrado en el cliente (sobre el mock). Cuando se conecte el backend,
  // esto se reemplaza mandando `search`, `roleFilter`, `statusFilter` y
  // `page` como params de `getUsers(...)`.
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const query = search.trim().toLowerCase();
      const matchesSearch =
        query === '' ||
        user.nombre.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query);
      const matchesRole = roleFilter === 'todos' || user.rol === roleFilter;
      const matchesStatus = statusFilter === 'todos' || user.estado === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const paginatedUsers = filteredUsers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleRoleFilterChange = (value: string) => {
    setRoleFilter(value);
    setPage(1);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setPage(1);
  };

  return {
    isLoading,
    stats,
    usersByRole,
    activity,
    search,
    onSearchChange: handleSearchChange,
    roleFilter,
    onRoleFilterChange: handleRoleFilterChange,
    statusFilter,
    onStatusFilterChange: handleStatusFilterChange,
    page,
    setPage,
    totalPages,
    paginatedUsers,
    totalFiltered: filteredUsers.length,
    pageSize: PAGE_SIZE,
  };
};
