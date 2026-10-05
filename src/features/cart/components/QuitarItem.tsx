import { useState } from 'react';
import { cn } from '@/utils/cn';
import { FOCO } from './estilos';

interface Props {
  /** "el vuelo", "la estadía en Sheraton Córdoba". */
  que: string;
  /** Devuelve el mensaje de error o null si salió bien. */
  onQuitar: () => Promise<string | null>;
}

/** "Quitar" en dos pasos: pide confirmación en el lugar, sin modal. */
export const QuitarItem = ({ que, onQuitar }: Props) => {
  const [confirmando, setConfirmando] = useState(false);
  const [quitando, setQuitando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const quitar = async () => {
    if (quitando) return;
    setQuitando(true);
    setError(null);
    const e = await onQuitar();
    setQuitando(false);
    if (e) {
      setError(e);
      setConfirmando(false);
    }
  };

  return (
    <div className="ml-auto flex shrink-0 flex-col items-end gap-1">
      {confirmando ? (
        <div
          role="group"
          aria-label={`Confirmar: quitar ${que}`}
          className="flex flex-wrap items-center justify-end gap-x-1 gap-y-0.5 text-sm"
        >
          <span className="text-secondary/80 pr-1 font-medium">¿Quitar?</span>
          <button
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
            onClick={() => setConfirmando(false)}
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
