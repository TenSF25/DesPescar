import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

// 1. Definimos las variantes que necesites usar
type ColorVariant = 'white' | 'dark' | 'primary' | 'auth';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
  error?: string | null;
  variant?: ColorVariant; // Reemplaza a fontColor y focusColor
}

// 2. Diccionario estático: Tailwind escanea esto correctamente en tiempo de build
const colorConfig: Record<
  ColorVariant,
  { wrapper: string; icon: string; input: string; label: string }
> = {
  white: {
    wrapper: 'border-white/10 focus-within:border-white/40 focus-within:bg-white/10',
    icon: 'text-white/50 group-focus-within:text-white',
    input: 'text-white placeholder:text-transparent',
    label: 'text-white/50 peer-focus:text-white/70 peer-not-placeholder-shown:text-white/70',
  },
  dark: {
    wrapper: 'border-black/20 focus-within:border-black/50 focus-within:bg-black/5',
    icon: 'text-black/50 group-focus-within:text-black',
    input: 'text-black placeholder:text-transparent',
    label: 'text-black/50 peer-focus:text-black/70 peer-not-placeholder-shown:text-black/70',
  },
  primary: {
    wrapper: 'border-blue-500/30 focus-within:border-blue-500 focus-within:bg-blue-500/10',
    icon: 'text-blue-500/50 group-focus-within:text-blue-500',
    input: 'text-blue-600 placeholder:text-transparent',
    label:
      'text-blue-600/50 peer-focus:text-blue-600/70 peer-not-placeholder-shown:text-blue-600/70',
  },
  auth: {
    // Acá forzamos el border-2 para que no se achique
    wrapper:
      'border-3 border-secondary bg-white focus-within:border-primary focus-within:bg-primary',
    // Ícono negro puro, pasa a blanco en focus
    icon: 'text-black group-focus-within:text-white',
    // Input texto negro, pasa a blanco en focus
    input: 'text-black focus:text-white placeholder:text-transparent',
    // Label negro puro, pasa a blanco/70 en focus, y negro/70 si hay texto sin focus
    label:
      'text-black peer-focus:text-white/70 peer-not-placeholder-shown:text-black/70 peer-focus:peer-not-placeholder-shown:text-white/70',
  },
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, icon, error, variant = 'white', ...props }, ref) => {
    // Extraemos las clases según la variante elegida
    const config = colorConfig[variant];

    return (
      <div className="flex h-full w-full flex-col gap-1.5 text-left">
        <div
          className={cn(
            'group relative flex w-full items-center gap-3 rounded-xl border bg-black/20 p-3 transition-colors duration-200',
            error
              ? 'border-red-500/80 focus-within:border-red-500 focus-within:bg-red-500/10'
              : config.wrapper,
            className,
          )}
        >
          {icon && (
            <span
              className={cn(
                'material-symbols-outlined shrink-0 text-[22px] transition-colors duration-200',
                error ? 'text-red-400' : config.icon,
              )}
            >
              {icon}
            </span>
          )}

          <div className="relative flex w-full flex-col pt-1">
            <input
              type="text"
              ref={ref}
              placeholder=" "
              autoComplete="off"
              className={cn(
                'peer w-full bg-transparent pt-3 pb-0 text-[15px] font-semibold transition-all outline-none',
                error ? 'text-red-100' : config.input,
              )}
              {...props}
            />

            <label
              className={cn(
                'pointer-events-none absolute top-1/2 left-0 origin-left -translate-y-1/2 text-[12px] font-bold tracking-wider uppercase transition-all duration-200',
                'peer-focus:top-0 peer-focus:-translate-y-1 peer-focus:scale-85',
                'peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:-translate-y-1 peer-not-placeholder-shown:scale-85',
                error
                  ? 'text-red-400 peer-not-placeholder-shown:text-red-400 peer-focus:text-red-400'
                  : config.label,
              )}
            >
              {label}
            </label>
          </div>
        </div>

        {error && (
          <span className="pl-2 text-[11px] font-semibold tracking-wide text-red-400">{error}</span>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
