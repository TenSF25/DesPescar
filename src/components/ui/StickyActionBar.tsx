import { useEffect, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface StickyActionBarProps extends HTMLAttributes<HTMLDivElement> {
  /** Aviso (ej: un error) que se muestra pegado encima de la barra. */
  alert?: ReactNode;
}

/**
 * Barra de acciones fija al pie de la pantalla (resumen + botón "Continuar").
 * En celular apila el contenido en columna; desde `sm` lo reparte en una fila.
 * Las páginas que la usan pasan `stickyBar` a `SectionContainer` para dejar espacio al final.
 */
export const StickyActionBar = ({ alert, className, children, ...props }: StickyActionBarProps) => {
  // Marca el documento mientras la barra está montada: el chat flotante (KOI) se corre para no tapar el botón.
  useEffect(() => {
    document.documentElement.dataset.stickyBar = 'true';
    return () => {
      delete document.documentElement.dataset.stickyBar;
    };
  }, []);

  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-[#3234392d] bg-white">
      {alert}
      <div
        className={cn(
          'mx-auto flex w-full max-w-360 flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  );
};
