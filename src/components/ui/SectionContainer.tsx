import { cn } from '@/utils/cn';
import type { HTMLAttributes } from 'react';

export const SectionContainer = ({ children, className }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        'mx-auto flex w-full max-w-370 flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8 lg:py-12',
        className,
      )}
    >
      {children}
    </div>
  );
};
