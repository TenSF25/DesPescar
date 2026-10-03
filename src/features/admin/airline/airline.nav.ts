import type { AdminNavItem } from '@/components/admin';

/** Menú lateral del panel de Aerolínea (rol AIRLINE_ADMIN). */
export const airlineNavItems: AdminNavItem[] = [
  { label: 'Panel general', path: '/admin/aerolinea', icon: 'grid_view', end: true },
  { label: 'Gestión de vuelos', path: '/admin/aerolinea/vuelos', icon: 'flight' },
  { label: 'Reservas', path: '/admin/aerolinea/reservas', icon: 'confirmation_number' },
  { label: 'Reportes', path: '/admin/aerolinea/reportes', icon: 'bar_chart' },
];
