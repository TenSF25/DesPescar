/** Roles del backend (identity-service). El rol llega en `user.role` de /users/me. */
export type Role = 'SUPER_ADMIN' | 'AIRLINE_ADMIN' | 'HOTEL_ADMIN' | 'USER';

/** Home de cada rol: a dónde se lo manda después del login o si entra a un panel ajeno. */
const ROLE_HOME: Record<string, string> = {
  SUPER_ADMIN: '/admin',
  AIRLINE_ADMIN: '/admin/aerolinea',
  HOTEL_ADMIN: '/admin/hotel',
};

export const getHomeForRole = (role?: string) => (role && ROLE_HOME[role]) || '/';
