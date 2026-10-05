import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface ResponsiveFiltersProps {
  children: ReactNode;
  titulo?: string;
  /** Cantidad de filtros aplicados; se muestra como insignia en el boton. */
  activos?: number;
  /** Clases extra para el contenedor que se ve en pantallas grandes. */
  className?: string;
}

/**
 * En pantallas grandes muestra los filtros en linea. En celulares y tablets muestra un boton
 * que los abre en un panel lateral, para que los resultados queden arriba.
 */
export const ResponsiveFilters = ({
  children,
  titulo = 'Filtros',
  activos = 0,
  className,
}: ResponsiveFiltersProps) => {
  const [abierto, setAbierto] = useState(false);
  const botonRef = useRef<HTMLButtonElement>(null);
  const cerrarRef = useRef<HTMLButtonElement>(null);
  const tituloId = useId();

  useEffect(() => {
    if (!abierto) return;
    const opener = botonRef.current;
    const overflowPrevio = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    cerrarRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAbierto(false);
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = overflowPrevio;
      document.removeEventListener('keydown', onKeyDown);
      opener?.focus();
    };
  }, [abierto]);

  return (
    <>
      <button
        ref={botonRef}
        type="button"
        onClick={() => setAbierto(true)}
        aria-haspopup="dialog"
        className="text-secondary flex w-full items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 font-semibold shadow-sm lg:hidden"
      >
        <span className="material-symbols-outlined">tune</span>
        {titulo}
        {activos > 0 && (
          <span className="bg-primary flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-xs font-bold text-white">
            {activos}
          </span>
        )}
      </button>

      <div className={cn('hidden w-full lg:block', className)}>{children}</div>

      {abierto && (
        <div className="fixed inset-0 z-[600] lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setAbierto(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={tituloId}
            className="filtros-drawer absolute inset-y-0 right-0 flex w-[85%] max-w-sm flex-col overflow-y-auto bg-[#F8FAFC]"
          >
            <div className="flex items-center justify-between px-4 py-3">
              <h2 id={tituloId} className="text-secondary text-lg font-bold">
                {titulo}
              </h2>
              <button
                ref={cerrarRef}
                type="button"
                onClick={() => setAbierto(false)}
                aria-label="Cerrar filtros"
                className="text-secondary flex h-10 w-10 items-center justify-center rounded-full hover:bg-black/5"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="px-4 pb-4">{children}</div>
            <div className="sticky bottom-0 mt-auto border-t border-[#E2E8F0] bg-[#F8FAFC] p-4">
              <button
                type="button"
                onClick={() => setAbierto(false)}
                className="bg-primary w-full rounded-xl px-4 py-3 font-bold text-white"
              >
                Ver resultados
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
