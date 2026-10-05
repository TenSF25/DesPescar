import { useState, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface MobileCollapseProps {
  label: string;
  icon?: string;
  className?: string;
  children: ReactNode;
}

/**
 * Contenido siempre visible desde `lg`; por debajo se oculta tras un botón que lo despliega.
 * Sirve para paneles secundarios (filtros, resúmenes) que en celular ocuparían toda la pantalla.
 */
export const MobileCollapse = ({ label, icon, className, children }: MobileCollapseProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={className}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="text-secondary flex w-full cursor-pointer items-center justify-between gap-2 rounded-xl border border-black/15 bg-white px-4 py-3 font-semibold lg:hidden"
      >
        <span className="flex items-center gap-2">
          {icon && <span className="material-symbols-outlined">{icon}</span>}
          {label}
        </span>
        <span className="material-symbols-outlined">{open ? 'expand_less' : 'expand_more'}</span>
      </button>
      <div className={cn('mt-3 lg:mt-0 lg:block', open ? 'block' : 'hidden')}>{children}</div>
    </div>
  );
};
