import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { SectionContainer } from '@/components/ui/SectionContainer';
import type { Carrito } from '@/features/cart/cart.types';
import { estadiasActivas, leerErrorApi } from '@/features/cart/carrito';
import { BOTON_BORDE, BOTON_LLENO, FOCO } from '@/features/cart/components/estilos';
import { obtenerReserva } from '@/features/cart/services/carritoService';
import { useCarritoStore } from '@/store/useCarritoStore';
import { useFlightStore } from '@/store/useFlightStore';
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/formatCurrency';
import {
  ESPERA_CONSULTA_MS,
  leerRetornoPago,
  resultadoPago,
  seguirConsultando,
  ultimoPago,
} from '../pagos';
import type { Pago, RetornoPago } from '../payments.types';
import { conciliarPago, obtenerPago, pagosDeReserva } from '../services/pagosService';

const ICONO = { exito: 'check_circle', pendiente: 'hourglass_top', error: 'cancel' } as const;
const COLOR = { exito: 'text-success', pendiente: 'text-amber-600', error: 'text-alert' } as const;

/** Pago y reserva actuales. Con Mercado Pago, si se pide, concilia con el payment_id (D16). */
const consultar = async (
  retorno: RetornoPago,
  conciliar: boolean,
): Promise<{ pago: Pago; reserva: Carrito }> => {
  let pago: Pago | null;
  if (retorno.tipo === 'mock') {
    pago = ultimoPago(await pagosDeReserva(retorno.reservaId));
  } else if (conciliar && retorno.mpPaymentId) {
    try {
      pago = await conciliarPago(retorno.pagoId, retorno.mpPaymentId);
    } catch {
      // Si MP todavía no lo informa o no corresponde, se muestra el estado guardado.
      pago = await obtenerPago(retorno.pagoId);
    }
  } else {
    pago = await obtenerPago(retorno.pagoId);
  }
  if (!pago) throw new Error('Esta reserva no tiene pagos.');
  return { pago, reserva: await obtenerReserva(pago.reservationId) };
};

const fecha = (iso: string) => {
  const [a, m, d] = iso.slice(0, 10).split('-');
  return `${d}/${m}/${a}`;
};

export const PagoResultadoPage = () => {
  const [sp] = useSearchParams();
  const retorno = useMemo(() => leerRetornoPago(sp), [sp]);
  const recargarCarrito = useCarritoStore((s) => s.recargar);
  const [datos, setDatos] = useState<{ pago: Pago; reserva: Carrito } | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Cada cambio de intento dispara una consulta; inicio marca desde cuándo se espera.
  const [intento, setIntento] = useState(0);
  const [inicio, setInicio] = useState(() => Date.now());
  const [agotado, setAgotado] = useState(false);
  const conciliar = useRef(true);
  const limpiado = useRef(false);

  const resultado = datos ? resultadoPago(datos.pago, datos.reserva.estadoGeneral) : null;
  const pendiente = resultado?.seguirConsultando ?? false;
  const confirmado = resultado?.tono === 'exito';

  useEffect(() => {
    if (!retorno) return;
    let activo = true;
    const cargar = async () => {
      try {
        const d = await consultar(retorno, conciliar.current);
        conciliar.current = false;
        if (!activo) return;
        setDatos(d);
        setError(null);
      } catch (err: unknown) {
        if (activo) setError(leerErrorApi(err, 'No pudimos consultar el pago.').mensaje);
      }
    };
    void cargar();
    return () => {
      activo = false;
    };
  }, [retorno, intento]);

  // Con la reserva confirmada: se olvida la compra de vuelos y el carrito queda vacío.
  useEffect(() => {
    if (!confirmado || limpiado.current) return;
    limpiado.current = true;
    useFlightStore.getState().clearSearch();
    void recargarCarrito();
  }, [confirmado, recargarCarrito]);

  // Mientras siga pendiente, otra consulta cada 4 s hasta el máximo; se cancela al salir.
  useEffect(() => {
    if (!pendiente) return;
    const t = window.setTimeout(() => {
      if (seguirConsultando(true, inicio, Date.now())) setIntento((n) => n + 1);
      else setAgotado(true);
    }, ESPERA_CONSULTA_MS);
    return () => window.clearTimeout(t);
  }, [pendiente, intento, inicio]);

  const actualizar = useCallback(() => {
    conciliar.current = true;
    setAgotado(false);
    setInicio(Date.now());
    setIntento((n) => n + 1);
  }, []);

  if (!retorno) {
    return (
      <SectionContainer className="max-w-xl">
        <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          No encontramos los datos del pago.{' '}
          <Link to="/carrito" className={cn('font-bold underline', FOCO)}>
            Ir al carrito
          </Link>
        </p>
      </SectionContainer>
    );
  }

  const estadias = datos ? estadiasActivas(datos.reserva) : [];
  const vuelo = datos?.reserva.vuelo ?? null;

  return (
    <SectionContainer className="max-w-xl">
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-5 text-center shadow-sm sm:p-10">
        {!resultado && !error && (
          <div role="status" className="flex flex-col items-center gap-3">
            <span
              aria-hidden="true"
              className="material-symbols-outlined text-secondary animate-spin text-5xl"
            >
              autorenew
            </span>
            <p className="text-secondary font-semibold">Consultando tu pago...</p>
          </div>
        )}
        {resultado && datos && (
          <>
            <span
              aria-hidden="true"
              className={cn(
                'material-symbols-outlined text-6xl',
                COLOR[resultado.tono],
                pendiente && !agotado && 'animate-pulse',
              )}
            >
              {ICONO[resultado.tono]}
            </span>
            <h1 className="text-secondary text-2xl font-bold">{resultado.titulo}</h1>
            <p role="status" className="text-secondary/70">
              {resultado.detalle}
            </p>
            <dl className="grid w-full grid-cols-[auto_1fr] gap-x-4 gap-y-1 rounded-xl bg-[#F8FAFC] p-4 text-left text-sm">
              <dt className="text-secondary/60">Reserva</dt>
              <dd className="text-secondary text-right font-semibold">
                #{datos.reserva.idCarrito}
              </dd>
              {confirmado && vuelo && (
                <>
                  <dt className="text-secondary/60">Vuelo</dt>
                  <dd className="text-secondary text-right font-semibold">
                    {vuelo.cantidadPasajeros}{' '}
                    {vuelo.cantidadPasajeros === 1 ? 'pasajero' : 'pasajeros'}, sale el{' '}
                    {fecha(vuelo.salida)}
                  </dd>
                </>
              )}
              {confirmado &&
                estadias.map((e) => (
                  <div key={e.id} className="col-span-2 grid grid-cols-subgrid">
                    <dt className="text-secondary/60">Estadía</dt>
                    <dd className="text-secondary text-right font-semibold">
                      {e.hotelNombre}, {fecha(e.checkIn)} al {fecha(e.checkOut)}
                    </dd>
                  </div>
                ))}
              <dt className="text-secondary/60">Monto</dt>
              <dd className="text-secondary text-right font-semibold">
                {formatCurrency(datos.pago.amount)}
              </dd>
            </dl>
          </>
        )}
        {pendiente && agotado && (
          <p className="text-secondary/70 text-sm">
            Seguimos procesando tu pago. Puede tardar un poco más de lo normal: podés actualizar
            para volver a consultar.
          </p>
        )}
        {error && (
          <p role="alert" className="w-full rounded-xl bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          {confirmado && (
            <Link to="/my-reservations" className={cn(BOTON_LLENO, FOCO)}>
              Ver mis reservas
            </Link>
          )}
          {(error || (pendiente && agotado)) && (
            <button type="button" onClick={actualizar} className={cn(BOTON_LLENO, FOCO)}>
              Actualizar estado
            </button>
          )}
          {!confirmado && resultado?.reintentar && (
            <Link to="/carrito" className={cn(BOTON_LLENO, FOCO)}>
              Volver al carrito
            </Link>
          )}
          <Link to="/" className={cn(BOTON_BORDE, FOCO, 'min-h-12')}>
            Ir al inicio
          </Link>
        </div>
      </div>
    </SectionContainer>
  );
};
