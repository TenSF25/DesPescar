import { useCallback, useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react';
import { Link, useParams } from 'react-router';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { BOTON_BORDE, BOTON_LLENO, CARD, FOCO } from '@/features/cart/components/estilos';
import { useAuthStore } from '@/store/useAuthStore';
import { cn } from '@/utils/cn';
import { PanelGrupo } from '../components/PanelGrupo';
import { PartesGrupo } from '../components/PartesGrupo';
import { ViajeGrupo } from '../components/ViajeGrupo';
import {
  apodoValido,
  formatMonto,
  formatPlazo,
  leerErrorGrupo,
  progresoGrupo,
  tokenValido,
} from '../grupo';
import type { FuenteGrupo } from '../grupo.types';
import { useGrupo } from '../hooks/useGrupo';
import { unirseGrupo } from '../services/grupoService';

const Aviso = ({
  icono,
  titulo,
  children,
  tono = 'normal',
}: {
  icono: string;
  titulo: string;
  children?: ReactNode;
  tono?: 'normal' | 'error';
}) => (
  <div
    role={tono === 'error' ? 'alert' : 'status'}
    className={cn(
      'flex flex-col items-center gap-3 px-4 py-12 text-center',
      CARD,
      tono === 'error' && 'border-red-200 bg-red-50',
    )}
  >
    <span
      aria-hidden
      className={cn(
        'material-symbols-outlined text-5xl!',
        tono === 'error' ? 'text-alert' : 'text-secondary/40',
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

const Dato = ({ etiqueta, children }: { etiqueta: string; children: ReactNode }) => (
  <div className="flex flex-col rounded-xl bg-[#F8FAFC] px-3 py-2">
    <dt className="text-secondary/60 text-xs font-semibold">{etiqueta}</dt>
    <dd className="text-secondary font-bold tabular-nums">{children}</dd>
  </div>
);

/** Quién tiene parte: con eso el panel se lee por participación y no por el enlace. */
interface Participa {
  clave: string;
  reservaId: number;
  soyOrganizador: boolean;
}

/** Invitación por enlace (D-b6, D-b7): consultar → sumarse → el panel del grupo como integrante. */
export const GrupoInvitacionPage = () => {
  const { token = '' } = useParams();
  const valido = tokenValido(token);
  const userId = useAuthStore((s) => s.user?.id);
  const clave = `${token}|${userId ?? ''}`;
  const [participa, setParticipa] = useState<Participa | null>(null);
  const conParte = participa !== null && participa.clave === clave ? participa : null;

  // Con parte, la consulta por el enlace se apaga: el panel sigue por participación (E-9).
  const fuenteToken = useMemo<FuenteGrupo | null>(
    () => (valido && !conParte ? { tipo: 'token', token } : null),
    [valido, conParte, token],
  );
  const { grupo, cargando, error, anuncio, recargar, aplicar } = useGrupo(fuenteToken);
  const fuentePanel = useMemo<FuenteGrupo | null>(
    () => (conParte ? { tipo: 'participacion', reservaId: conParte.reservaId } : null),
    [conParte],
  );

  const [apodo, setApodo] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [errorUnirse, setErrorUnirse] = useState<string | null>(null);
  const titulo = useRef<HTMLHeadingElement>(null);
  const campoApodo = useRef<HTMLInputElement>(null);
  const vueltas = useRef(0);
  const idApodo = useId();
  const apodoOk = apodoValido(apodo);

  // Quien ya tiene parte (o acaba de sumarse) pasa al panel; se ajusta durante el render.
  if (grupo && grupo.miParte !== null && !conParte) {
    setParticipa({ clave, reservaId: grupo.reservaId, soyOrganizador: grupo.soyOrganizador });
  }

  useEffect(() => {
    titulo.current?.focus();
  }, []);

  // Al pasar al panel el foco vuelve al título: el formulario de sumarse ya no está.
  const enPanel = conParte !== null;
  useEffect(() => {
    if (enPanel) titulo.current?.focus();
  }, [enPanel]);

  // Le liberaron la parte: se vuelve a leer por el enlace (una vez, para no girar en falso).
  const alPerderAcceso = useCallback(() => {
    if (vueltas.current >= 1) return;
    vueltas.current += 1;
    setParticipa(null);
  }, []);

  const sumarse = async () => {
    if (enviando) return;
    if (!apodoOk) {
      campoApodo.current?.focus();
      return;
    }
    setEnviando(true);
    setErrorUnirse(null);
    try {
      aplicar(await unirseGrupo(token, apodo.trim() || null));
    } catch (err: unknown) {
      const e = leerErrorGrupo(err, 'No pudimos sumarte al grupo.');
      setErrorUnirse(
        e.status === 403
          ? 'Solo las cuentas de cliente pueden sumarse a un pago en grupo.'
          : e.mensaje,
      );
      // El grupo cambió por debajo (se completó, venció): se vuelve a leer.
      if (e.status === 409 || e.status === 410) recargar();
    } finally {
      setEnviando(false);
    }
  };

  const encabezado = (
    <h1
      ref={titulo}
      tabIndex={-1}
      className="text-secondary text-2xl font-bold outline-none sm:text-3xl"
    >
      {conParte
        ? conParte.soyOrganizador
          ? 'El pago en grupo de tu viaje'
          : 'Tu pago en grupo'
        : 'Te invitaron a pagar un viaje en grupo'}
    </h1>
  );
  const contenedor = 'max-w-3xl pt-8 sm:pt-12';

  if (fuentePanel && conParte) {
    return (
      <SectionContainer className={contenedor}>
        {encabezado}
        <PanelGrupo
          fuente={fuentePanel}
          titulo={conParte.soyOrganizador ? 'Pago en grupo' : 'Tu parte del viaje'}
          onSinAcceso={alPerderAcceso}
        />
      </SectionContainer>
    );
  }

  if (!valido || (error && !grupo)) {
    const sinPermiso = error?.status === 403;
    const vencido = error?.status === 410;
    const noExiste = !valido || error?.status === 404;
    return (
      <SectionContainer className={contenedor}>
        {encabezado}
        <Aviso
          icono={sinPermiso ? 'lock' : vencido ? 'timer_off' : noExiste ? 'link_off' : 'cloud_off'}
          titulo={
            sinPermiso
              ? 'Esta cuenta no puede sumarse'
              : vencido
                ? 'Este enlace ya no está activo'
                : noExiste
                  ? 'No encontramos este pago en grupo'
                  : 'No pudimos abrir el pago en grupo'
          }
          tono="error"
        >
          <p className="max-w-md text-sm text-red-700">
            {sinPermiso
              ? 'Solo las cuentas de cliente pueden sumarse a un pago en grupo. Entrá con una cuenta de cliente y volvé a abrir el enlace.'
              : !valido
                ? 'Este enlace no es válido. Pedile a quien organiza que te lo vuelva a mandar.'
                : error?.mensaje}
          </p>
          <div className="flex w-full flex-col justify-center gap-2 sm:w-auto sm:flex-row">
            {valido && !sinPermiso && !vencido && !noExiste && (
              <button
                type="button"
                onClick={recargar}
                disabled={cargando}
                className={cn(BOTON_BORDE, FOCO, 'bg-white')}
              >
                <span aria-hidden className="material-symbols-outlined text-[20px]">
                  refresh
                </span>
                Reintentar
              </button>
            )}
            <Link to="/" className={cn(BOTON_LLENO, FOCO, 'min-h-11')}>
              Ir al inicio
            </Link>
          </div>
        </Aviso>
      </SectionContainer>
    );
  }

  if (!grupo) {
    return (
      <SectionContainer className={contenedor}>
        {encabezado}
        <Aviso icono="group" titulo="Buscando el grupo..." />
      </SectionContainer>
    );
  }

  const abierto = grupo.estado === 'ABIERTO' && grupo.segundosRestantes > 0;
  const libre = grupo.partes.find((p) => p.estado === 'LIBRE');

  return (
    <SectionContainer className={contenedor}>
      <p role="status" aria-live="polite" className="sr-only">
        {anuncio}
      </p>
      {encabezado}
      <section aria-labelledby="sumarse" className={cn('flex flex-col gap-4', CARD)}>
        <div className="flex items-start gap-3">
          <span
            aria-hidden
            className="bg-primary/10 text-primary flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
          >
            <span className="material-symbols-outlined text-[24px]">group_add</span>
          </span>
          <div>
            <h2 id="sumarse" className="text-secondary text-lg font-bold">
              Sumate al grupo
            </h2>
            <p className="text-secondary/70 text-sm">
              El total del viaje se divide en {grupo.cantidadPartes} partes. Cada persona paga la
              suya; cuando pagan todas, la reserva se confirma.
            </p>
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <Dato etiqueta="Total del viaje">{formatMonto(grupo.montoTotal)}</Dato>
          <Dato etiqueta="Avance">{progresoGrupo(grupo)}</Dato>
          {abierto && (
            <div className="col-span-2 sm:col-span-1">
              <Dato etiqueta="Tiempo para pagar">{formatPlazo(grupo.segundosRestantes)}</Dato>
            </div>
          )}
        </dl>
        {libre && abierto ? (
          <form
            className="flex flex-col gap-4"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              void sumarse();
            }}
          >
            <p className="border-primary/30 bg-primary/5 text-secondary rounded-xl border p-3">
              Te toca la parte {libre.numero}:{' '}
              <span className="text-primary text-lg font-bold tabular-nums">
                {formatMonto(libre.monto)}
              </span>
              <span className="text-secondary/70 block text-sm">
                Después de sumarte vas a poder pagarla desde esta misma página.
              </span>
            </p>
            <div className="flex flex-col gap-1">
              <label htmlFor={idApodo} className="text-secondary text-sm font-semibold">
                ¿Cómo querés que te vea el grupo?{' '}
                <span className="text-secondary/60 font-normal">(opcional)</span>
              </label>
              <input
                ref={campoApodo}
                id={idApodo}
                value={apodo}
                maxLength={30}
                autoComplete="nickname"
                onChange={(e) => {
                  setApodo(e.target.value);
                  setErrorUnirse(null);
                }}
                placeholder="Tu nombre o apodo"
                aria-invalid={!apodoOk}
                aria-describedby={`${idApodo}-ayuda`}
                className={cn(
                  'text-secondary min-h-11 w-full rounded-xl border px-3 sm:max-w-sm',
                  apodoOk ? 'border-[#E2E8F0]' : 'border-red-400',
                  FOCO,
                )}
              />
              <p
                id={`${idApodo}-ayuda`}
                className={cn('text-xs', apodoOk ? 'text-secondary/60' : 'text-red-700')}
              >
                {apodoOk
                  ? 'Hasta 30 letras o números. Nunca mostramos tu correo ni tu nombre real.'
                  : 'Usá solo letras, números, espacios, puntos, apóstrofos o guiones (hasta 30).'}
              </p>
            </div>
            {errorUnirse && (
              <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
                {errorUnirse}
              </p>
            )}
            <button
              type="submit"
              disabled={enviando}
              aria-busy={enviando}
              className={cn(
                'bg-primary hover:bg-primary/90 flex min-h-12 items-center justify-center gap-2 rounded-xl px-8 font-bold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:w-fit',
                FOCO,
              )}
            >
              <span aria-hidden className="material-symbols-outlined text-[20px]">
                group_add
              </span>
              {enviando ? 'Sumándote...' : 'Sumarme al grupo'}
            </button>
          </form>
        ) : (
          <>
            <p
              role="status"
              className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm font-semibold text-amber-900"
            >
              {abierto
                ? 'El grupo ya está completo: no quedan partes libres. Si te falta una, pedile a quien organiza que libere la tuya.'
                : 'Este pago en grupo ya no está abierto.'}
            </p>
            {errorUnirse && (
              <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
                {errorUnirse}
              </p>
            )}
          </>
        )}
        <div className="border-t border-[#E2E8F0] pt-2">
          <h3 className="text-secondary pt-2 text-sm font-bold">Quiénes están</h3>
          <PartesGrupo grupo={grupo} ocupado />
        </div>
      </section>
      <ViajeGrupo viaje={grupo.viaje} />
    </SectionContainer>
  );
};
