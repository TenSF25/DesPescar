export type UserRole = 'Admin' | 'Cliente' | 'Soporte';
export type UserStatus = 'Activo' | 'Inactivo';

export interface AdminUser {
  id: string;
  nombre: string;
  email: string;
  rol: UserRole;
  estado: UserStatus;
  fechaRegistro: string; // ya formateada para mostrar, ej: "Hoy, 19:15 PM"
}

export interface UserStats {
  totalUsuarios: number;
  alertasSeguridad: number;
  reservas: number;
  ventasTotales: number;
}

export interface UsersByRoleDatum {
  rol: UserRole;
  cantidad: number;
}

export interface RecentActivityItem {
  id: string;
  icon: string;
  iconClassName: string;
  titulo: string;
  subtitulo: string;
  tiempo: string;
}
