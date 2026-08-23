import type { HTMLAttributes, ReactNode } from 'react';

interface LayoutSeatsProps extends HTMLAttributes<HTMLDivElement> {
  separatorClass?: ReactNode;
}

export const LayoutSeats = ({ children, separatorClass }: LayoutSeatsProps) => {
  return (
    <div className="separator-seats flex w-full flex-col items-center gap-6">
      {separatorClass}
      <div className="flex w-full flex-col gap-4">{children}</div>
    </div>
  );
};
