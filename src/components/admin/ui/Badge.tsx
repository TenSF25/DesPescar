import type { ReactNode } from 'react';
import { cn } from '../../../utils/cn';
import type { BadgeTone } from '../admin.types';

const toneStyles: Record<BadgeTone, string> = {
  success: 'bg-green-100 text-green-700',
  danger: 'bg-red-100 text-alert',
  warning: 'bg-amber-100 text-amber-700',
  info: 'bg-blue-100 text-blue-700',
  neutral: 'bg-black/5 text-[#44474E]',
  dark: 'bg-secondary text-white',
};

interface BadgeProps {
  tone?: BadgeTone;
  children: ReactNode;
  className?: string;
}

export const Badge = ({ tone = 'neutral', children, className }: BadgeProps) => {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold',
        toneStyles[tone],
        className,
      )}
    >
      {children}
    </span>
  );
};
