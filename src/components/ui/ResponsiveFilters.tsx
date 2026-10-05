import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from 'react';
import { cn } from '@/utils/cn';

interface ResponsiveFiltersProps {
  children: ReactNode;
  titulo?: string;
  /** Cantidad de filtros aplicados; se muestra como insignia en el boton. */
  activos?: number;
  /** Clases extra para el contenedor que se ve en pantallas grandes. */
  className?: string;
}

const CONSULTA_ESCRITORIO = '(min-width: 1024px)';

const FOCUSABLES =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Sin matchMedia (SSR o tests) se asume escritorio. */
const useEsEscritorio = () => {
  const [esEscritorio, setEsEscritorio] = useState(() =>
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia(CONSULTA_ESCRITORIO).matches
      : true,
  );

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia(CONSULTA_ESCRITORIO);
    const onChange = (e: MediaQueryListEvent) => setEsEscritorio(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return esEscritorio;
};

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
  const panelRef = useRef<HTMLDivElement>(null);
  const tituloId = useId();
  const esEscritorio = useEsEscritorio();
  const drawerAbierto = abierto && !esEscritorio;

  const atraparFoco = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab' || !panelRef.current) return;
    const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLES));
    if (items.length === 0) return;
    const primero = items[0];
    const ultimo = items[items.length - 1];
    const activo = document.activeElement;
    if (e.shiftKey && (activo === primero || !panelRef.current.contains(activo))) {
      e.preventDefault();
      ultimo.focus();
    } else if (!e.shiftKey && (activo === ultimo || !panelRef.current.contains(activo))) {
      e.preventDefault();
      primero.focus();
    }
  };

  useEffect(() => {
    if (!drawerAbierto) return;
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
  }, [drawerAbierto]);

  return (
    <>
      {!esEscritorio && (
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
      )}

      {esEscritorio && <div className={cn('w-full', className)}>{children}</div>}

      {drawerAbierto && (
        <div className="fixed inset-0 z-[600] lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setAbierto(false)}
            aria-hidden="true"
          />
          <div
            ref={panelRef}
            onKeyDown={atraparFoco}
            role="dialog"
            aria-modal="true"
            aria-labelledby={tituloId}
            className="filtros-drawer absolute inset-y-0 right-0 flex w-[85%] max-w-sm flex-col overflow-y-auto bg-[#F8FAFC]"
          >
            <div className="flex items-center justify-end px-4 py-3">
              <h2 id={tituloId} className="sr-only">
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
