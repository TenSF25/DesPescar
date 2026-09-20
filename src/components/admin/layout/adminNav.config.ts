import type { AdminNavEntry } from '../admin.types';

/**
 * Items del menú lateral del panel de administrador.
 *
 * - `type: 'title'` → texto de sección, NO es un link (ej. "Dashboard").
 * - `type: 'link'`  → item navegable real.
 *
 * Para agregar una nueva sección del admin, sumar una entrada `type: 'link'`
 * acá y crear su página + ruta en `src/routes/index.tsx`.
 */
export const adminNavItems: AdminNavEntry[] = [
  { type: 'title', label: 'Dashboard', icon: 'grid_view' },
  { type: 'link', label: 'Usuarios', path: '/admin/usuarios', icon: 'person' },
  { type: 'link', label: 'Gestión de vuelos', path: '/admin/vuelos', icon: 'flight' },
  { type: 'link', label: 'Reservas', path: '/admin/reservas', icon: 'confirmation_number' },
  { type: 'link', label: 'Reportes', path: '/admin/reportes', icon: 'bar_chart' },
  { type: 'link', label: 'Ajustes', path: '/admin/ajustes', icon: 'settings' },
];
