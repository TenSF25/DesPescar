import type { ReactNode } from 'react';

interface ChartCardProps {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}

export const ChartCard = ({ title, action, children }: ChartCardProps) => {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-black/10 bg-white p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-secondary font-semibold">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
};
