import type { AdminNavItem } from '@/components/admin';

/** Menú lateral del panel de Hotel (rol HOTEL_ADMIN). */
export const hotelNavItems: AdminNavItem[] = [
  { label: 'Panel general', path: '/admin/hotel', icon: 'grid_view', end: true },
  { label: 'Gestión de mi hotel', path: '/admin/hotel/gestion', icon: 'hotel' },
  { label: 'Reservas', path: '/admin/hotel/reservas', icon: 'confirmation_number' },
  { label: 'Reportes', path: '/admin/hotel/reportes', icon: 'bar_chart' },
];
