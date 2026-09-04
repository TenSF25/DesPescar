import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPlane, faGear, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

export const UserSidebar = () => {
  const navigate = useNavigate();

  return (
    <aside className="w-48 shrink-0 rounded-2xl bg-white p-3 shadow-md">
      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={() => navigate('/mis-datos')}
          className="flex w-full items-center gap-3 rounded-lg bg-orange-500 px-4 py-3 text-left text-sm text-white shadow-md"
        >
          <FontAwesomeIcon icon={faUser} className="w-4" />
          <span>Mi perfil</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/booking/reservation')}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm text-gray-700"
        >
          <FontAwesomeIcon icon={faPlane} className="w-4" />
          <span>Mis vuelos</span>
        </button>

        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm text-gray-700"
        >
          <FontAwesomeIcon icon={faGear} className="w-4" />
          <span>Ajustes</span>
        </button>
      </div>

      <div className="my-5 border-t" />

      <button
        type="button"
        onClick={() => navigate('/')}
        className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm text-red-500"
      >
        <FontAwesomeIcon icon={faRightFromBracket} className="w-4" />
        <span>Cerrar sesión</span>
      </button>
    </aside>
  );
};
