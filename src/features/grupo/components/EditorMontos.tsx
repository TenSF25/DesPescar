import { useEffect, useId, useRef, useState } from 'react';
import { BOTON_BORDE, BOTON_LLENO, FOCO } from '@/features/cart/components/estilos';
import { cn } from '@/utils/cn';
import {
  aCentavos,
  deCentavos,
  formatCentavos,
  nombreParte,
  parsearMonto,
  repartoIgual,
  validarMontos,
} from '../grupo';
import type { EditarPartesRequest, Grupo } from '../grupo.types';

interface Props {
  grupo: Grupo;
  /** Devuelve el mensaje de error o null si se guardó. */
  onGuardar: (pedido: EditarPartesRequest) => Promise<string | null>;
  onCerrar: () => void;
  ocupado: boolean;
}

/** "353333,33" o "400000" (sin decimales si no los hay), como lo escribe una persona acá. */
const texto = (centavos: number) =>
  centavos % 100 === 0 ? String(centavos / 100) : deCentavos(centavos).toFixed(2).replace('.', ',');

/** Montos a mano (suman exactamente el total, D-b3) o volver a partes iguales. */
export const EditorMontos = ({ grupo, onGuardar, onCerrar, ocupado }: Props) => {
  const total = aCentavos(grupo.montoTotal);
  const [valores, setValores] = useState<string[]>(
    grupo.partes.map((p) => texto(aCentavos(p.monto))),
  );
  const [error, setError] = useState<string | null>(null);
  const [intentado, setIntentado] = useState(false);
  const base = useId();
  const primero = useRef<HTMLInputElement>(null);
  const centavos = valores.map(parsearMonto);
  const { ok, diferencia, errores } = validarMontos(centavos, total);

  useEffect(() => {
    primero.current?.focus();
  }, []);

  const guardar = async () => {
    setIntentado(true);
    if (!ok) {
      const i = errores.findIndex((e) => e !== null);
      if (i >= 0) document.getElementById(`${base}-${grupo.partes[i].numero}`)?.focus();
      return;
    }
    setError(await onGuardar({ montos: centavos.map((c) => deCentavos(c as number)) }));
  };

  const igualar = () => {
    setValores(repartoIgual(total, grupo.partes.length).map(texto));
    setIntentado(false);
    setError(null);
  };

  return (
    <form
      aria-labelledby={`${base}-titulo`}
      className="flex flex-col gap-3 rounded-xl border border-[#E2E8F0] p-4"
      onSubmit={(e) => {
        e.preventDefault();
        void guardar();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && !ocupado) onCerrar();
      }}
    >
      <h3 id={`${base}-titulo`} className="text-secondary font-bold">
        Cambiar los montos
      </h3>
      <p className="text-secondary/70 text-sm">
        Tienen que sumar exactamente {formatCentavos(total)} y cada parte ser de al menos $ 100.
      </p>
      <ul className="flex flex-col gap-2">
        {grupo.partes.map((p, i) => (
          <li key={p.numero} className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1">
            <label htmlFor={`${base}-${p.numero}`} className="text-secondary text-sm font-semibold">
              {p.numero}. {nombreParte(p)}
            </label>
            <div className="flex items-center gap-1">
              <span aria-hidden className="text-secondary/60">
                $
              </span>
              <input
                ref={i === 0 ? primero : undefined}
                id={`${base}-${p.numero}`}
                inputMode="decimal"
                autoComplete="off"
                value={valores[i]}
                onChange={(e) => {
                  const v = e.target.value;
                  setValores(valores.map((x, j) => (j === i ? v : x)));
                  setError(null);
                }}
                aria-invalid={intentado && errores[i] !== null}
                aria-describedby={intentado && errores[i] ? `${base}-${p.numero}-error` : undefined}
                className={cn(
                  'text-secondary min-h-11 w-36 rounded-xl border px-3 text-right font-semibold tabular-nums',
                  intentado && errores[i] ? 'border-red-400' : 'border-[#E2E8F0]',
                  FOCO,
                )}
              />
            </div>
            {intentado && errores[i] && (
              <p id={`${base}-${p.numero}-error`} className="col-span-2 text-xs text-red-700">
                {errores[i]}
              </p>
            )}
          </li>
        ))}
      </ul>
      <p
        role="status"
        aria-live="polite"
        className={cn(
          'text-sm font-semibold',
          diferencia === 0 ? 'text-success' : 'text-amber-900',
        )}
      >
        {diferencia === 0
          ? 'Las partes suman el total.'
          : diferencia > 0
            ? `Faltan ${formatCentavos(diferencia)} para llegar al total.`
            : `Se pasan por ${formatCentavos(-diferencia)}.`}
      </p>
      {error && (
        <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}
      <div className="flex flex-col gap-2 sm:flex-row-reverse">
        <button type="submit" disabled={ocupado} className={cn(BOTON_LLENO, FOCO, 'min-h-11 px-6')}>
          Guardar montos
        </button>
        <button
          type="button"
          onClick={igualar}
          disabled={ocupado}
          className={cn(BOTON_BORDE, FOCO, 'min-h-11')}
        >
          Partes iguales
        </button>
        <button
          type="button"
          onClick={onCerrar}
          disabled={ocupado}
          className={cn(
            'text-secondary/70 min-h-11 rounded-xl px-4 text-sm font-semibold underline',
            FOCO,
          )}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};
