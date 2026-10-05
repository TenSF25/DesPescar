import { useEffect, useRef, useState } from 'react';
import { cn } from '@/utils/cn';
import { useCarritoUi } from './carritoUi';
import { FOCO } from './estilos';

interface Props {
  /** "el vuelo", "la estadía en Sheraton Córdoba". */
  que: string;
  /** Devuelve el mensaje de error o null si salió bien. */
  onQuitar: () => Promise<string | null>;
  /** Lo que se anuncia al quitarlo: "Quitamos el vuelo". */
  anuncio: string;
}

/** "Quitar" en dos pasos: pide confirmación en el lugar, sin modal. */
export const QuitarItem = ({ que, onQuitar, anuncio }: Props) => {
  const { itemQuitado } = useCarritoUi();
  const [confirmando, setConfirmando] = useState(false);
  const [quitando, setQuitando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const botonQuitar = useRef<HTMLButtonElement>(null);
  const botonSi = useRef<HTMLButtonElement>(null);
  // Tras cerrar la confirmación sin quitar, el foco vuelve a "Quitar".
  const volverFoco = useRef(false);

  useEffect(() => {
    if (confirmando) {
      botonSi.current?.focus();
    } else if (volverFoco.current) {
      volverFoco.current = false;
      botonQuitar.current?.focus();
    }
  }, [confirmando]);

  const cerrar = () => {
    volverFoco.current = true;
    setConfirmando(false);
  };

  const quitar = async () => {
    if (quitando) return;
    setQuitando(true);
    setError(null);
    const e = await onQuitar();
    setQuitando(false);
    if (e) {
      setError(e);
      cerrar();
    } else {
      // El ítem desaparece: la página anuncia el cambio y lleva el foco a su título.
      itemQuitado(anuncio);
    }
  };

  return (
    <div className="ml-auto flex shrink-0 flex-col items-end gap-1">
      {confirmando ? (
        <div
          role="group"
          aria-label={`Confirmar: quitar ${que}`}
          onKeyDown={(ev) => {
            if (ev.key === 'Escape' && !quitando) cerrar();
          }}
          className="flex flex-wrap items-center justify-end gap-x-1 gap-y-0.5 text-sm"
        >
          <span className="text-secondary/80 pr-1 font-medium">¿Quitar?</span>
          <button
            ref={botonSi}
            type="button"
            onClick={quitar}
            disabled={quitando}
            aria-busy={quitando}
            className={cn(
              'bg-alert min-h-10 rounded-lg px-3 font-bold text-white hover:bg-[#93000a] disabled:cursor-wait disabled:opacity-60',
              FOCO,
            )}
          >
            {quitando ? 'Quitando...' : 'Sí, quitar'}
          </button>
          <button
            type="button"
            onClick={cerrar}
            disabled={quitando}
            className={cn(
              'text-secondary hover:bg-secondary/5 min-h-10 rounded-lg px-3 font-semibold disabled:opacity-60',
              FOCO,
            )}
          >
            No
          </button>
        </div>
      ) : (
        <button
          ref={botonQuitar}
          type="button"
          onClick={() => setConfirmando(true)}
          aria-label={`Quitar ${que}`}
          className={cn(
            'text-secondary/70 hover:text-alert flex min-h-10 items-center gap-1 rounded-lg px-2 text-sm font-semibold transition-colors hover:bg-red-50',
            FOCO,
          )}
        >
          <span aria-hidden className="material-symbols-outlined text-[20px]">
            delete
          </span>
          Quitar
        </button>
      )}
      {error && (
        <p role="alert" className="text-alert max-w-60 text-right text-xs font-semibold">
          {error}
        </p>
      )}
    </div>
  );
};
