import { cn } from '../../../utils/cn';

interface IconCircleProps {
  icon: string;
  className?: string;
  size?: 'sm' | 'md';
}

export const IconCircle = ({ icon, className, size = 'md' }: IconCircleProps) => {
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full',
        size === 'md' ? 'h-12 w-12' : 'h-9 w-9',
        className,
      )}
    >
      <span className="material-symbols-outlined">{icon}</span>
    </div>
  );
};
