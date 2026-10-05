import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { AvisoPartesPendientes } from '@/features/grupo/components/AvisoPartesPendientes';
import { DividirPago } from '@/features/grupo/components/DividirPago';
import { PanelGrupo } from '@/features/grupo/components/PanelGrupo';
import { puedeDividir } from '@/features/grupo/grupo';
import type { FuenteGrupo } from '@/features/grupo/grupo.types';
import { crearPago } from '@/features/payments/services/pagosService';
import { useCarritoStore } from '@/store/useCarritoStore';
import { useFlightStore } from '@/store/useFlightStore';
import { cn } from '@/utils/cn';
import { destinoPago } from '@/utils/destinoPago';
import { enGrupo, estadiasActivas, leerErrorApi } from '../carrito';
import { CarritoUiContext, type CarritoUi, type Formulario } from '../components/carritoUi';
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

const BuscarDeNuevo = () => (
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
);

export const CarritoPage = () => {
  const { carrito, venceEn, cargado, cargando, error, expirado, recargar } = useCarrito();
  const limpiarCompra = useFlightStore((s) => s.limpiarCompra);
  const navigate = useNavigate();
  const titulo = useRef<HTMLHeadingElement>(null);
  // venceEn del carrito que la cuenta regresiva vio llegar a cero (bloquea Pagar).
  const [vencioEn, setVencioEn] = useState<number | null>(null);
  // Aviso de vencimiento para cuando el carrito ya no está.
  const [avisoVencido, setAvisoVencido] = useState(false);
  const [pagando, setPagando] = useState(false);
  const [errorPago, setErrorPago] = useState<string | null>(null);
  const [anuncio, setAnuncio] = useState('');
  const [edicion, setEdicion] = useState<Record<Formulario, boolean>>({
    pasajeros: false,
    titulares: false,
  });
  const [enfocarTitulo, setEnfocarTitulo] = useState(0);
  // Evita dos POST /api/payments por doble clic antes de que se vuelva a pintar el botón.
  const pagoEnCurso = useRef(false);

  useEffect(() => {
    if (enfocarTitulo > 0) titulo.current?.focus();
  }, [enfocarTitulo]);

  // El carrito que se paga en grupo (D-b17): el panel lee el grupo como organizador.
  const fuenteGrupo = useMemo<FuenteGrupo | null>(
    () =>
      carrito && enGrupo(carrito) ? { tipo: 'organizador', reservaId: carrito.idCarrito } : null,
    [carrito],
  );

  const ui = useMemo<CarritoUi>(() => {
    const anunciar = (texto: string) => {
      // Se vacía primero para que un texto repetido se vuelva a anunciar.
      setAnuncio('');
      window.setTimeout(() => setAnuncio(texto), 50);
    };
    return {
      anunciar,
      itemQuitado: (texto) => {
        anunciar(texto);
        setEnfocarTitulo((n) => n + 1);
      },
      marcarEdicion: (formulario, editando) =>
        setEdicion((actual) =>
          actual[formulario] === editando ? actual : { ...actual, [formulario]: editando },
        ),
    };
  }, []);

  const alVencer = useCallback(() => {
    setVencioEn(venceEn);
    setAvisoVencido(true);
    limpiarCompra();
    void recargar();
  }, [venceEn, limpiarCompra, recargar]);

  const pagar = async () => {
    if (!carrito || pagoEnCurso.current) return;
    pagoEnCurso.current = true;
    setPagando(true);
    setErrorPago(null);
    let saliendo = false;
    try {
      const pago = await crearPago(carrito.idCarrito);
      const destino = destinoPago(pago.checkoutUrl);
      if (destino.tipo === 'interno') {
        navigate(destino.ruta);
      } else if (destino.tipo === 'externo') {
        // Se deja el botón en "Preparando..." mientras el navegador va a Mercado Pago.
        saliendo = true;
        window.location.assign(destino.url);
      } else {
        setErrorPago('El enlace de pago recibido no es válido. Probá de nuevo más tarde.');
      }
    } catch (err: unknown) {
      const e = leerErrorApi(err, 'No pudimos iniciar el pago.');
      setErrorPago(e.mensaje);
      // 409/410: el carrito cambió o venció; se muestra como está ahora.
      if (e.status === 409 || e.status === 410) {
        await recargar();
        if (useCarritoStore.getState().carrito === null) {
          setAvisoVencido(true);
          limpiarCompra();
        }
      }
    } finally {
      if (!saliendo) {
        pagoEnCurso.current = false;
        setPagando(false);
      }
    }
  };

  const regionViva = (
    <p role="status" aria-live="polite" className="sr-only">
      {anuncio}
    </p>
  );

  const encabezado = (
    <h1
      ref={titulo}
      tabIndex={-1}
      className="text-secondary text-2xl font-bold outline-none sm:text-3xl"
    >
      Tu carrito
    </h1>
  );

  if (!cargado) {
    return (
      <SectionContainer>
        {regionViva}
        {encabezado}
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
        {regionViva}
        {encabezado}
        <AvisoPartesPendientes />
        {avisoVencido || expirado ? (
          <Estado icono="timer_off" titulo="Tu carrito venció">
            <p role="status" className="text-secondary/70 max-w-md text-sm">
              Se terminó el tiempo para pagar y liberamos los lugares que tenías reservados. Podés
              volver a buscarlos y agregarlos.
            </p>
            <BuscarDeNuevo />
          </Estado>
        ) : (
          <Estado icono="shopping_cart" titulo="Tu carrito está vacío">
            <p className="text-secondary/70 max-w-sm text-sm">
              Sumá un vuelo, una estadía o los dos y pagalos juntos en un solo paso.
            </p>
            <BuscarDeNuevo />
          </Estado>
        )}
      </SectionContainer>
    );
  }

  const estadias = estadiasActivas(carrito);
  const vuelo = carrito.vuelo;

  // Carrito congelado por el pago en grupo: sin formularios, sin quitar ítems y sin barra de pago.
  if (fuenteGrupo !== null) {
    return (
      <SectionContainer className="pt-8 sm:pt-12">
        {regionViva}
        {encabezado}
        <AvisoPartesPendientes omitirReserva={carrito.idCarrito} />
        {error && (
          <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="flex min-w-0 flex-col gap-6">
            <PanelGrupo fuente={fuenteGrupo} />
          </div>
          <ResumenCarrito carrito={carrito} />
        </div>
      </SectionContainer>
    );
  }

  return (
    <CarritoUiContext.Provider value={ui}>
      <SectionContainer className="pt-8 sm:pt-12">
        {regionViva}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {encabezado}
          {venceEn !== null && (
            <CuentaRegresiva key={venceEn} venceEn={venceEn} onVencido={alVencer} />
          )}
        </div>
        <AvisoPartesPendientes omitirReserva={carrito.idCarrito} />
        {error && (
          <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="flex min-w-0 flex-col gap-6">
            {vuelo && <VueloEnCarrito carrito={carrito} vuelo={vuelo} />}
            {estadias.map((e) => (
              <EstadiaEnCarrito key={e.id} estadia={e} />
            ))}
            {vuelo && (
              <PasajerosForm
                key={`${vuelo.flightIds.join()}|${vuelo.fareIds.join()}|${vuelo.cantidadPasajeros}`}
                carrito={carrito}
                vuelo={vuelo}
              />
            )}
            <TitularesForm carrito={carrito} />
            {puedeDividir(carrito) && !(edicion.pasajeros || edicion.titulares) && (
              <DividirPago
                carrito={carrito}
                onIniciado={(g) => {
                  ui.anunciar(`Pago en grupo creado con ${g.cantidadPartes} partes.`);
                  void recargar();
                }}
                onCarritoCambio={() => void recargar()}
              />
            )}
            {cargando && <p className="text-secondary/60 text-sm">Actualizando...</p>}
          </div>
          <ResumenCarrito carrito={carrito} />
        </div>
        <BarraPago
          carrito={carrito}
          pagando={pagando}
          editando={edicion.pasajeros || edicion.titulares}
          vencido={vencioEn !== null && vencioEn === venceEn}
          error={errorPago}
          onPagar={() => void pagar()}
        />
      </SectionContainer>
    </CarritoUiContext.Provider>
  );
};
