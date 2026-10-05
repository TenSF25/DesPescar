import { useState, useEffect } from 'react';
import { useFlightStore } from '@/store/useFlightStore';
import { simularPago, crearPago } from '../services/pagosService';
import { useCarritoStore } from '@/store/useCarritoStore';
import { pasajerosVisibles } from '@/features/cart/carrito';
import { useCarrito } from '@/features/cart/hooks/useCarrito';
import { CuentaRegresiva } from '@/features/cart/components/CuentaRegresiva';

type PassengerPaymentState = {
  nombre: string;
  asiento: string;
  precio: number;
  estadoPago: 'PENDIENTE' | 'PROCESANDO' | 'PAGADO';
  errorBancario?: string | null;
};

export const PagoSimuladoPage = () => {
  const reservationId = useFlightStore((state) => state.reservationId);
  const { limpiar } = useCarritoStore();
  const { carrito, venceEn, recargar } = useCarrito();

  const [step, setStep] = useState<'PAGOS' | 'EXITO'>('PAGOS');
  const [globalPaymentId, setGlobalPaymentId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [carritoVencido, setCarritoVencido] = useState(false);

  const [activePassengerIndex, setActivePassengerIndex] = useState<number | null>(null);

  const [cardData, setCardData] = useState({
    numero: '',
    titular: '',
    vencimiento: '',
    cvv: '',
    cuotas: '1',
  });

  const pasajerosReales = carrito ? pasajerosVisibles(carrito) : [];
  const crearPayments = () =>
    pasajerosReales.map((p) => ({
      nombre: p.nombre || 'Pasajero',
      asiento: p.asiento || 'Sin asignar',
      precio: carrito?.vuelo?.precioPorPasajero || 160400,
      estadoPago: 'PENDIENTE' as const,
      errorBancario: null,
    }));
  const [payments, setPayments] = useState<PassengerPaymentState[]>(crearPayments);
  const [carritoDePayments, setCarritoDePayments] = useState(carrito);

  if (carritoDePayments !== carrito) {
    setCarritoDePayments(carrito);
    setPayments(crearPayments());
  }

  useEffect(() => {
    const iniciarPagoGlobal = async () => {
      if (!reservationId) return;
      try {
        setIsInitializing(true);
        const pagoCreado = await crearPago();
        setGlobalPaymentId(pagoCreado.id);
      } catch (error) {
        console.error('Error al inicializar el pago:', error);
      } finally {
        setIsInitializing(false);
      }
    };
    iniciarPagoGlobal();
  }, [reservationId]);

  const handleVencido = () => {
    setCarritoVencido(true);
    limpiar();
    void recargar();
  };

  const handleVencimientoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length >= 3) {
      val = val.slice(0, 2) + '/' + val.slice(2, 4);
    }
    setCardData({ ...cardData, vencimiento: val });
  };

  const handleNumeroTarjetaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 16);
    setCardData({ ...cardData, numero: val });
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCardData({ ...cardData, cvv: val });
  };

  const ejecutarPagoPasajero = async (index: number) => {
    if (carritoVencido) return;

    const updated = [...payments];

    if (!cardData.numero || !cardData.titular || !cardData.vencimiento || !cardData.cvv) {
      updated[index].errorBancario = 'Complete todos los campos obligatorios para continuar.';
      setPayments(updated);
      return;
    }

    if (cardData.numero.length < 16) {
      updated[index].errorBancario = 'El número de tarjeta debe contener 16 dígitos.';
      setPayments(updated);
      return;
    }

    if (cardData.vencimiento.length < 5) {
      updated[index].errorBancario = 'Ingrese una fecha de expiración válida (MM/AA).';
      setPayments(updated);
      return;
    }

    if (cardData.cvv.length < 3) {
      updated[index].errorBancario = 'El código de seguridad CVV es inválido.';
      setPayments(updated);
      return;
    }

    const esTarjetaRechazada =
      cardData.numero.endsWith('0000') || cardData.numero.startsWith('9999');

    updated[index].errorBancario = null;
    updated[index].estadoPago = 'PROCESANDO';
    setPayments(updated);

    setTimeout(async () => {
      const finished = [...payments];

      if (esTarjetaRechazada) {
        finished[index].estadoPago = 'PENDIENTE';
        finished[index].errorBancario =
          'La transacción fue declinada por la entidad emisora. Verifique los datos o pruebe con otro medio.';
        setPayments(finished);
        return;
      }

      finished[index].estadoPago = 'PAGADO';
      finished[index].errorBancario = null;
      setPayments(finished);
      setActivePassengerIndex(null);

      if (finished.every((p) => p.estadoPago === 'PAGADO') && globalPaymentId) {
        try {
          await simularPago(globalPaymentId, true);
          setStep('EXITO');
          limpiar();
        } catch (err) {
          console.error('Error al confirmar la transacción:', err);
        }
      }
    }, 1800);
  };

  const totalPasajeros = payments.length;
  const pagados = payments.filter((p) => p.estadoPago === 'PAGADO').length;
  const porcentajeProgreso = totalPasajeros > 0 ? (pagados / totalPasajeros) * 100 : 0;

  return (
    <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      {/* HEADER LIMPIO Y CORPORATIVO */}
      <div className="mb-6 flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
            Pasarela Segura
          </span>
          <h2 className="text-xl font-bold text-slate-900">Finalizar Reserva</h2>
        </div>

        {venceEn !== null && (
          <div className="flex items-center">
            <CuentaRegresiva key={venceEn} venceEn={venceEn} onVencido={handleVencido} />
          </div>
        )}
      </div>

      {carritoVencido ? (
        <div className="py-12 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-lg text-red-600">
            !
          </div>
          <h3 className="mb-1 text-lg font-bold text-slate-900">
            El tiempo de reserva ha expirado
          </h3>
          <p className="mx-auto max-w-xs text-sm text-slate-500">
            Los lugares reservados fueron liberados automáticamente por el sistema.
          </p>
        </div>
      ) : (
        <>
          {step === 'PAGOS' && (
            <div className="space-y-5">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="mb-2 flex justify-between text-xs font-semibold text-slate-600">
                  <span>Progreso de autorización</span>
                  <span>
                    {pagados} de {totalPasajeros} completados
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-slate-900 transition-all duration-500"
                    style={{ width: `${porcentajeProgreso}%` }}
                  ></div>
                </div>
              </div>

              {isInitializing && (
                <div className="rounded-lg bg-slate-50 p-3 text-center text-xs font-medium text-slate-500">
                  Estableciendo conexión segura con el servidor...
                </div>
              )}

              {/* LISTA DE PASAJEROS */}
              <div className="space-y-3">
                {payments.map((p, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-200 bg-white p-4 transition-all"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 font-mono text-xs font-bold text-slate-700">
                          {p.asiento}
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-slate-900">{p.nombre}</h4>
                          <p className="text-xs text-slate-500">
                            Asiento {p.asiento} •{' '}
                            <span className="font-medium text-slate-700">
                              ${p.precio.toLocaleString('es-AR')},00 ARS
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        {p.estadoPago === 'PENDIENTE' && (
                          <button
                            onClick={() => {
                              setActivePassengerIndex(activePassengerIndex === idx ? null : idx);
                              setCardData({
                                numero: '',
                                titular: '',
                                vencimiento: '',
                                cvv: '',
                                cuotas: '1',
                              });
                            }}
                            disabled={isInitializing}
                            className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-50"
                          >
                            {activePassengerIndex === idx ? 'Cerrar' : 'Pagar'}
                          </button>
                        )}
                        {p.estadoPago === 'PROCESANDO' && (
                          <span className="flex items-center gap-2 text-xs font-medium text-slate-500">
                            <span className="h-3 w-3 animate-spin rounded-full border-2 border-slate-900 border-t-transparent"></span>
                            Procesando...
                          </span>
                        )}
                        {p.estadoPago === 'PAGADO' && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                            ✓ Pagado
                          </span>
                        )}
                      </div>
                    </div>

                    {p.errorBancario && (
                      <div className="mt-3 rounded-lg border border-red-100 bg-red-50 p-2.5 text-xs font-medium text-red-600">
                        {p.errorBancario}
                      </div>
                    )}

                    {activePassengerIndex === idx && (
                      <div className="mt-4 border-t border-slate-100 pt-4">
                        {/* TARJETA DE CRÉDITO REALISTA Y SOBRIA */}
                        <div className="relative mx-auto mb-4 max-w-xs overflow-hidden rounded-xl bg-slate-900 p-5 text-white shadow-md">
                          <div className="mb-6 flex items-center justify-between">
                            <div className="flex h-6 w-9 items-center justify-center rounded bg-amber-200/80">
                              <div className="h-4 w-6 rounded-sm border border-amber-400/40"></div>
                            </div>
                            <span className="font-mono text-xs tracking-widest text-slate-300">
                              DEBIT / CREDIT
                            </span>
                          </div>
                          <div className="mb-4 font-mono text-base tracking-widest">
                            {cardData.numero || '•••• •••• •••• ••••'}
                          </div>
                          <div className="flex items-end justify-between text-[11px]">
                            <div>
                              <span className="block text-[8px] tracking-wider text-slate-400 uppercase">
                                Titular
                              </span>
                              <span className="block max-w-[150px] truncate font-mono uppercase">
                                {cardData.titular || 'NOMBRE APELLIDO'}
                              </span>
                            </div>
                            <div>
                              <span className="block text-[8px] tracking-wider text-slate-400 uppercase">
                                Vence
                              </span>
                              <span className="font-mono">{cardData.vencimiento || 'MM/AA'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="mx-auto grid max-w-md gap-3 text-xs">
                          <div>
                            <label className="mb-1 block font-medium text-slate-600">
                              Número de Tarjeta
                            </label>
                            <input
                              type="text"
                              placeholder="4500 1234 5678 9010"
                              maxLength={16}
                              className="w-full rounded-lg border border-slate-200 bg-white p-2.5 font-mono text-slate-800 focus:border-slate-900 focus:outline-none"
                              value={cardData.numero}
                              onChange={handleNumeroTarjetaChange}
                            />
                          </div>
                          <div>
                            <label className="mb-1 block font-medium text-slate-600">
                              Nombre y Apellido
                            </label>
                            <input
                              type="text"
                              placeholder="Como figura en el plástico"
                              maxLength={26}
                              className="w-full rounded-lg border border-slate-200 bg-white p-2.5 font-medium text-slate-800 uppercase focus:border-slate-900 focus:outline-none"
                              value={cardData.titular}
                              onChange={(e) =>
                                setCardData({ ...cardData, titular: e.target.value.toUpperCase() })
                              }
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="mb-1 block font-medium text-slate-600">
                                Vencimiento
                              </label>
                              <input
                                type="text"
                                placeholder="MM/AA"
                                maxLength={5}
                                className="w-full rounded-lg border border-slate-200 bg-white p-2.5 font-mono text-slate-800 focus:border-slate-900 focus:outline-none"
                                value={cardData.vencimiento}
                                onChange={handleVencimientoChange}
                              />
                            </div>
                            <div>
                              <label className="mb-1 block font-medium text-slate-600">CVV</label>
                              <input
                                type="password"
                                placeholder="123"
                                maxLength={4}
                                className="w-full rounded-lg border border-slate-200 bg-white p-2.5 font-mono text-slate-800 focus:border-slate-900 focus:outline-none"
                                value={cardData.cvv}
                                onChange={handleCvvChange}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="mb-1 block font-medium text-slate-600">Cuotas</label>
                            <select
                              className="w-full rounded-lg border border-slate-200 bg-white p-2.5 font-medium text-slate-800 focus:border-slate-900 focus:outline-none"
                              value={cardData.cuotas}
                              onChange={(e) => setCardData({ ...cardData, cuotas: e.target.value })}
                            >
                              <option value="1">
                                1 Pago (${p.precio.toLocaleString('es-AR')},00 ARS)
                              </option>
                              <option value="3">
                                3 Cuotas sin interés (${(p.precio / 3).toFixed(2)} ARS / mes)
                              </option>
                              <option value="6">
                                6 Cuotas fijas (${(p.precio / 6).toFixed(2)} ARS / mes)
                              </option>
                            </select>
                          </div>

                          <div className="flex gap-2 pt-2">
                            <button
                              type="button"
                              onClick={() => setActivePassengerIndex(null)}
                              className="flex-1 rounded-lg border border-slate-200 py-2.5 font-medium text-slate-600 transition-colors hover:bg-slate-50"
                            >
                              Cancelar
                            </button>
                            <button
                              type="button"
                              onClick={() => ejecutarPagoPasajero(idx)}
                              className="flex-1 rounded-lg bg-slate-900 py-2.5 font-bold text-white transition-colors hover:bg-slate-800"
                            >
                              Pagar ${p.precio.toLocaleString('es-AR')},00
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 'EXITO' && (
            <div className="py-10 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-xl font-bold text-emerald-600">
                ✓
              </div>
              <h2 className="mb-1 text-xl font-bold text-slate-900">Pago Procesado con Éxito</h2>
              <p className="mx-auto mb-6 max-w-xs text-xs text-slate-500">
                La transacción ha sido autorizada y los asientos fueron confirmados de forma
                definitiva.
              </p>
              <div className="inline-block rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 font-mono text-xs text-slate-600">
                ID Operación: {globalPaymentId || 'CONFIRMADO'}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
