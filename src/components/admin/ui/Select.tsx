import type { SelectHTMLAttributes } from 'react';
import { cn } from '../../../utils/cn';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  containerClassName?: string;
}

export const Select = ({ className, containerClassName, children, ...props }: SelectProps) => {
  return (
    <div className={cn('relative', containerClassName)}>
      <select
        className={cn(
          'w-full cursor-pointer appearance-none rounded-xl border border-black/15 bg-white py-2.5 pr-9 pl-3 text-sm text-[#44474E] outline-none focus:border-black/30',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <span className="material-symbols-outlined pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-[18px] text-[#44474E]">
        expand_more
      </span>
    </div>
  );
};
