import type { AdminNavItem } from '@/components/admin';

/**
 * Menú lateral del panel de Admin General (rol SUPER_ADMIN).
 * Cada panel (general, aerolínea, hotel) define el suyo en su propia carpeta;
 * el sidebar compartido solo pinta la lista que recibe.
 */
export const generalNavItems: AdminNavItem[] = [
  { label: 'Panel general', path: '/admin', icon: 'grid_view', end: true },
  { label: 'Usuarios', path: '/admin/usuarios', icon: 'person' },
];
