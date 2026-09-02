import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTicket, faUser, faGear, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

export const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <aside className="w-64 border-r bg-white p-6">
      <div className="flex flex-col gap-4">
        <button
          onClick={() => navigate('/booking/reservation')}
          className="flex items-center gap-3 rounded-lg bg-orange-500 px-4 py-3 text-white"
        >
          <FontAwesomeIcon icon={faTicket} className="w-4" />
          <span>Mis reservas</span>
        </button>

        <div className="flex items-center gap-3 rounded-lg px-4 py-3">
          <FontAwesomeIcon icon={faUser} className="w-4" />
          <span>Mis datos</span>
        </div>

        <div className="flex items-center gap-3 rounded-lg px-4 py-3">
          <FontAwesomeIcon icon={faGear} className="w-4" />
          <span>Ajustes</span>
        </div>
      </div>

      <hr className="my-6" />

      <button
        onClick={() => navigate('/')}
        className="flex w-full items-center gap-3 px-4 py-3 text-red-500"
      >
        <FontAwesomeIcon icon={faRightFromBracket} className="w-4" />
        <span>Cerrar sesión</span>
      </button>
    </aside>
  );
};
