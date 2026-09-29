import { ChartCard } from '../../../components/admin';
import { Input } from '../../../components/ui/Input';
import { SaveRow } from './SaveRow';
import { MIN_PASSWORD_LENGTH } from '../utils/validators';
import type { FieldErrors, PasswordChange, SaveStatus } from '../admin-settings.types';

interface SecuritySectionProps {
  password: PasswordChange;
  errors: FieldErrors<PasswordChange>;
  serverError: string | null;
  status: SaveStatus;
  onChange: (campo: keyof PasswordChange, valor: string) => void;
  onSave: () => void;
}

export const SecuritySection = ({
  password,
  errors,
  serverError,
  status,
  onChange,
  onSave,
}: SecuritySectionProps) => {
  return (
    <ChartCard title="Seguridad">
      <div className="flex flex-col gap-5">
        <p className="text-[13px] text-[#44474E]">
          Cambiá tu contraseña. Tiene que tener al menos {MIN_PASSWORD_LENGTH} caracteres.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            contentLabel="Contraseña actual"
            type="password"
            autoComplete="current-password"
            containerClassname="sm:col-span-2"
            value={password.actual}
            error={errors.actual}
            onChange={(event) => onChange('actual', event.target.value)}
          />
          <Input
            contentLabel="Contraseña nueva"
            type="password"
            autoComplete="new-password"
            value={password.nueva}
            error={errors.nueva}
            onChange={(event) => onChange('nueva', event.target.value)}
          />
          <Input
            contentLabel="Repetir contraseña nueva"
            type="password"
            autoComplete="new-password"
            value={password.repetir}
            error={errors.repetir}
            onChange={(event) => onChange('repetir', event.target.value)}
          />
        </div>

        <SaveRow
          status={status}
          onSave={onSave}
          label="Cambiar contraseña"
          successMessage="Contraseña actualizada."
          errorMessage={serverError}
        />
      </div>
    </ChartCard>
  );
};
