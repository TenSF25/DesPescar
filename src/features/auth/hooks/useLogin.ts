import { useActionState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Login {
  error: string | null;
  exito: boolean;
  intentos: number;
}

export const useLogin = () => {
  const navigate = useNavigate();

  const loginAction = async (prevState: Login, formData: FormData): Promise<Login> => {
    const email = formData.get('email');
    const password = formData.get('password');

    if ('t@gmail.com' === email && '123' === password) {
      navigate('/my-reservations');

      return {
        error: null,
        exito: true,
        intentos: 0,
      };
    } else {
      return {
        error: 'Credenciales incorrectas',
        exito: false,
        intentos: prevState.intentos + 1,
      };
    }
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
