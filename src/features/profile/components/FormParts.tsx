import { useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface SelectFieldProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  error?: string | null;
  disabled?: boolean;
}

export const SelectField = ({
  label,
  value,
  options,
  onChange,
  error,
  disabled,
}: SelectFieldProps) => (
  <label className="flex w-full flex-col gap-2 font-semibold text-[#1A2B4C]">
    {label}
    <select
      value={value}
      aria-invalid={error ? true : undefined}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        'w-full rounded-xl border border-black/20 bg-white p-2 font-normal text-black disabled:bg-gray-100 disabled:text-gray-500',
        error && 'border-alert',
      )}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
    {error && <span className="text-alert text-sm font-normal">{error}</span>}
  </label>
);

export const Check = ({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  children: ReactNode;
}) => (
  <label className="flex cursor-pointer items-start gap-3 text-sm text-[#44474E]">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="accent-primary mt-0.5 h-4 w-4 cursor-pointer"
    />
    <span>{children}</span>
  </label>
);

export const Card = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: ReactNode;
}) => (
  <section className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6">
    <h2 className="text-secondary mb-4 flex items-center gap-2 text-base font-extrabold">
      <span className="material-symbols-outlined text-primary text-[20px]!">{icon}</span>
      {title}
    </h2>
    <div className="grid gap-4 sm:grid-cols-2">{children}</div>
  </section>
);

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  contentLabel: string;
  error?: string | null;
}

/** Campo de texto para formularios sobre fondo claro (el Input global es para fondos oscuros). */
export const TextField = ({
  contentLabel,
  error,
  className,
  type = 'text',
  ...props
}: TextFieldProps) => {
  const id = useId();

  return (
    <div className="flex w-full flex-col gap-2">
      <label htmlFor={id} className="font-semibold text-[#1A2B4C]">
        {contentLabel}
      </label>
      <input
        id={id}
        type={type}
        aria-invalid={error ? true : undefined}
        className={cn(
          'w-full rounded-xl border border-black/20 p-2 disabled:bg-gray-100 disabled:text-gray-500',
          error && 'border-alert',
          className,
        )}
        {...props}
      />
      {error && <p className="text-alert text-sm">{error}</p>}
    </div>
  );
};
