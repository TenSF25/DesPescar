import { useId } from 'react';
import { cn } from '../../../utils/cn';

interface ToggleSwitchProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}

/**
 * Switch de encendido/apagado.
 *
 * Vive dentro de la feature (y no en components/admin/ui/) a propósito:
 * así no hay que tocar el barrel compartido mientras las ramas del admin
 * siguen abiertas. Si otra sección lo necesita, se mueve al kit común.
 *
 * Por accesibilidad es un <input type="checkbox"> real, escondido pero
 * enfocable: funciona con teclado y lectores de pantalla.
 */
export const ToggleSwitch = ({
  label,
  description,
  checked,
  onChange,
  disabled,
}: ToggleSwitchProps) => {
  const id = useId();

  return (
    <div className="flex flex-row items-center justify-between gap-4">
      <label htmlFor={id} className="flex cursor-pointer flex-col gap-0.5">
        <span className="text-secondary text-sm font-semibold">{label}</span>
        {description && <span className="text-[13px] text-[#44474E]">{description}</span>}
      </label>

      <button
        type="button"
        role="switch"
        id={id}
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={onChange}
        className={cn(
          'relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200',
          checked ? 'bg-primary' : 'bg-black/20',
          disabled && 'cursor-not-allowed opacity-50',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-200',
            checked ? 'left-[22px]' : 'left-0.5',
          )}
        />
      </button>
    </div>
  );
};
