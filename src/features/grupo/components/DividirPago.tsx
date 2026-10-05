import { useEffect, useId, useRef, useState } from 'react';
import type { Carrito } from '@/features/cart/cart.types';
import { BOTON_BORDE, BOTON_LLENO, CARD, FOCO } from '@/features/cart/components/estilos';
import { cn } from '@/utils/cn';
import { aCentavos, formatCentavos, leerErrorGrupo, maxPartes, repartoIgual } from '../grupo';
import type { Grupo } from '../grupo.types';
import { iniciarGrupo } from '../services/grupoService';

interface Props {
  carrito: Carrito;
  onIniciado: (grupo: Grupo) => void;
  /** 409/410 del servidor: el carrito cambió o venció; el padre lo recarga. */
  onCarritoCambio: () => void;
}

/** "Dividir el pago": cuántas personas (vos incluido) y cuánto le toca a cada una (D-b3). */
export const DividirPago = ({ carrito, onIniciado, onCarritoCambio }: Props) => {
  const total = aCentavos(carrito.montoTotal);
  const maximo = maxPartes(total);
  const [abierto, setAbierto] = useState(false);
  const [cantidad, setCantidad] = useState(Math.min(2, maximo));
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const idCantidad = useId();
  const selector = useRef<HTMLSelectElement>(null);
  const botonAbrir = useRef<HTMLButtonElement>(null);
  const partes = repartoIgual(total, Math.max(1, cantidad));

  // El foco sigue al formulario al abrirlo y vuelve al botón al cerrarlo.
  useEffect(() => {
    if (abierto) selector.current?.focus();
  }, [abierto]);

  const cerrar = () => {
    setAbierto(false);
    setError(null);
    window.setTimeout(() => botonAbrir.current?.focus(), 0);
  };

  const empezar = async () => {
    if (enviando) return;
    setEnviando(true);
    setError(null);
    try {
      onIniciado(await iniciarGrupo(carrito.idCarrito, cantidad));
    } catch (err: unknown) {
      const e = leerErrorGrupo(err, 'No pudimos empezar el pago en grupo.');
      setError(e.mensaje);
      if (e.status === 409 || e.status === 410) onCarritoCambio();
    } finally {
      setEnviando(false);
    }
  };

  if (!abierto) {
    return (
      <div
        className={cn(
          'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6',
          CARD,
        )}
      >
        <div className="flex items-start gap-3">
          <span
            aria-hidden
            className="bg-primary/10 text-primary flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
          >
            <span className="material-symbols-outlined text-[24px]">group</span>
          </span>
          <div>
            <h2 className="text-secondary text-lg font-bold">¿Viajan en grupo?</h2>
            <p className="text-secondary/70 text-sm">
              Dividí el total entre varias personas: cada una paga su parte desde un enlace. Los
              lugares quedan reservados 24 horas.
            </p>
          </div>
        </div>
        <button
          ref={botonAbrir}
          type="button"
          onClick={() => setAbierto(true)}
          className={cn(BOTON_BORDE, FOCO, 'shrink-0')}
        >
          <span aria-hidden className="material-symbols-outlined text-[20px]">
            call_split
          </span>
          Dividir el pago
        </button>
      </div>
    );
  }

  return (
    <section aria-labelledby="dividir-pago" className={cn('flex flex-col gap-4', CARD)}>
      <h2 id="dividir-pago" className="text-secondary text-lg font-bold">
        Dividir el pago
      </h2>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <label htmlFor={idCantidad} className="text-secondary font-semibold">
          ¿Entre cuántas personas?{' '}
          <span className="text-secondary/60 font-normal">(vos incluido)</span>
        </label>
        <select
          ref={selector}
          id={idCantidad}
          value={cantidad}
          onChange={(e) => setCantidad(Number(e.target.value))}
          className={cn(
            'text-secondary min-h-11 rounded-xl border border-[#E2E8F0] bg-white px-3 font-semibold',
            FOCO,
          )}
        >
          {Array.from({ length: Math.max(0, maximo - 1) }, (_, i) => i + 2).map((n) => (
            <option key={n} value={n}>
              {n} personas
            </option>
          ))}
        </select>
      </div>
      <p className="text-secondary/80 text-sm">
        Cada una paga{' '}
        <span className="text-primary font-bold">{formatCentavos(partes[1] ?? partes[0])}</span>
        {partes[1] !== undefined && partes[0] !== partes[1] && (
          <> (vos {formatCentavos(partes[0])}, con el redondeo)</>
        )}
        . Después vas a poder cambiar los montos mientras nadie haya pagado.
      </p>
      <p className="text-secondary/60 text-xs">
        Al dividir, el carrito queda congelado: no se agregan ni quitan ítems. Si no pagan todos en
        24 horas, se cancela y se devuelve cada parte pagada.
      </p>
      {error && (
        <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}
      <div className="flex flex-col gap-3 sm:flex-row-reverse">
        <button
          type="button"
          onClick={() => void empezar()}
          disabled={enviando}
          aria-busy={enviando}
          className={cn(BOTON_LLENO, FOCO, 'flex-1 sm:flex-none')}
        >
          {enviando ? 'Creando el grupo...' : 'Crear el grupo'}
        </button>
        <button
          type="button"
          onClick={cerrar}
          disabled={enviando}
          className={cn(BOTON_BORDE, FOCO, 'min-h-12')}
        >
          Cancelar
        </button>
      </div>
    </section>
  );
};
