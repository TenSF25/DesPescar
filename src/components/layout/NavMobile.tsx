import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

interface NavMobile {
  open: boolean;
  authenticated?: boolean;
}

export const NavMobile = ({ open, authenticated = false }: NavMobile) => {
  return (
    <>
      {open && (
        <div className="flex flex-col md:hidden">
          <ul className="flex w-full flex-col justify-between border-t text-center">
            <li className="hover:bg-secondary border-b p-1 underline-offset-4 hover:cursor-pointer hover:font-bold hover:text-white">
              VUELOS
            </li>
            <li className="hover:bg-secondary border-b p-1 underline-offset-4 hover:cursor-pointer hover:font-bold hover:text-white">
              INSPIRACIONES
            </li>
            <li className="hover:bg-secondary p-1 underline-offset-4 hover:cursor-pointer hover:font-bold hover:text-white">
              OFERTAS
            </li>
          </ul>
          <Link to={authenticated ? '/' : '/login'}>
            <Button
              variant="primary"
              className="flex w-full justify-center rounded-none text-[14px] md:hidden"
            >
              {authenticated ? 'CERRAR SESIÓN' : 'INICIAR SESIÓN'}
            </Button>
          </Link>
        </div>
      )}
    </>
  );
};
