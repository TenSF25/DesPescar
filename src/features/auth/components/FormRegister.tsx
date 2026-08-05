import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

export const FormRegister = () => {
  return (
    <div className="flex w-100 flex-col items-center gap-4">
      <h4 className="text-[20px] font-semibold text-[#64748B]">Crea una cuenta</h4>
      <div className="w-full">
        <form className="flex w-full flex-col gap-4">
          <Input contentLabel="Nombre" type="text" placeholder="Escriba su nombre..." />
          <Input contentLabel="Apellido" type="text" placeholder="Escriba su apellido..." />
          <Input contentLabel="Telefono" type="number" placeholder="+54 011 3485-2345" />
          <Input contentLabel="Correo electrónico" type="email" placeholder="tu@gmail.com" />
          <Input contentLabel="Contraseña" type="password" placeholder="*********" />
          <Input
            contentLabel="¿Aceptas los términos y condiciones?"
            type="checkbox"
            placeholder="*********"
            className="w-4"
            containerClassname={'flex-row justify-between'}
          />
        </form>
      </div>
      <div className="flex w-full flex-col items-center gap-4">
        <Button variant="primary" className="bg-[#FF6B00] text-white">
          Registrarse
        </Button>
      </div>
      <Link to="/login">
        <h5 className="cursor-pointer text-[#FF6B00]">¿Ya tienes cuenta? Inicia sesión</h5>
      </Link>
    </div>
  );
};
