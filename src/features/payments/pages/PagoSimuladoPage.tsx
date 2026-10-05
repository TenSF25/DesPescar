import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { leerErrorApi } from '@/features/cart/carrito';
import { BOTON_BORDE, BOTON_LLENO, FOCO } from '@/features/cart/components/estilos';
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/formatCurrency';
import type { Pago } from '../payments.types';
import { obtenerPago, simularPago } from '../services/pagosService';

const resultadoUrl = (pago: Pago) => `/pago/resultado?reserva=${pago.reservationId}`;

/**
 * Pasarela de prueba (proveedor mock). No pide datos de tarjeta: aprueba o rechaza el pago con
 * POST /api/payments/{id}/simulacion y lleva al resultado.
 */
export const PagoSimuladoPage = () => {
  const [sp] = useSearchParams();
  const pagoId = sp.get('pago') ?? '';
  const navigate = useNavigate();
  const [pago, setPago] = useState<Pago | null>(null);
  const [cargando, setCargando] = useState(Boolean(pagoId));
  const [enviando, setEnviando] = useState<'aprobar' | 'rechazar' | null>(null);
  const [error, setError] = useState<string | null>(pagoId ? null : 'Falta el pago a simular.');

  useEffect(() => {
    if (!pagoId) return;
    let activo = true;
    const cargar = async () => {
      try {
        const p = await obtenerPago(pagoId);
        if (!activo) return;
        if (p.status !== 'PENDING') {
          navigate(resultadoUrl(p), { replace: true });
          return;
        }
        setPago(p);
      } catch (err: unknown) {
        if (activo) setError(leerErrorApi(err, 'No encontramos este pago.').mensaje);
      } finally {
        if (activo) setCargando(false);
      }
    };
    void cargar();
    return () => {
      activo = false;
    };
  }, [pagoId, navigate]);

  const simular = async (aprobado: boolean) => {
    if (!pago || enviando) return;
    setEnviando(aprobado ? 'aprobar' : 'rechazar');
    setError(null);
    try {
      const p = await simularPago(pago.id, aprobado);
      navigate(resultadoUrl(p), { replace: true });
    } catch (err: unknown) {
      const e = leerErrorApi(err, 'No pudimos procesar el pago.');
      if (e.status === 409) {
        navigate(resultadoUrl(pago), { replace: true });
        return;
      }
      // 502: reservation-service no respondió; el pago sigue PENDING y se puede reintentar.
      setError(
        e.status === 502
          ? 'No pudimos confirmar la reserva en este momento. El pago sigue pendiente: probá de nuevo.'
          : e.mensaje,
      );
      setEnviando(null);
    }
  };

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
          <span>Pago de prueba: es un entorno de desarrollo y no se cobra nada.</span>
        </div>

        <div>
          <h1 className="text-secondary text-xl font-bold sm:text-2xl">Pasarela de prueba</h1>
          <p className="text-secondary/60 text-sm">
            Elegí si querés aprobar o rechazar este pago. No hace falta cargar una tarjeta.
          </p>
        </div>

        {cargando && (
          <p role="status" className="text-secondary/70">
            Cargando el pago...
          </p>
        )}

        {pago && (
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 rounded-xl bg-[#F8FAFC] p-4 text-sm">
            <dt className="text-secondary/60">Reserva</dt>
            <dd className="text-secondary text-right font-semibold">#{pago.reservationId}</dd>
            <dt className="text-secondary/60">Moneda</dt>
            <dd className="text-secondary text-right font-semibold">{pago.currency}</dd>
            <dt className="text-secondary self-center font-bold">Total a pagar</dt>
            <dd className="text-primary text-right text-2xl font-bold">
              {formatCurrency(pago.amount)}
            </dd>
          </dl>
        )}

        {error && (
          <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {pago && (
          <div className="flex flex-col gap-3 sm:flex-row-reverse">
            <button
              type="button"
              onClick={() => void simular(true)}
              disabled={enviando !== null}
              className={cn(BOTON_LLENO, FOCO, 'flex-1')}
            >
              {enviando === 'aprobar' ? 'Procesando...' : 'Aprobar pago'}
            </button>
            <button
              type="button"
              onClick={() => void simular(false)}
              disabled={enviando !== null}
              className={cn(BOTON_BORDE, FOCO, 'min-h-12 flex-1')}
            >
              {enviando === 'rechazar' ? 'Procesando...' : 'Rechazar pago'}
            </button>
          </div>
        )}

        <Link
          to="/carrito"
          className={cn('text-secondary/70 w-fit py-2 text-sm font-semibold underline', FOCO)}
        >
          Volver al carrito
        </Link>
      </div>
    </SectionContainer>
  );
};
