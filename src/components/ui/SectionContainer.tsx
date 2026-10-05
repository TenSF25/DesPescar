import { cn } from '@/utils/cn';
import type { HTMLAttributes } from 'react';

interface SectionContainerProps extends HTMLAttributes<HTMLDivElement> {
  /** La página tiene una `StickyActionBar` fija abajo: deja espacio para que ni ella ni el botón del chat (KOI) tapen el final del contenido. */
  stickyBar?: boolean;
}

export const SectionContainer = ({ children, className, stickyBar }: SectionContainerProps) => {
  return (
    <div
      className={cn(
        'mx-auto flex w-full max-w-370 flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8 lg:py-12',
        // Mismo valor en `lg`: si no, el `lg:py-12` de arriba pisaría el padding de abajo.
        stickyBar && 'pb-56 lg:pb-52',
        className,
      )}
    >
      {children}
    </div>
  );
};
