import { useCallback, useRef, useState, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { crearPago } from '@/features/payments/services/pagosService';
import { cn } from '@/utils/cn';
import { destinoPago } from '@/utils/destinoPago';
import { estadiasActivas, leerErrorApi } from '../carrito';
import { CuentaRegresiva } from '../components/CuentaRegresiva';
import { EstadiaEnCarrito } from '../components/EstadiaEnCarrito';
import { BOTON_BORDE, FOCO } from '../components/estilos';
import { PasajerosForm } from '../components/PasajerosForm';
import { BarraPago, ResumenCarrito } from '../components/ResumenCarrito';
import { TitularesForm } from '../components/TitularesForm';
import { VueloEnCarrito } from '../components/VueloEnCarrito';
import { useCarrito } from '../hooks/useCarrito';

const Estado = ({
  icono,
  titulo,
  children,
  tono = 'normal',
}: {
  icono: string;
  titulo: string;
  children?: ReactNode;
  tono?: 'normal' | 'error' | 'cargando';
}) => (
  <div
    role={tono === 'error' ? 'alert' : tono === 'cargando' ? 'status' : undefined}
    className={cn(
      'flex w-full flex-col items-center justify-center gap-3 rounded-2xl border px-4 py-12 text-center',
      tono === 'error' ? 'border-red-200 bg-red-50' : 'border-[#E2E8F0] bg-white',
    )}
  >
    <span
      aria-hidden
      className={cn(
        'material-symbols-outlined text-5xl!',
        tono === 'error' ? 'text-alert' : 'text-secondary/40',
        tono === 'cargando' && 'animate-spin',
      )}
    >
      {icono}
    </span>
    <p className={cn('text-lg font-bold', tono === 'error' ? 'text-red-700' : 'text-secondary')}>
      {titulo}
    </p>
    {children}
  </div>
);

const Titulo = () => <h1 className="text-secondary text-2xl font-bold sm:text-3xl">Tu carrito</h1>;

export const CarritoPage = () => {
  const { carrito, venceEn, cargado, cargando, error, recargar } = useCarrito();
  const navigate = useNavigate();
  const [vencio, setVencio] = useState(false);
  const [pagando, setPagando] = useState(false);
  const [errorPago, setErrorPago] = useState<string | null>(null);
  // Evita dos POST /api/payments por doble clic antes de que se vuelva a pintar el botón.
  const pagoEnCurso = useRef(false);

  const alVencer = useCallback(() => {
    setVencio(true);
    void recargar();
  }, [recargar]);

  const pagar = async () => {
    if (!carrito || pagoEnCurso.current) return;
    pagoEnCurso.current = true;
    setPagando(true);
    setErrorPago(null);
    try {
      const pago = await crearPago(carrito.idCarrito);
      const destino = destinoPago(pago.checkoutUrl);
      if (destino.tipo === 'interno') {
        navigate(destino.ruta);
      } else if (destino.tipo === 'externo') {
        window.location.assign(destino.url);
      } else {
        setErrorPago('El enlace de pago recibido no es válido. Probá de nuevo más tarde.');
      }
    } catch (err: unknown) {
      const e = leerErrorApi(err, 'No pudimos iniciar el pago.');
      setErrorPago(e.mensaje);
      // 409/410: el carrito cambió o venció; se muestra como está ahora.
      if (e.status === 409 || e.status === 410) void recargar();
    } finally {
      pagoEnCurso.current = false;
      setPagando(false);
    }
  };

  if (!cargado) {
    return (
      <SectionContainer>
        <Titulo />
        {error ? (
          <Estado icono="cloud_off" titulo="No pudimos cargar tu carrito" tono="error">
            <p className="text-sm text-red-700">{error}</p>
            <button
              type="button"
              onClick={() => void recargar()}
              disabled={cargando}
              className={cn(BOTON_BORDE, 'bg-white', FOCO)}
            >
              <span aria-hidden className="material-symbols-outlined text-[20px]">
                refresh
              </span>
              {cargando ? 'Reintentando...' : 'Reintentar'}
            </button>
          </Estado>
        ) : (
          <Estado icono="progress_activity" titulo="Cargando tu carrito..." tono="cargando" />
        )}
      </SectionContainer>
    );
  }

  if (!carrito) {
    return (
      <SectionContainer>
        <Titulo />
        {vencio && (
          <p
            role="status"
            className="flex items-start gap-2 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900"
          >
            <span aria-hidden className="material-symbols-outlined text-[20px]">
              timer_off
            </span>
            Se terminó el tiempo para pagar y liberamos los lugares que tenías reservados. Podés
            volver a agregarlos.
          </p>
        )}
        <Estado icono="shopping_cart" titulo="Tu carrito está vacío">
          <p className="text-secondary/70 max-w-sm text-sm">
            Sumá un vuelo, una estadía o los dos y pagalos juntos en un solo paso.
          </p>
          <div className="mt-2 flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Link
              to="/"
              className={cn(
                'bg-primary hover:bg-primary/90 flex min-h-11 items-center justify-center gap-2 rounded-xl px-6 font-bold text-white transition-colors',
                FOCO,
              )}
            >
              <span aria-hidden className="material-symbols-outlined text-[20px]">
                flight
              </span>
              Buscar vuelos
            </Link>
            <Link to="/hoteles" className={cn(BOTON_BORDE, FOCO)}>
              <span aria-hidden className="material-symbols-outlined text-[20px]">
                hotel
              </span>
              Buscar hoteles
            </Link>
          </div>
        </Estado>
      </SectionContainer>
    );
  }

  const estadias = estadiasActivas(carrito);

  return (
    <SectionContainer className="pt-8 sm:pt-12">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Titulo />
        {venceEn !== null && (
          <CuentaRegresiva
            key={venceEn}
            venceEn={venceEn}
            segundosIniciales={carrito.segundosRestantes}
            onVencido={alVencer}
          />
        )}
      </div>
      {error && (
        <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="flex min-w-0 flex-col gap-6">
          {carrito.vuelo && <VueloEnCarrito carrito={carrito} vuelo={carrito.vuelo} />}
          {estadias.map((e) => (
            <EstadiaEnCarrito key={e.id} estadia={e} />
          ))}
          {carrito.vuelo && (
            <PasajerosForm
              key={carrito.vuelo.flightIds.join()}
              carrito={carrito}
              vuelo={carrito.vuelo}
            />
          )}
          <TitularesForm carrito={carrito} />
          {cargando && (
            <p role="status" className="text-secondary/60 text-sm">
              Actualizando...
            </p>
          )}
        </div>
        <ResumenCarrito carrito={carrito} />
      </div>
      <BarraPago
        carrito={carrito}
        pagando={pagando}
        error={errorPago}
        onPagar={() => void pagar()}
      />
    </SectionContainer>
  );
};
