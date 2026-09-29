import { Button } from '../../../components/ui/Button';
import type { SaveStatus } from '../admin-settings.types';

interface SaveRowProps {
  status: SaveStatus;
  onSave: () => void;
  /** Mensaje que se muestra al guardar bien. */
  successMessage: string;
  /** Error que vino del servidor (el de validación lo muestra cada campo). */
  errorMessage?: string | null;
  label?: string;
}

/**
 * Pie de cada tarjeta de Ajustes: el botón de guardar más el mensaje de
 * resultado. Cada sección guarda por separado, así un error en una no
 * bloquea a las demás.
 */
export const SaveRow = ({
  status,
  onSave,
  successMessage,
  errorMessage,
  label = 'Guardar cambios',
}: SaveRowProps) => {
  const isSaving = status === 'saving';

  return (
    <div className="flex flex-col gap-3 border-t border-black/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
      <div aria-live="polite" className="text-[13px]">
        {status === 'success' && (
          <p className="text-success flex items-center gap-1.5 font-medium">
            <span className="material-symbols-outlined text-[18px]!" aria-hidden="true">
              check_circle
            </span>
            {successMessage}
          </p>
        )}
        {status === 'error' && (
          <p className="text-alert flex items-center gap-1.5 font-medium">
            <span className="material-symbols-outlined text-[18px]!" aria-hidden="true">
              error
            </span>
            {errorMessage ?? 'Revisá los campos marcados.'}
          </p>
        )}
      </div>

      <Button
        variant="primary"
        className="w-auto px-4 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isSaving}
        onClick={onSave}
      >
        {isSaving ? 'Guardando…' : label}
      </Button>
    </div>
  );
};
