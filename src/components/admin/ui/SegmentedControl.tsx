import { cn } from '@/utils/cn';

interface SegmentedControlOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
  'aria-label'?: string;
}

/** Botones tipo pestaña para alternar entre pocas opciones (ej: acumulado / por día). */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  'aria-label': ariaLabel,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="flex rounded-lg border border-black/15 bg-black/3 p-0.5"
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
          className={cn(
            'cursor-pointer rounded-md px-3 py-1 text-xs font-semibold transition-colors',
            option.value === value
              ? 'bg-secondary text-white'
              : 'hover:text-secondary text-[#44474E]',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
