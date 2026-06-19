import { Button } from '../ui/Button';
import { useNav } from './hooks/useNav';
import { NavMobile } from './NavMobile';

export const Nav = () => {
  const { isOpen, toggleMenu } = useNav();

  return (
    <>
      <header className="w-full">
        <nav className="flex w-full flex-row items-center justify-between gap-3 p-4 pr-8 pl-8">
          <h3 className="text-secondary text-3xl font-bold tracking-widest">DESPESCAR</h3>
          <ul className="hidden w-100 flex-row justify-between md:flex">
            <li className="hover:text-primary underline-offset-4 hover:cursor-pointer hover:font-bold hover:underline">
              VUELOS
            </li>
            <li className="hover:text-primary underline-offset-4 hover:cursor-pointer hover:font-bold hover:underline">
              INSPIRACIONES
            </li>
            <li className="hover:text-primary underline-offset-4 hover:cursor-pointer hover:font-bold hover:underline">
              OFERTAS
            </li>
          </ul>
          <Button variant="secondary" className="hidden w-40 justify-center text-[14px] md:flex">
            INICIAR SESIÓN
          </Button>
          <div className="flex cursor-pointer justify-center md:hidden" onClick={toggleMenu}>
            <span className="material-symbols-outlined">{isOpen ? 'close' : 'menu'}</span>
          </div>
        </nav>
      </header>

      <NavMobile open={isOpen} />
    </>
  );
};
