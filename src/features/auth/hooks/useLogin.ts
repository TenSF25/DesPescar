import { useActionState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setAuthUser } from '../store/useAuthStore';
import type { AuthResponse, RolId } from '../auth.types';

interface Login {
  error: string | null;
  exito: boolean;
  intentos: number;
}

/**
 * Mock de "base de datos" de usuarios para probar el login por rol
 * mientras no hay backend conectado en este kit. Cada dashboard define a
 * dónde redirige a su rol; acá solo resolvemos GENERAL_ADMIN, que es el
 * que estamos construyendo.
 */
const mockUsers: (AuthResponse & { password: string; redirectTo: string })[] = [
  {
    name: 'Daiana',
    lastName: 'Admin',
    email: 'admin@despescar.com',
    password: 'Admin123',
    rolId: 'GENERAL_ADMIN',
    registerDate: '2026-01-01',
    isActive: true,
    redirectTo: '/admin',
  },
  {
    name: 'Usuario',
    lastName: 'Cliente',
    email: 't@gmail.com',
    password: '123',
    rolId: 'CLIENT',
    registerDate: '2026-01-01',
    isActive: true,
    redirectTo: '/',
  },
];

const redirectByRol: Record<RolId, string> = {
  GENERAL_ADMIN: '/admin',
  AIRLINE_ADMIN: '/airline',
  HOTEL_ADMIN: '/hotel',
  CLIENT: '/',
};

export const useLogin = () => {
  const navigate = useNavigate();

  const loginAction = async (prevState: Login, formData: FormData): Promise<Login> => {
    const email = formData.get('email');
    const password = formData.get('password');

    const match = mockUsers.find((u) => u.email === email && u.password === password);

    if (match) {
      const { password: _password, redirectTo, ...user } = match;
      void _password;

      setAuthUser(user);
      navigate(redirectTo ?? redirectByRol[user.rolId]);

      return {
        error: null,
        exito: true,
        intentos: 0,
      };
    }

    return {
      error: 'Credenciales incorrectas',
      exito: false,
      intentos: prevState.intentos + 1,
    };
  };

  const [state, formAction] = useActionState(loginAction, {
    error: null,
    exito: false,
    intentos: 0,
  });

  return {
    state,
    formAction,
  };
};
