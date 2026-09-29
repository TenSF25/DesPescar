import { ChartCard } from '../../../components/admin';
import { Input } from '../../../components/ui/Input';
import { SaveRow } from './SaveRow';
import type { AdminProfile, FieldErrors, SaveStatus } from '../admin-settings.types';

interface ProfileSectionProps {
  profile: AdminProfile;
  errors: FieldErrors<AdminProfile>;
  status: SaveStatus;
  onChange: (campo: keyof AdminProfile, valor: string) => void;
  onSave: () => void;
}

/** Iniciales para el avatar, igual que el que muestra el AdminHeader. */
const iniciales = (nombre: string, apellido: string) =>
  `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();

export const ProfileSection = ({
  profile,
  errors,
  status,
  onChange,
  onSave,
}: ProfileSectionProps) => {
  return (
    <ChartCard title="Mi perfil">
      <div className="flex flex-col gap-5">
        <div className="flex flex-row items-center gap-4">
          <span
            className="bg-primary flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white"
            aria-hidden="true"
          >
            {iniciales(profile.nombre, profile.apellido)}
          </span>
          <div className="flex flex-col">
            <p className="text-secondary font-semibold">
              {profile.nombre} {profile.apellido}
            </p>
            <p className="text-[13px] text-[#44474E]">{profile.cargo}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            contentLabel="Nombre"
            value={profile.nombre}
            error={errors.nombre}
            onChange={(event) => onChange('nombre', event.target.value)}
          />
          <Input
            contentLabel="Apellido"
            value={profile.apellido}
            error={errors.apellido}
            onChange={(event) => onChange('apellido', event.target.value)}
          />
          <Input
            contentLabel="Correo electrónico"
            type="email"
            value={profile.email}
            error={errors.email}
            onChange={(event) => onChange('email', event.target.value)}
          />
          <Input
            contentLabel="Teléfono"
            type="tel"
            value={profile.telefono}
            error={errors.telefono}
            onChange={(event) => onChange('telefono', event.target.value)}
          />
          <Input
            contentLabel="Cargo"
            containerClassname="sm:col-span-2"
            value={profile.cargo}
            error={errors.cargo}
            onChange={(event) => onChange('cargo', event.target.value)}
          />
        </div>

        <SaveRow status={status} onSave={onSave} successMessage="Perfil actualizado." />
      </div>
    </ChartCard>
  );
};
