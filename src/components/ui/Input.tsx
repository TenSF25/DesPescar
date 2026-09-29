import { type InputHTMLAttributes, type LabelHTMLAttributes, useId } from 'react';
import { cn } from '../../utils/cn';

interface ComponentInput extends InputHTMLAttributes<HTMLInputElement> {
  contentLabel: string;
  labelProps?: LabelHTMLAttributes<HTMLLabelElement>;
  containerClassname?: string;
  error?: string | null;
}

export const Input = ({
  contentLabel,
  labelProps,
  containerClassname,
  className,
  type = 'text',
  placeholder,
  error,
  ...propsInput
}: ComponentInput) => {
  const uniqueID = useId();

  return (
    <div className={cn('flex w-full flex-col gap-2', containerClassname)}>
      <label
        htmlFor={uniqueID}
        {...labelProps}
        className={cn('font-semibold text-[#1A2B4C]', labelProps?.className)}
      >
        {contentLabel}
      </label>
      <input
        type={type}
        id={uniqueID}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${uniqueID}-error` : undefined}
        className={cn(
          'w-full rounded-xl border border-black/20 p-2',
          error && 'border-alert',
          className,
        )}
        {...propsInput}
        placeholder={placeholder}
      />
      {error && (
        <p id={`${uniqueID}-error`} className="text-alert text-[13px]">
          {error}
        </p>
      )}
    </div>
  );
};
