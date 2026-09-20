import { mockDelay } from '../../../../services/mockDelay';
// import { apiRequest } from '../../../../services/apiClient';
// import { API_CONFIG } from '../../../../services/apiConfig';
import type { AdminUser, RecentActivityItem, UserStats, UsersByRoleDatum } from '../admin-users.types';

const MOCK_USERS: AdminUser[] = [
  { id: 'u1', nombre: 'Susana Gómez', email: 'susana.gomez@email.com', rol: 'Admin', estado: 'Inactivo', fechaRegistro: 'Ayer, 13:45 PM' },
  { id: 'u2', nombre: 'Roberto Roa', email: 'roberto.roa@email.com', rol: 'Cliente', estado: 'Activo', fechaRegistro: 'Hoy, 19:15 PM' },
  { id: 'u3', nombre: 'Pablo Molina', email: 'pablo.molina@email.com', rol: 'Admin', estado: 'Activo', fechaRegistro: 'Hoy, 18:15 AM' },
  { id: 'u4', nombre: 'Lucía Fernández', email: 'lucia.fernandez@email.com', rol: 'Cliente', estado: 'Activo', fechaRegistro: 'Hoy, 16:02 PM' },
  { id: 'u5', nombre: 'Martín Castro', email: 'martin.castro@email.com', rol: 'Soporte', estado: 'Activo', fechaRegistro: 'Hoy, 11:40 AM' },
  { id: 'u6', nombre: 'Valentina Ruiz', email: 'valentina.ruiz@email.com', rol: 'Cliente', estado: 'Inactivo', fechaRegistro: '02 Sep, 09:12 AM' },
  { id: 'u7', nombre: 'Diego Herrera', email: 'diego.herrera@email.com', rol: 'Cliente', estado: 'Activo', fechaRegistro: '01 Sep, 20:30 PM' },
  { id: 'u8', nombre: 'Camila Torres', email: 'camila.torres@email.com', rol: 'Soporte', estado: 'Activo', fechaRegistro: '01 Sep, 15:05 PM' },
];

const MOCK_STATS: UserStats = {
  totalUsuarios: 1667,
  alertasSeguridad: 380,
  reservas: 37,
  ventasTotales: 1900000,
};

const MOCK_USERS_BY_ROLE: UsersByRoleDatum[] = [
  { rol: 'Admin', cantidad: 534 },
  { rol: 'Cliente', cantidad: 967 },
  { rol: 'Soporte', cantidad: 166 },
];

const MOCK_ACTIVITY: RecentActivityItem[] = [
  {
    id: 'a1',
    icon: 'shield',
    iconClassName: 'bg-red-100 text-alert',
    titulo: 'Nuevo inicio de sesión en dispositivo desconocido',
    subtitulo: 'Usuario: susana.gomez@email.com',
    tiempo: 'Hoy, 14:23 PM',
  },
  {
    id: 'a2',
    icon: 'person',
    iconClassName: 'bg-green-100 text-green-600',
    titulo: 'Actualización de perfil',
    subtitulo: 'Usuario: roberto.roa@email.com',
    tiempo: 'Hoy, 12:15 PM',
  },
  {
    id: 'a3',
    icon: 'flight',
    iconClassName: 'bg-blue-100 text-blue-600',
    titulo: 'Nueva reserva realizada',
    subtitulo: 'Usuario: pablo.molina@email.com',
    tiempo: 'Hoy, 10:45 AM',
  },
];

// TODO(backend): reemplazar por
// apiRequest<AdminUser[]>(API_CONFIG.usersServiceUrl, '/usuarios', { params: { search, rol, estado, page } })
export const getUsers = async (): Promise<AdminUser[]> => {
  await mockDelay();
  return MOCK_USERS;
};

// TODO(backend): apiRequest<UserStats>(API_CONFIG.usersServiceUrl, '/usuarios/stats')
export const getUserStats = async (): Promise<UserStats> => {
  await mockDelay();
  return MOCK_STATS;
};

// TODO(backend): apiRequest<UsersByRoleDatum[]>(API_CONFIG.usersServiceUrl, '/usuarios/por-rol')
export const getUsersByRole = async (): Promise<UsersByRoleDatum[]> => {
  await mockDelay();
  return MOCK_USERS_BY_ROLE;
};

// TODO(backend): apiRequest<RecentActivityItem[]>(API_CONFIG.usersServiceUrl, '/usuarios/actividad-reciente')
export const getRecentActivity = async (): Promise<RecentActivityItem[]> => {
  await mockDelay();
  return MOCK_ACTIVITY;
};
