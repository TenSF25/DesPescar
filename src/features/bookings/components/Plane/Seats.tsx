import { type HTMLAttributes } from 'react';
import { cn } from '../../../../utils/cn';

export const Seats = ({ className }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        'flex h-16 w-16 items-center justify-center rounded-lg border-3 border-blue-400 text-center text-blue-400 hover:bg-blue-400/40',
        className,
      )}
    >
      <h2 className="font-bold"></h2>
    </div>
  );
};
