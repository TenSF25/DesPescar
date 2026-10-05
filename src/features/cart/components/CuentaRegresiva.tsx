import { useEffect, useRef, useState } from 'react';
import { cn } from '@/utils/cn';
import { formatCuentaRegresiva, segundosHasta, urgencia } from '../carrito';

interface Props {
  /** Momento (ms) en que vence el carrito. El padre la monta con key={venceEn}. */
  venceEn: number;
  /** segundosRestantes que informó el servidor, para el primer render. */
  segundosIniciales: number;
  onVencido: () => void;
}

const ESTILO = {
  normal: 'border-[#E2E8F0] bg-white text-secondary',
  aviso: 'border-amber-300 bg-amber-50 text-amber-900',
  vencido: 'border-red-200 bg-red-50 text-alert',
} as const;

export const CuentaRegresiva = ({ venceEn, segundosIniciales, onVencido }: Props) => {
  const [segundos, setSegundos] = useState(segundosIniciales);
  const avisado = useRef(false);

  useEffect(() => {
    const id = window.setInterval(() => {
      const s = segundosHasta(venceEn, Date.now());
      setSegundos(s);
      if (s === 0 && !avisado.current) {
        avisado.current = true;
        onVencido();
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, [venceEn, onVencido]);

  const nivel = urgencia(segundos);
  return (
    <div
      role="timer"
      aria-label={`Tiempo para pagar: ${formatCuentaRegresiva(segundos)}`}
      className={cn(
        'flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold',
        ESTILO[nivel],
      )}
    >
      <span aria-hidden className="material-symbols-outlined text-[20px]">
        {nivel === 'vencido' ? 'timer_off' : 'timer'}
      </span>
      {nivel === 'vencido' ? (
        'Tu carrito venció'
      ) : (
        <span>
          Guardamos tus lugares por{' '}
          <span className="font-bold tabular-nums">{formatCuentaRegresiva(segundos)}</span>
        </span>
      )}
    </div>
  );
};
