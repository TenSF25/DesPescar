import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { useLogin } from '../hooks/useLogin';

export const FormComponent = () => {
  const { state, formAction } = useLogin();

  const cuentaBloqueada = state.intentos > 3;

  return (
    <div className="flex w-100 flex-col items-center gap-4">
      <h4 className="text-[20px] font-semibold text-[#64748B]">Inicia sesión en tu cuenta</h4>
      <div className="w-full">
        <form action={formAction} method="POST" className="flex w-full flex-col gap-4">
          {state?.error && <p className="text-alert">{state.error}</p>}
          {cuentaBloqueada && <p>Cuenta bloqueada</p>}
          <Input
            contentLabel="Correo electrónico"
            type="email"
            name="email"
            placeholder="tu@gmail.com"
            required
          />
          <Input
            contentLabel="Contraseña"
            type="password"
            name="password"
            placeholder="*********"
          />
          <Button variant="primary" className="bg-[#FF6B00] text-white">
            Iniciar Sesión
          </Button>
        </form>
      </div>
      <div className="flex w-full flex-col items-center gap-4">
        <span>o</span>
        <Button variant="secondary" className="border-black bg-white text-black">
          <i className="fa-brands fa-google"></i>
          Continuar con Google
        </Button>
        <Button variant="secondary" className="border-black bg-white text-black">
          <i className="fa-brands fa-apple"></i>
          Continuar con Apple
        </Button>
      </div>
      <h5 className="cursor-pointer text-[#FF6B00]">¿Olvidaste tu contraseña?</h5>
      <Link to="/register">
        <h5 className="cursor-pointer text-[#FF6B00]">¿No tienes cuenta? Registrate</h5>
      </Link>
    </div>
  );
};
