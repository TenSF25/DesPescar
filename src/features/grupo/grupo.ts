import type { Carrito, ErrorApi } from '@/features/cart/cart.types';
import { leerErrorApi } from '@/features/cart/carrito';
import type { EstadoGrupo, Grupo, GrupoResumen, ParteGrupo } from './grupo.types';

// ---------- centavos (D-b24) ----------

export const aCentavos = (pesos: number) => Math.round(pesos * 100);
export const deCentavos = (centavos: number) => centavos / 100;

const conDecimales = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const sinDecimales = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** Pesos con decimales solo si los tienen ("$ 353.333,33", "$ 1.060.000"). */
export const formatMonto = (pesos: number) =>
  aCentavos(pesos) % 100 === 0 ? sinDecimales.format(pesos) : conDecimales.format(pesos);

export const formatCentavos = (centavos: number) => formatMonto(deCentavos(centavos));

/**
 * Lo que escribe una persona: "353333,33", "353.333,33", "353333.33" o "$ 1.060.000". Devuelve
 * centavos o null si no es un monto. Un solo separador decimal con hasta dos dígitos.
 */
export const parsearMonto = (texto: string): number | null => {
  const limpio = texto.replace(/[\s$]/g, '');
  if (!/^[0-9.,]+$/.test(limpio)) return null;
  const coma = limpio.lastIndexOf(',');
  const punto = limpio.lastIndexOf('.');
  let entero = limpio;
  let decimales = '';
  const separador = Math.max(coma, punto);
  if (separador >= 0) {
    const resto = limpio.slice(separador + 1);
    const esDecimal = resto.length <= 2 && (separador === coma || limpio.indexOf('.') === punto);
    if (esDecimal) {
      entero = limpio.slice(0, separador);
      decimales = resto;
    } else if (separador === coma) {
      return null; // "1,234" no es un monto argentino
    }
  }
  entero = entero.replace(/[.,]/g, '');
  if (!/^\d+$/.test(entero) || !/^\d{0,2}$/.test(decimales)) return null;
  return Number(entero) * 100 + Number(decimales.padEnd(2, '0'));
};

// ---------- reparto (D-b3) ----------

export const MINIMO_PARTE_CENTAVOS = 10_000;
export const MAX_PARTES = 10;

/** Iguales truncando a centavos; el resto va a la parte 1 (la del organizador), como RepartoGrupo. */
export const repartoIgual = (totalCentavos: number, partes: number): number[] => {
  const base = Math.floor(totalCentavos / partes);
  const resto = totalCentavos - base * partes;
  return Array.from({ length: partes }, (_, i) => (i === 0 ? base + resto : base));
};

export const validarMontos = (
  centavos: (number | null)[],
  totalCentavos: number,
): { ok: boolean; diferencia: number; errores: (string | null)[] } => {
  const errores = centavos.map((c) => {
    if (c === null) return 'Ingresá un monto.';
    if (c < MINIMO_PARTE_CENTAVOS) return 'Cada parte tiene que ser de al menos $ 100.';
    return null;
  });
  const suma = centavos.reduce<number>((acc, c) => acc + (c ?? 0), 0);
  const diferencia = totalCentavos - suma;
  return { ok: errores.every((e) => e === null) && diferencia === 0, diferencia, errores };
};

export const maxPartes = (totalCentavos: number) =>
  Math.min(MAX_PARTES, Math.floor(totalCentavos / MINIMO_PARTE_CENTAVOS));

/** Listo para pagar, sin vencer y con total para al menos dos partes de $100. */
export const puedeDividir = (c: Carrito) =>
  c.estadoGeneral === 'PENDIENTE_PAGO' &&
  c.datosCompletos &&
  c.segundosRestantes > 0 &&
  maxPartes(aCentavos(c.montoTotal)) >= 2;

// ---------- textos ----------

export const nombreParte = (p: ParteGrupo) => {
  if (p.esMia) return 'Vos';
  if (p.estado === 'LIBRE') return `Parte ${p.numero}`;
  if (p.apodo) return p.apodo;
  return p.esOrganizador ? 'Organizador/a' : `Invitado/a ${p.numero}`;
};

export type TonoEstado = 'neutro' | 'aviso' | 'exito' | 'error';

export const estadoParteTexto = (
  p: Pick<ParteGrupo, 'estado'>,
): { texto: string; tono: TonoEstado } => {
  if (p.estado === 'PAGADA') return { texto: 'Pagada', tono: 'exito' };
  if (p.estado === 'TOMADA') return { texto: 'Falta pagar', tono: 'aviso' };
  return { texto: 'Libre', tono: 'neutro' };
};

const DETALLE_CIERRE: Record<string, string> = {
  GRUPO_CANCELADO:
    'Quien organizaba canceló el pago en grupo. Liberamos los lugares y devolvemos cada parte pagada por el mismo medio.',
  PAGO_EN_GRUPO_VENCIDO:
    'Pasaron las 24 horas sin que pagaran todos. Liberamos los lugares y devolvemos cada parte pagada por el mismo medio.',
  MONTO_NO_COINCIDE:
    'Las partes pagadas no coincidían con el total. Devolvemos cada parte pagada por el mismo medio.',
  SIN_DISPONIBILIDAD:
    'Algún lugar dejó de estar disponible antes de confirmar. Devolvemos cada parte pagada por el mismo medio.',
  PAGO_TARDIO_SIN_DISPONIBILIDAD:
    'Algún lugar dejó de estar disponible antes de confirmar. Devolvemos cada parte pagada por el mismo medio.',
  CONFIRMACION_FALLIDA:
    'No pudimos confirmar la reserva del grupo. Cancelamos todo y les devolvimos el dinero a quienes ya habían pagado.',
};

export const estadoGrupoTexto = (
  g: Grupo,
): { titulo: string; detalle: string; tono: TonoEstado } => {
  switch (g.estado) {
    case 'ABIERTO':
      return {
        titulo: 'Esperando que paguen todos',
        detalle: 'Los lugares quedan reservados hasta el plazo.',
        tono: 'aviso',
      };
    case 'COMPLETO':
      return {
        titulo: 'Confirmando la reserva',
        detalle: 'Ya pagaron todos. Esto puede tardar unos segundos.',
        tono: 'aviso',
      };
    case 'CONFIRMADO':
      return {
        titulo: '¡Reserva confirmada!',
        detalle: 'Los lugares ya quedaron a nombre del grupo.',
        tono: 'exito',
      };
    case 'VENCIDO':
      return {
        titulo: 'Se venció el plazo',
        detalle: DETALLE_CIERRE.PAGO_EN_GRUPO_VENCIDO,
        tono: 'error',
      };
    default:
      return {
        titulo:
          g.motivoCierre === 'GRUPO_CANCELADO' || g.motivoCierre === null
            ? 'El grupo se canceló'
            : 'No pudimos confirmar la reserva',
        detalle: DETALLE_CIERRE[g.motivoCierre ?? 'GRUPO_CANCELADO'],
        tono: 'error',
      };
  }
};

export const formatPlazo = (segundos: number) => {
  if (segundos <= 0) return 'vencido';
  if (segundos < 60) return 'menos de un minuto';
  const horas = Math.floor(segundos / 3600);
  const minutos = Math.floor((segundos % 3600) / 60);
  if (horas === 0) return `${minutos} min`;
  return minutos === 0 ? `${horas} h` : `${horas} h ${minutos} min`;
};

export type UrgenciaPlazo = 'normal' | 'aviso' | 'vencido';
export const urgenciaPlazo = (segundos: number): UrgenciaPlazo =>
  segundos <= 0 ? 'vencido' : segundos < 3600 ? 'aviso' : 'normal';

export const progresoGrupo = (g: Grupo) =>
  `${g.partesPagadas} de ${g.cantidadPartes} partes pagadas`;

/** Avisos para la región viva al pasar de una lectura a la siguiente (D-b19). */
export const cambiosGrupo = (previo: Grupo | null, actual: Grupo): string[] => {
  if (!previo) return [];
  if (previo.estado !== actual.estado) {
    if (actual.estado === 'CONFIRMADO') return ['¡Reserva confirmada!'];
    if (actual.estado === 'VENCIDO') return ['Se venció el plazo del pago en grupo.'];
    if (actual.estado === 'CANCELADO') return ['El pago en grupo se canceló.'];
    if (actual.estado === 'COMPLETO') return ['Ya pagaron todos. Confirmando la reserva...'];
  }
  const avisos: string[] = [];
  for (const p of actual.partes) {
    const antes = previo.partes.find((x) => x.numero === p.numero);
    if (!antes || antes.estado === p.estado) continue;
    const quien = nombreParte(p);
    if (p.estado === 'TOMADA' && antes.estado === 'LIBRE')
      avisos.push(`${quien} se sumó al grupo.`);
    else if (p.estado === 'PAGADA') avisos.push(`${quien} pagó su parte.`);
    else if (p.estado === 'LIBRE') avisos.push(`La parte ${p.numero} quedó libre.`);
  }
  return avisos;
};

/** Un grupo en curso donde el usuario tiene parte, para el aviso de /carrito (D-b19). */
export const resumenGrupoTexto = (
  g: GrupoResumen,
): {
  titulo: string;
  detalle: string;
  estado: { texto: string; tono: TonoEstado };
  accion: string;
} => {
  const enPlazo = g.estado === 'ABIERTO' && g.segundosRestantes > 0;
  const plazo =
    g.estado === 'COMPLETO'
      ? 'confirmando la reserva'
      : enPlazo
        ? `quedan ${formatPlazo(g.segundosRestantes)}`
        : 'plazo vencido';
  return {
    titulo: `${g.destino ? `Viaje a ${g.destino}` : `Reserva #${g.reservaId}`}${g.soyOrganizador ? ' · lo organizás vos' : ''}`,
    detalle: `Tu parte: ${formatMonto(g.monto)} · ${plazo}`,
    estado: estadoParteTexto({ estado: g.estadoParte }),
    accion: enPlazo && g.estadoParte === 'TOMADA' ? 'Pagar mi parte' : 'Ver el grupo',
  };
};

// ---------- enlace y consulta (D-b6, D-b19) ----------

const TOKEN = /^[A-Za-z0-9_-]{43}$/;
export const tokenValido = (token: string) => TOKEN.test(token);
export const enlaceInvitacion = (token: string, origen: string) =>
  `${origen.replace(/\/$/, '')}/grupo/${token}`;

/** Apodo opcional para que el grupo sepa quién es quién (D-b7): hasta 30 letras, números, espacios y . ' - */
const APODO = /^[\p{L}\p{N} .'-]{0,30}$/u;
export const apodoValido = (texto: string) => APODO.test(texto.trim());

export const ESPERA_CONSULTA_GRUPO_MS = 15_000;
export const debeConsultarGrupo = (estado: EstadoGrupo, visible: boolean) =>
  visible && (estado === 'ABIERTO' || estado === 'COMPLETO');

// ---------- errores ----------

const MENSAJES: Record<string, string> = {
  GRUPO_NO_ENCONTRADO:
    'Este enlace no es válido. Pedile a quien organiza que te lo vuelva a mandar.',
  ENLACE_VENCIDO: 'Este enlace ya no está activo: el pago en grupo terminó o venció.',
  GRUPO_COMPLETO: 'El grupo ya está completo: no quedan partes libres.',
  PAGO_EN_GRUPO_EN_CURSO:
    'Tenés un pago en grupo en curso. Cancelalo o esperá a que termine para armar otro carrito.',
  GRUPO_YA_EXISTE: 'Este carrito ya se está pagando en grupo.',
  GRUPO_CON_PAGOS: 'Ya hay partes pagadas: los montos no se pueden cambiar.',
  GRUPO_CON_INVITADOS: 'Ya se sumó gente al grupo: la cantidad de partes no se puede cambiar.',
  GRUPO_CERRADO: 'El pago en grupo ya terminó.',
  GRUPO_VENCIDO: 'El plazo del pago en grupo venció.',
  GRUPO_CONFIRMANDO: 'Ya pagaron todos: se está confirmando la reserva y no se puede cancelar.',
  USAR_CANCELACION_POR_ITEM: 'La reserva ya está confirmada. Se cancela desde Mis reservas.',
  PARTE_PAGADA: 'Esa parte ya está pagada.',
  ORGANIZADOR_NO_SE_QUITA: 'La parte de quien organiza no se puede liberar.',
  PARTES_DEMASIADO_CHICAS: 'Con ese reparto alguna parte queda por debajo de $ 100.',
  MONTOS_NO_SUMAN_TOTAL: 'Los montos tienen que sumar exactamente el total.',
  CARRITO_CAMBIO:
    'El carrito cambió mientras preparábamos el pago en grupo. Revisalo y probá de nuevo.',
  SIN_DISPONIBILIDAD_HOTEL: 'Una de las habitaciones ya no está disponible. Revisá el carrito.',
};

/** Los errores del grupo: respeta el mensaje del servidor y traduce los códigos que llegan sin él. */
export const leerErrorGrupo = (err: unknown, porDefecto: string): ErrorApi => {
  const e = leerErrorApi(err, porDefecto);
  if (
    e.codigo &&
    MENSAJES[e.codigo] &&
    (e.mensaje === porDefecto || e.status === 410 || e.status === 404)
  ) {
    return { ...e, mensaje: MENSAJES[e.codigo] };
  }
  return e;
};
