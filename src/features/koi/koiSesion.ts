import type { ChatMessage, KoiConversationResponse, KoiMensajeHistorial } from './koi.types';

export const CLAVE_SESION = 'despescar-koi-sesion';
export const CLAVE_ABIERTO = 'despescar-koi-abierto';

/** Lo que se usa de sessionStorage; los tests pasan un almacén falso. */
export type Almacen = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

const almacenDelNavegador = (): Almacen | null => {
  try {
    return typeof sessionStorage === 'undefined' ? null : sessionStorage;
  } catch {
    return null;
  }
};

const intentar = <T>(accion: () => T, siFalla: T): T => {
  try {
    return accion();
  } catch {
    return siFalla;
  }
};

/** El sessionId vive en sessionStorage: la charla sigue tras /login o al recargar la pestaña. */
export const leerSessionId = (almacen: Almacen | null = almacenDelNavegador()): string | null =>
  almacen ? intentar(() => almacen.getItem(CLAVE_SESION), null) : null;

export const guardarSessionId = (id: string, almacen: Almacen | null = almacenDelNavegador()) => {
  if (almacen) intentar(() => almacen.setItem(CLAVE_SESION, id), undefined);
};

export const olvidarSessionId = (almacen: Almacen | null = almacenDelNavegador()) => {
  if (almacen) intentar(() => almacen.removeItem(CLAVE_SESION), undefined);
};

/** Antes de mandar al usuario a /login desde el chat: al volver, la ventana se abre sola. */
export const marcarChatAbierto = (almacen: Almacen | null = almacenDelNavegador()) => {
  if (almacen) intentar(() => almacen.setItem(CLAVE_ABIERTO, '1'), undefined);
};

/** true una sola vez después de marcarChatAbierto. */
export const debeReabrirChat = (almacen: Almacen | null = almacenDelNavegador()): boolean => {
  if (!almacen) return false;
  const marcado = intentar(() => almacen.getItem(CLAVE_ABIERTO), null) === '1';
  if (marcado) intentar(() => almacen.removeItem(CLAVE_ABIERTO), undefined);
  return marcado;
};

export const mensajesDesdeHistorial = (historial: KoiMensajeHistorial[]): ChatMessage[] =>
  historial.map((m) => ({
    role: m.rol === 'USER' ? 'user' : 'bot',
    text: m.texto,
    opciones: m.opciones ?? [],
  }));

export const mensajeDeRespuesta = (respuesta: KoiConversationResponse): ChatMessage => ({
  role: 'bot',
  text: respuesta.reply,
  opciones: respuesta.recommendations ?? [],
});

/** Texto de KOI cuando el pedido falla (429 del límite del gateway, 504 del timeout de 30 s). */
export const mensajeDeErrorKoi = (status: number | undefined): string => {
  if (status === 429) {
    return 'Me estás escribiendo muy rápido 🐟 Esperá un minuto y seguimos.';
  }
  if (status === 504 || status === 503) {
    return 'Uy, tardé demasiado en buscar. ¿Me lo mandás de nuevo en un ratito?';
  }
  return 'Disculpá, tuve un error al procesar tu mensaje. ¿Podrías repetirlo?';
};

/**
 * Milisegundos que KOI se toma "pensando" antes de mostrar una respuesta: entre 1,4 s y 2,6 s,
 * un poco más para mensajes largos. `azar` (0..1) se inyecta para poder probarlo.
 */
export const pausaParaPensar = (largoMensaje: number, azar: number = Math.random()): number => {
  const base = 1400 + Math.min(Math.max(largoMensaje, 0), 120) * 5;
  return Math.round(base + azar * 600);
};
