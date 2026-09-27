import { cn } from '@/utils/cn';
import type { HTMLAttributes } from 'react';

export const SectionContainer = ({ children, className }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn('mx-auto flex w-full max-w-370 flex-col gap-6 px-4 pt-12 pb-12', className)}>
      {children}
    </div>
  );
};
