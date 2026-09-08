import type { AdminNavItem } from '../../components/admin';

/**
 * Menú lateral del dashboard de Admin General.
 *
 * Vive acá (en features/admin/), NO en components/admin/layout/, porque
 * es específico de este dashboard. El componente compartido (AdminSidebar)
 * no sabe nada de "Panel general" ni "Usuarios" — solo pinta la lista que
 * le pasemos por prop.
 *
 * Cada dashboard (aerolínea, hotel) debería tener su propio archivo
 * análogo a este: features/airline/airlineDashboard.nav.ts,
 * features/hotel/hotelDashboard.nav.ts, etc.
 */
export const adminGeneralNavItems: AdminNavItem[] = [
  { label: 'Panel general', path: '/admin', icon: 'grid_view' },
  { label: 'Usuarios', path: '/admin/usuarios', icon: 'person' },
  { label: 'Reportes', path: '/admin/reportes', icon: 'bar_chart' },
  { label: 'Ajustes', path: '/admin/ajustes', icon: 'settings' },
];
