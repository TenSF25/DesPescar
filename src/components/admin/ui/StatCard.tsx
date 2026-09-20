import { cn } from '../../../utils/cn';
import { IconCircle } from './IconCircle';
import type { TrendDirection } from '../admin.types';

interface StatCardProps {
  icon: string;
  /** Clases de fondo/texto del círculo de ícono, ej: 'bg-primary/10 text-primary' */
  iconClassName?: string;
  label: string;
  value: string | number;
  /** Texto con flecha de color (verde si sube, rojo si baja). Ej: "15.2% vs periodo anterior" */
  trendValue?: string;
  trendDirection?: TrendDirection;
  /** Texto plano gris, sin flecha ni color. Ej: "Próximos 7 días". Se ignora si hay trendValue. */
  caption?: string;
}

export const StatCard = ({
  icon,
  iconClassName = 'bg-primary/10 text-primary',
  label,
  value,
  trendValue,
  trendDirection = 'up',
  caption,
}: StatCardProps) => {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-black/10 bg-white p-5">
      <IconCircle icon={icon} className={iconClassName} />
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold tracking-wide text-[#44474E] uppercase">{label}</span>
        <span className="text-secondary text-2xl font-bold">{value}</span>
        {trendValue ? (
          <span
            className={cn(
              'flex items-center gap-1 text-xs font-semibold',
              trendDirection === 'up' ? 'text-green-600' : 'text-alert',
            )}
          >
            <span className="material-symbols-outlined text-[14px]">
              {trendDirection === 'up' ? 'arrow_upward' : 'arrow_downward'}
            </span>
            {trendValue}
          </span>
        ) : (
          caption && <span className="text-xs font-medium text-[#44474E]">{caption}</span>
        )}
      </div>
    </div>
  );
};
