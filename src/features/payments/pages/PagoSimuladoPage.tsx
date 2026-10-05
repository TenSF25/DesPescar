import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { leerErrorApi } from '@/features/cart/carrito';
import { BOTON_BORDE, BOTON_LLENO, FOCO } from '@/features/cart/components/estilos';
import { Campo, inputClass } from '@/features/cart/components/PasajerosForm';
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/formatCurrency';
import { mensajePasarela, urlResultado } from '../pagos';
import type { Pago } from '../payments.types';
import { obtenerPago, simularPago } from '../services/pagosService';
import {
  formatearNumero,
  formatearVencimiento,
  tarjetaRechazada,
  validarTarjeta,
  type ErroresTarjeta,
  type TarjetaPrueba,
} from '../tarjetaPrueba';

const TARJETA_VACIA: TarjetaPrueba = { numero: '', titular: '', vencimiento: '', cvv: '' };
const CUOTAS = [1, 3, 6];
const ORDEN: (keyof TarjetaPrueba)[] = ['numero', 'titular', 'vencimiento', 'cvv'];

/**
 * Pasarela de prueba (proveedor mock). Lee ?pago=<id>, muestra el pago pendiente y un formulario
 * de tarjeta simulado: la tarjeta decide si POST /api/payments/{id}/simulacion aprueba o rechaza.
 * Los datos de la tarjeta quedan solo en el estado de este componente: no se envían, no se
 * guardan y no se registran.
 */
export const PagoSimuladoPage = () => {
  const [sp] = useSearchParams();
  const pagoId = sp.get('pago') ?? '';
  const navigate = useNavigate();
  const [pago, setPago] = useState<Pago | null>(null);
  const [cargando, setCargando] = useState(Boolean(pagoId));
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(pagoId ? null : 'Falta el pago a simular.');
  const [tarjeta, setTarjeta] = useState<TarjetaPrueba>(TARJETA_VACIA);
  const [cuotas, setCuotas] = useState(1);
  const [errores, setErrores] = useState<ErroresTarjeta>({});
  const enCurso = useRef(false);
  const titulo = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    titulo.current?.focus();
  }, []);

  useEffect(() => {
    if (!pagoId) return;
    let activo = true;
    const cargar = async () => {
      try {
        const p = await obtenerPago(pagoId);
        if (!activo) return;
        if (p.status !== 'PENDING') {
          navigate(urlResultado(p), { replace: true });
          return;
        }
        setPago(p);
      } catch (err: unknown) {
        if (activo) {
          const e = leerErrorApi(err, 'No encontramos este pago.');
          setError(mensajePasarela('carga', e.status, e.mensaje));
        }
      } finally {
        if (activo) setCargando(false);
      }
    };
    void cargar();
    return () => {
      activo = false;
    };
  }, [pagoId, navigate]);

  const cambiar = (campo: keyof TarjetaPrueba, valor: string) => {
    setTarjeta((t) => ({ ...t, [campo]: valor }));
    setErrores((e) => ({ ...e, [campo]: undefined }));
  };

  const pagar = async (ev: FormEvent) => {
    ev.preventDefault();
    if (!pago || enCurso.current) return;
    const invalidos = validarTarjeta(tarjeta);
    setErrores(invalidos);
    const primero = ORDEN.find((c) => invalidos[c]);
    if (primero) {
      setError('Revisá los datos de la tarjeta.');
      formRef.current?.querySelector<HTMLInputElement>(`#tarjeta-${primero}`)?.focus();
      return;
    }
    enCurso.current = true;
    setEnviando(true);
    setError(null);
    try {
      // Al servidor solo viaja si se aprueba o se rechaza; nunca los datos de la tarjeta.
      const p = await simularPago(pago.id, !tarjetaRechazada(tarjeta.numero));
      navigate(urlResultado(p), { replace: true });
    } catch (err: unknown) {
      const e = leerErrorApi(err, 'No pudimos procesar el pago.');
      if (e.status === 409) {
        navigate(urlResultado(pago), { replace: true });
        return;
      }
      // 502: reservation-service no respondió; el pago sigue PENDING y se puede reintentar.
      setError(
        e.status === 502
          ? 'No pudimos confirmar la reserva en este momento. El pago sigue pendiente: probá de nuevo.'
          : mensajePasarela('simulacion', e.status, e.mensaje),
      );
      enCurso.current = false;
      setEnviando(false);
    }
  };

  const esParte = pago !== null && pago.parteNumero !== null;

  return (
    <SectionContainer className="max-w-xl">
      <div className="flex flex-col gap-6 rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm sm:p-8">
        <div
          role="note"
          className="flex items-start gap-2 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm font-semibold text-amber-900"
        >
          <span aria-hidden="true" className="material-symbols-outlined">
            science
          </span>
          <span>
            Pago de prueba: no ingreses una tarjeta real. Usá cualquier número de 16 dígitos;
            terminado en 0000 se rechaza.
          </span>
        </div>

        <div>
          <h1
            ref={titulo}
            tabIndex={-1}
            className="text-secondary text-xl font-bold outline-none sm:text-2xl"
          >
            Pasarela de prueba
          </h1>
          <p className="text-secondary/60 text-sm">
            Es un entorno de desarrollo: no se cobra nada y los datos de la tarjeta no se guardan.
          </p>
        </div>

        <div aria-live="polite" className="flex flex-col gap-3">
          {cargando && <p className="text-secondary/70">Cargando el pago...</p>}
          {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        </div>

        {pago && (
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 rounded-xl bg-[#F8FAFC] p-4 text-sm">
            <dt className="text-secondary/60">Reserva</dt>
            <dd className="text-secondary text-right font-semibold">#{pago.reservationId}</dd>
            {esParte && (
              <>
                <dt className="text-secondary/60">Parte</dt>
                <dd className="text-secondary text-right font-semibold">
                  {pago.parteNumero} del pago en grupo
                </dd>
              </>
            )}
            <dt className="text-secondary/60">Moneda</dt>
            <dd className="text-secondary text-right font-semibold">{pago.currency}</dd>
            <dt className="text-secondary self-center font-bold">
              {esParte ? 'Tu parte' : 'Total a pagar'}
            </dt>
            <dd className="text-primary text-right text-2xl font-bold">
              {formatCurrency(pago.amount)}
            </dd>
          </dl>
        )}

        {pago && (
          <form
            ref={formRef}
            noValidate
            autoComplete="off"
            onSubmit={(ev) => void pagar(ev)}
            className="flex flex-col gap-5"
          >
            {/* Vista previa de la tarjeta (decorativa: repite lo que se escribe abajo). */}
            <div
              aria-hidden="true"
              className="bg-secondary mx-auto w-full max-w-xs rounded-xl p-5 text-white shadow-md"
            >
              <div className="mb-6 flex items-center justify-between">
                <div className="flex h-6 w-9 items-center justify-center rounded bg-amber-200/80">
                  <div className="h-4 w-6 rounded-sm border border-amber-400/40" />
                </div>
                <span className="font-mono text-xs tracking-widest text-white/70">PRUEBA</span>
              </div>
              <div className="mb-4 font-mono text-base tracking-widest whitespace-nowrap">
                {tarjeta.numero || '•••• •••• •••• ••••'}
              </div>
              <div className="flex items-end justify-between gap-3 text-[11px]">
                <div className="min-w-0">
                  <span className="block text-[8px] tracking-wider text-white/60 uppercase">
                    Titular
                  </span>
                  <span className="block truncate font-mono uppercase">
                    {tarjeta.titular || 'NOMBRE APELLIDO'}
                  </span>
                </div>
                <div className="shrink-0">
                  <span className="block text-[8px] tracking-wider text-white/60 uppercase">
                    Vence
                  </span>
                  <span className="font-mono">{tarjeta.vencimiento || 'MM/AA'}</span>
                </div>
              </div>
            </div>

            <Campo
              id="tarjeta-numero"
              label="Número de tarjeta"
              inputMode="numeric"
              autoComplete="off"
              placeholder="4500 1234 5678 9010"
              maxLength={19}
              value={tarjeta.numero}
              error={errores.numero}
              onChange={(e) => cambiar('numero', formatearNumero(e.target.value))}
            />
            <Campo
              id="tarjeta-titular"
              label="Nombre y apellido del titular"
              autoComplete="off"
              placeholder="Como figura en la tarjeta"
              maxLength={26}
              value={tarjeta.titular}
              error={errores.titular}
              onChange={(e) => cambiar('titular', e.target.value.toUpperCase())}
            />
            <div className="grid grid-cols-2 gap-3">
              <Campo
                id="tarjeta-vencimiento"
                label="Vencimiento"
                inputMode="numeric"
                autoComplete="off"
                placeholder="MM/AA"
                maxLength={5}
                value={tarjeta.vencimiento}
                error={errores.vencimiento}
                onChange={(e) => cambiar('vencimiento', formatearVencimiento(e.target.value))}
              />
              <Campo
                id="tarjeta-cvv"
                label="CVV"
                type="password"
                inputMode="numeric"
                autoComplete="off"
                placeholder="123"
                maxLength={4}
                value={tarjeta.cvv}
                error={errores.cvv}
                onChange={(e) => cambiar('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
              />
            </div>
            <div className="text-secondary flex flex-col gap-1 text-sm font-medium">
              <label htmlFor="tarjeta-cuotas">Cuotas</label>
              <select
                id="tarjeta-cuotas"
                autoComplete="off"
                className={inputClass}
                value={cuotas}
                onChange={(e) => setCuotas(Number(e.target.value))}
              >
                {CUOTAS.map((n) => (
                  <option key={n} value={n}>
                    {n === 1
                      ? `1 pago de ${formatCurrency(pago.amount)}`
                      : `${n} cuotas de ${formatCurrency(pago.amount / n)}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row-reverse">
              <button type="submit" disabled={enviando} className={cn(BOTON_LLENO, FOCO, 'flex-1')}>
                {enviando && (
                  <span
                    aria-hidden="true"
                    className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent motion-reduce:animate-none"
                  />
                )}
                {enviando ? 'Procesando...' : `Pagar ${formatCurrency(pago.amount)}`}
              </button>
              <Link to="/carrito" className={cn(BOTON_BORDE, FOCO, 'min-h-12 flex-1')}>
                Cancelar
              </Link>
            </div>
          </form>
        )}

        {!pago && (
          <Link
            to="/carrito"
            className={cn(
              'text-secondary/70 flex min-h-10 w-fit items-center text-sm font-semibold underline',
              FOCO,
            )}
          >
            Volver al carrito
          </Link>
        )}
      </div>
    </SectionContainer>
  );
};
