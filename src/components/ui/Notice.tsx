import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface NoticeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'warning' | 'info' | 'success';
  icon: string;
  title?: string;
  children: ReactNode;
}

const VARIANTS = {
  warning: 'bg-[#fff8ec] text-[#8a5300]',
  info: 'bg-[#eef4ff] text-secondary',
  success: 'bg-[#eef7f2] text-success',
} as const;

export const Notice = ({
  variant = 'info',
  icon,
  title,
  className,
  children,
  ...props
}: NoticeProps) => {
  return (
    <div className={cn('flex flex-row gap-3 rounded-2xl p-4', VARIANTS[variant], className)}>
      <span className="material-symbols-outlined shrink-0" aria-hidden="true">
        {icon}
      </span>
      <div className="flex flex-col gap-1 text-[14px]" {...props}>
        {title && <h4 className="font-semibold">{title}</h4>}
        {children}
      </div>
    </div>
  );
};
