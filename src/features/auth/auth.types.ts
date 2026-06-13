interface BaseUser {
  name: string;
  lastName: string;
  email: string;
}

export interface RegisterData extends BaseUser {
  password: string;
}

export interface AuthResponse extends BaseUser {
  rolId: 'ADMIN' | 'CLIENT';
  registerDate: string;
  isActive: boolean;
  token?: string;
}

export interface LoginData {
  email: string;
  password: string;
}
