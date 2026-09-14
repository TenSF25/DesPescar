import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTicket,
  faUser,
  faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';

export const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <aside className="w-64 border-r bg-white p-6">
      <div className="flex flex-col gap-4">
        <button
          type="button"
          onClick={() => navigate('/booking/reservation')}
          className="flex items-center gap-3 rounded-lg bg-orange-500 px-4 py-3 text-white"
        >
          <FontAwesomeIcon icon={faTicket} className="w-4" />
          <span>Mis reservas</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/mis-datos')}
          className="flex items-center gap-3 rounded-lg px-4 py-3 text-left"
        >
          <FontAwesomeIcon icon={faUser} className="w-4" />
          <span>Mis datos</span>
        </button>
      </div>

      <hr className="my-6" />

      <button
        type="button"
        onClick={() => navigate('/')}
        className="flex w-full items-center gap-3 px-4 py-3 text-red-500"
      >
        <FontAwesomeIcon icon={faRightFromBracket} className="w-4" />
        <span>Cerrar sesión</span>
      </button>
    </aside>
  );
};