import { useEffect, useId, useRef, useState } from 'react';
import { BOTON_BORDE, FOCO } from '@/features/cart/components/estilos';
import { cn } from '@/utils/cn';
import { enlaceInvitacion } from '../grupo';

/** El enlace de invitación con "Copiar" (y "Compartir" donde el navegador lo ofrece). */
export const EnlaceGrupo = ({ token }: { token: string }) => {
  const enlace = enlaceInvitacion(token, window.location.origin);
  const [estado, setEstado] = useState<'' | 'copiado' | 'error'>('');
  const campo = useRef<HTMLInputElement>(null);
  const id = useId();
  const puedeCompartir = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  useEffect(() => {
    if (!estado) return;
    const t = window.setTimeout(() => setEstado(''), 2500);
    return () => window.clearTimeout(t);
  }, [estado]);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(enlace);
      setEstado('copiado');
    } catch {
      // Sin permiso de portapapeles: se selecciona el texto para copiarlo a mano.
      campo.current?.focus();
      campo.current?.select();
      setEstado('error');
    }
  };

  const compartir = async () => {
    try {
      await navigator.share({
        title: 'Pago en grupo en DesPescar',
        text: 'Sumate y pagá tu parte del viaje:',
        url: enlace,
      });
    } catch {
      // Canceló o el navegador no pudo: no es un error para mostrar.
    }
  };

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3 sm:p-4">
      <label htmlFor={id} className="text-secondary text-sm font-semibold">
        Enlace para invitar
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id={id}
          ref={campo}
          readOnly
          value={enlace}
          onFocus={(e) => e.currentTarget.select()}
          className={cn(
            'text-secondary min-h-11 min-w-0 flex-1 rounded-xl border border-[#E2E8F0] bg-white px-3 text-sm',
            FOCO,
          )}
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void copiar()}
            className={cn(
              BOTON_BORDE,
              FOCO,
              'flex-1 bg-white px-4 sm:flex-none',
              estado === 'copiado' && 'border-success text-success',
            )}
          >
            <span aria-hidden className="material-symbols-outlined text-[20px]">
              {estado === 'copiado' ? 'check' : 'content_copy'}
            </span>
            {estado === 'copiado' ? '¡Copiado!' : 'Copiar enlace'}
          </button>
          {puedeCompartir && (
            <button
              type="button"
              onClick={() => void compartir()}
              className={cn(BOTON_BORDE, FOCO, 'flex-1 bg-white px-4 sm:flex-none')}
            >
              <span aria-hidden className="material-symbols-outlined text-[20px]">
                share
              </span>
              Compartir
            </button>
          )}
        </div>
      </div>
      <p role="status" aria-live="polite" className="text-secondary/70 min-h-4 text-xs">
        {estado === 'copiado' && 'Enlace copiado. Pegalo en el chat del grupo.'}
        {estado === 'error' && 'No pudimos copiarlo solo: seleccionalo y copialo a mano.'}
      </p>
      <p className="text-secondary/60 text-xs">
        Quien lo abra va a tener que iniciar sesión o registrarse. Compartilo solo con tu grupo:
        cualquiera con el enlace puede tomar una parte.
      </p>
    </div>
  );
};
