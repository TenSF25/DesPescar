import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faUserCircle, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

type PersonalInfoFormProps = {
  onSave: () => void;
};

export const PersonalInfoForm = ({ onSave }: PersonalInfoFormProps) => {
  const [nombre, setNombre] = useState('Melina Celeste');
  const [apellido, setApellido] = useState('Cora');
  const [email, setEmail] = useState('melinacora97@gmail.com');
  const [telefono, setTelefono] = useState('1153311347');
  const [password, setPassword] = useState('12345678');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSave();
  };

  const inputClass =
    'w-full rounded-xl border-0 bg-gray-100 px-4 py-2.5 pr-10 text-sm text-gray-800 shadow-sm outline-none focus:ring-2 focus:ring-orange-300';

  return (
    <form onSubmit={handleSubmit} className="mt-4 rounded-xl bg-white p-4 shadow-md">
      <div className="flex items-center gap-3 border-b pb-2">
        <FontAwesomeIcon icon={faUserCircle} className="text-2xl text-black" />

        <h2 className="text-xl font-medium text-gray-900">Información personal</h2>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-x-4 gap-y-2 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700 uppercase">Nombre</label>

          <input
            value={nombre}
            onChange={(event) => setNombre(event.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700 uppercase">Email</label>

          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={inputClass}
            />

            <FontAwesomeIcon
              icon={faPenToSquare}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-orange-400"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700 uppercase">Apellido</label>

          <input
            value={apellido}
            onChange={(event) => setApellido(event.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700 uppercase">Teléfono</label>

          <div className="relative">
            <input
              value={telefono}
              onChange={(event) => setTelefono(event.target.value)}
              className={inputClass}
            />

            <FontAwesomeIcon
              icon={faPenToSquare}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-orange-400"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700 uppercase">
            Contraseña
          </label>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={inputClass}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-600"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>
        </div>

        <div className="flex items-end justify-end">
          <button
            type="submit"
            className="rounded-xl bg-green-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-green-600"
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </form>
  );
};
