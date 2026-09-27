import { cn } from '@/utils/cn';
import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
}

export const Button = ({ variant = 'primary', className, children, ...props }: ButtonProps) => {
  return (
    <button
      className={cn(
        'flex w-full cursor-pointer flex-row items-center justify-center gap-2 rounded-[10px] p-2 font-bold transition-all duration-200 active:scale-95',
        variant === 'primary' &&
          'border-primary text-primary hover:bg-primary active:bg-primary border hover:text-white active:text-white',
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
