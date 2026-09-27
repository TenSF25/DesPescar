import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
  error?: string | null;
  fontColor?: string;
  focusColor?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, icon, error, fontColor, focusColor, ...props }, ref) => {
    return (
      <div className="flex h-full w-full flex-col gap-1.5 text-left">
        <div
          className={cn(
            'group relative flex w-full items-center gap-3 rounded-xl border bg-black/20 p-3 transition-colors duration-200',
            error
              ? 'border-red-500/80 focus-within:border-red-500 focus-within:bg-red-500/10'
              : 'border-white/10 focus-within:border-white/40 focus-within:bg-white/10',
            className,
          )}
        >
          {icon && (
            <span
              className={cn(
                'material-symbols-outlined shrink-0 text-[22px] transition-colors duration-200',
                error ? 'text-red-400' : 'text-white/50 group-focus-within:text-white',
                fontColor,
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
              className={cn(
                `peer w-full bg-transparent pt-3 pb-0 text-[15px] font-semibold text-white transition-all outline-none placeholder:text-transparent focus-within:${focusColor}`,
                error && 'text-red-100',
                fontColor,
              )}
              {...props}
            />

            <label
              className={cn(
                'pointer-events-none absolute top-1/2 left-0 origin-left -translate-y-1/2 text-[12px] font-bold tracking-wider text-white/50 uppercase transition-all duration-200',
                fontColor,
                `peer-focus:top-0 peer-focus:-translate-y-1 peer-focus:scale-85 ${focusColor ? `peer-focus:${focusColor}/70` : 'peer-focus:text-white/70'}`,
                `peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:-translate-y-1 peer-not-placeholder-shown:scale-85 ${fontColor ? `peer-not-placeholder-shown:${fontColor}/70` : 'peer-not-placeholder-shown:text-white/70'}`,
                error && 'text-red-400 peer-focus:text-red-400',
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
