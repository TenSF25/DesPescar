import type { AdminNavItem } from '../admin.types';

/**
 * Items del menú lateral del panel de administrador.
 */
export const adminNavItems: AdminNavItem[] = [
  { label: 'Dashboard', path: '/admin', icon: 'grid_view' },
  { label: 'Usuarios', path: '/admin/usuarios', icon: 'person' },
  { label: 'Gestión de vuelos', path: '/admin/vuelos', icon: 'flight' },
  { label: 'Reservas', path: '/admin/reservas', icon: 'confirmation_number' },
  { label: 'Reportes', path: '/admin/reportes', icon: 'bar_chart' },
  { label: 'Ajustes', path: '/admin/ajustes', icon: 'settings' },
];
