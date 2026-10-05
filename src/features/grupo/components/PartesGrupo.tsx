import { BOTON_BORDE, FOCO } from '@/features/cart/components/estilos';
import { cn } from '@/utils/cn';
import { estadoParteTexto, formatMonto, nombreParte, type TonoEstado } from '../grupo';
import type { Grupo, ParteGrupo } from '../grupo.types';

const CHIP: Record<TonoEstado, string> = {
  neutro: 'bg-[#F1F5F9] text-secondary/70',
  aviso: 'bg-amber-50 text-amber-900',
  exito: 'bg-green-50 text-success',
  error: 'bg-red-50 text-red-700',
};

const ICONO: Record<TonoEstado, string> = {
  neutro: 'radio_button_unchecked',
  aviso: 'schedule',
  exito: 'check_circle',
  error: 'cancel',
};

interface Props {
  grupo: Grupo;
  /** El organizador libera la parte TOMADA de un amigo que no pagó (D-b8). */
  onLiberar?: (numero: number) => void;
  /** Pagar la parte propia. */
  onPagar?: (numero: number) => void;
  ocupado: boolean;
}

export const PartesGrupo = ({ grupo, onLiberar, onPagar, ocupado }: Props) => {
  const abierto = grupo.estado === 'ABIERTO' && grupo.segundosRestantes > 0;
  const accion = (p: ParteGrupo) => {
    if (!abierto) return null;
    if (p.esMia && p.estado === 'TOMADA' && onPagar) {
      return (
        <button
          type="button"
          onClick={() => onPagar(p.numero)}
          disabled={ocupado}
          className={cn(
            'bg-primary hover:bg-primary/90 flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 font-bold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50',
            FOCO,
          )}
        >
          <span aria-hidden className="material-symbols-outlined text-[20px]">
            lock
          </span>
          Pagar mi parte
        </button>
      );
    }
    if (grupo.soyOrganizador && !p.esOrganizador && p.estado === 'TOMADA' && onLiberar) {
      return (
        <button
          type="button"
          onClick={() => onLiberar(p.numero)}
          disabled={ocupado}
          className={cn(BOTON_BORDE, FOCO, 'min-h-11 px-4 text-sm')}
          aria-label={`Liberar la parte de ${nombreParte(p)}`}
        >
          <span aria-hidden className="material-symbols-outlined text-[18px]">
            person_remove
          </span>
          Liberar
        </button>
      );
    }
    return null;
  };

  return (
    <ul aria-label="Partes del grupo" className="flex flex-col divide-y divide-[#E2E8F0]">
      {grupo.partes.map((p) => {
        const estado = estadoParteTexto(p);
        return (
          <li
            key={p.numero}
            className={cn(
              'flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between',
              p.esMia && 'bg-primary/5 -mx-2 rounded-xl px-2',
            )}
          >
            <div className="flex min-w-0 items-center gap-3">
              <span
                aria-hidden
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold',
                  p.esMia ? 'bg-primary text-white' : 'bg-secondary/5 text-secondary',
                )}
              >
                {p.numero}
              </span>
              <div className="min-w-0">
                <p className="text-secondary truncate font-semibold">
                  {nombreParte(p)}
                  {p.esOrganizador && !p.esMia && (
                    <span className="text-secondary/60 font-normal"> · organiza</span>
                  )}
                  {p.esMia && p.esOrganizador && (
                    <span className="text-secondary/60 font-normal"> · organizás</span>
                  )}
                </p>
                <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                  <span className="text-primary font-bold tabular-nums">
                    {formatMonto(p.monto)}
                  </span>
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold',
                      CHIP[estado.tono],
                    )}
                  >
                    <span aria-hidden className="material-symbols-outlined text-[14px]">
                      {ICONO[estado.tono]}
                    </span>
                    {estado.texto}
                  </span>
                </p>
              </div>
            </div>
            {accion(p)}
          </li>
        );
      })}
    </ul>
  );
};
