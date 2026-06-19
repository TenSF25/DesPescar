import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
}

export const Button = ({ variant = 'primary', className, children, ...props }: ButtonProps) => {
  return (
    <button
      className={cn(
        'w-full cursor-pointer rounded-[10px] p-2 font-bold transition-all duration-200 active:scale-95',
        variant === 'primary' &&
          'border-primary text-primary hover:bg-primary border hover:text-white',
        variant === 'secondary' &&
          'border-secondary text-secondary hover:bg-secondary border hover:text-white',
        variant === 'danger' && 'bg-alert text-white hover:bg-[#93000a]',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};
