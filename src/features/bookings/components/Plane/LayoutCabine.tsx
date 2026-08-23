import type { HTMLAttributes } from 'react';

export const LayoutCabine = ({ children }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className="cabine-plane flex h-max w-120 flex-col gap-4 bg-white p-1">{children}</div>
  );
};
