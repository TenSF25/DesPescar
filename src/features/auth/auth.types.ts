interface BaseUser {
  name: string;
  lastName: string;
  email: string;
}

/**
 * Roles de la plataforma Despescar. Este kit solo implementa la pantalla y
 * el login de GENERAL_ADMIN; los otros tres ya están (o se están armando)
 * en sus propios dashboards.
 */
export type RolId = 'GENERAL_ADMIN' | 'AIRLINE_ADMIN' | 'HOTEL_ADMIN' | 'CLIENT';

export interface RegisterData extends BaseUser {
  password: string;
}

export interface AuthResponse extends BaseUser {
  rolId: RolId;
  registerDate: string;
  isActive: boolean;
  token?: string;
}

export interface LoginData {
  email: string;
  password: string;
}
