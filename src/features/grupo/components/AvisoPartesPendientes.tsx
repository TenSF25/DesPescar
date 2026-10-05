import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { FOCO } from '@/features/cart/components/estilos';
import { useAuthStore } from '@/store/useAuthStore';
import { cn } from '@/utils/cn';
import { resumenGrupoTexto, type TonoEstado } from '../grupo';
import type { GrupoResumen } from '../grupo.types';
import { misGrupos } from '../services/grupoService';

const CHIP: Record<TonoEstado, string> = {
  neutro: 'bg-[#F1F5F9] text-secondary/70',
  aviso: 'bg-amber-100 text-amber-900',
  exito: 'bg-green-50 text-success',
  error: 'bg-red-50 text-red-700',
};

/**
 * Grupos en curso donde el usuario tiene parte (D-b19): los que lo invitaron y, si corresponde, el
 * que organiza. Se lee al montar; si falla no se muestra nada (no es crítico).
 * @param omitirReserva el carrito que ya se muestra en la página (el grupo del organizador).
 */
export const AvisoPartesPendientes = ({ omitirReserva }: { omitirReserva?: number }) => {
  const userId = useAuthStore((s) => s.user?.id);
  const [leido, setLeido] = useState<{ userId: number; grupos: GrupoResumen[] } | null>(null);

  useEffect(() => {
    if (userId === undefined) return;
    let activo = true;
    misGrupos()
      .then((grupos) => {
        if (activo) setLeido({ userId, grupos: Array.isArray(grupos) ? grupos : [] });
      })
      .catch(() => {
        if (activo) setLeido(null);
      });
    return () => {
      activo = false;
    };
  }, [userId]);

  // Lo leído para otra sesión no se muestra.
  const grupos = leido && leido.userId === userId ? leido.grupos : [];
  const visibles = grupos.filter((g) => g.reservaId !== omitirReserva);
  if (visibles.length === 0) return null;

  return (
    <section
      aria-labelledby="partes-pendientes"
      className="flex flex-col gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 sm:p-5"
    >
      <h2 id="partes-pendientes" className="flex items-center gap-2 font-bold text-amber-900">
        <span aria-hidden className="material-symbols-outlined text-[22px]">
          group
        </span>
        Tus pagos en grupo
      </h2>
      <ul className="flex flex-col gap-2">
        {visibles.map((g) => {
          const r = resumenGrupoTexto(g);
          const pagar = r.accion === 'Pagar mi parte';
          return (
            <li
              key={g.reservaId}
              className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-white p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="text-secondary flex flex-wrap items-center gap-x-2 gap-y-1 font-semibold">
                  <span className="min-w-0 break-words">{r.titulo}</span>
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-xs font-semibold',
                      CHIP[r.estado.tono],
                    )}
                  >
                    {r.estado.texto}
                  </span>
                </p>
                <p className="text-secondary/70 text-sm tabular-nums">{r.detalle}</p>
              </div>
              <Link
                to={`/grupo/${g.enlaceToken}`}
                aria-label={`${r.accion}: ${r.titulo}`}
                className={cn(
                  'flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl px-5 font-bold transition-colors',
                  pagar
                    ? 'bg-primary hover:bg-primary/90 text-white'
                    : 'border-secondary text-secondary hover:bg-secondary/5 border',
                  FOCO,
                )}
              >
                {r.accion}
                <span aria-hidden className="material-symbols-outlined text-[20px]">
                  arrow_forward
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
};
