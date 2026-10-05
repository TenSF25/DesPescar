import axios from 'axios';
import type {
  Carrito,
  ErrorApi,
  EstadiaCarrito,
  PasajeroInput,
  PasajeroRequest,
  TitularInput,
  TitularRequest,
  VueloCarrito,
} from './cart.types';

export const MAX_HABITACIONES = 10;
const AVISO_SEGUNDOS = 180;

// ---------- cuenta regresiva ----------

/** "13:32". Nunca negativo. */
export const formatCuentaRegresiva = (segundos: number) => {
  const s = Math.max(0, Math.floor(segundos));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
};

/** Segundos enteros que faltan para venceEn (ms), redondeando hacia arriba. */
export const segundosHasta = (venceEn: number, ahora: number) =>
  Math.max(0, Math.ceil((venceEn - ahora) / 1000));

export type Urgencia = 'normal' | 'aviso' | 'vencido';

export const urgencia = (segundos: number): Urgencia =>
  segundos <= 0 ? 'vencido' : segundos <= AVISO_SEGUNDOS ? 'aviso' : 'normal';

// ---------- estado del carrito ----------

const vigente = (c: Carrito) =>
  (c.estadoGeneral === 'INICIADA' || c.estadoGeneral === 'PENDIENTE_PAGO') &&
  c.segundosRestantes > 0;

/** Lo que muestra el ícono del Nav. */
export const cantidadEnCarrito = (c: Carrito | null) => (c && vigente(c) ? c.cantidadItems : 0);

export const estadiasActivas = (c: Carrito): EstadiaCarrito[] =>
  c.estadias.filter((e) => e.estado === 'ACTIVA');

/** Pasos que faltan para poder pagar, en el orden en que aparecen en la página. */
export const faltantes = (c: Carrito): string[] => {
  const lista: string[] = [];
  if (c.vuelo && !c.vuelo.pasajerosCargados) lista.push('Datos de los pasajeros');
  if (estadiasActivas(c).some((e) => !e.titularNombre)) lista.push('Titular de cada estadía');
  return lista;
};

export const puedePagar = (c: Carrito) =>
  c.estadoGeneral === 'PENDIENTE_PAGO' &&
  c.datosCompletos &&
  c.segundosRestantes > 0 &&
  c.montoTotal > 0;

// ---------- pasajeros ----------

/** D25: sin pasajeros cargados se muestra "Pasajero N" (nunca el UUID del asiento). */
export const pasajerosVisibles = (c: Carrito): { nombre: string; asiento: string | null }[] => {
  if (!c.vuelo) return [];
  if (c.vuelo.pasajerosCargados) {
    return c.asientos.map((a, i) => ({
      nombre: a.nombrePasajero ?? `Pasajero ${i + 1}`,
      asiento: a.asientoIda,
    }));
  }
  return Array.from({ length: c.vuelo.cantidadPasajeros }, (_, i) => ({
    nombre: `Pasajero ${i + 1}`,
    asiento: null,
  }));
};

/** Valores iniciales del formulario: los pasajeros ya cargados (PUT repetido reemplaza) o vacíos. */
export const pasajerosIniciales = (c: Carrito): PasajeroInput[] => {
  const cantidad = c.vuelo?.cantidadPasajeros ?? 0;
  return Array.from({ length: cantidad }, (_, i) => {
    const a = c.vuelo?.pasajerosCargados ? c.asientos[i] : undefined;
    return { nombreCompleto: a?.nombrePasajero ?? '', dniPasaporte: a?.dniPasaporte ?? '' };
  });
};

const DOCUMENTO = /^[A-Za-z0-9.\- ]{6,20}$/;

export const validarPasajero = (p: PasajeroInput): Partial<Record<keyof PasajeroInput, string>> => {
  const errores: Partial<Record<keyof PasajeroInput, string>> = {};
  const nombre = p.nombreCompleto.trim();
  if (nombre.length < 2 || nombre.length > 100)
    errores.nombreCompleto = 'Ingresá el nombre completo.';
  if (!DOCUMENTO.test(p.dniPasaporte.trim()))
    errores.dniPasaporte = 'Ingresá un DNI o pasaporte válido.';
  return errores;
};

/**
 * Asientos guardados en useFlightStore frente al vuelo del carrito: 'otroVuelo' si se eligieron
 * para otro vuelo (o no hay), 'faltan' si no alcanzan para todos los pasajeros.
 */
export const estadoAsientos = (
  v: VueloCarrito,
  vueloElegido: string | null,
  asientos: string[],
): 'ok' | 'faltan' | 'otroVuelo' => {
  if (!vueloElegido || vueloElegido !== v.flightIds[0]) return 'otroVuelo';
  return asientos.length === v.cantidadPasajeros ? 'ok' : 'faltan';
};

/** Cuerpo de PUT /{id}/passengers. El precio lo calcula el servidor (D1). */
export const armarPasajeros = (
  form: PasajeroInput[],
  asientos: string[],
  v: VueloCarrito,
): PasajeroRequest[] | null => {
  if (form.length !== v.cantidadPasajeros || asientos.length !== form.length) return null;
  return form.map((p, i) => ({
    nombreCompleto: p.nombreCompleto.trim(),
    dniPasaporte: p.dniPasaporte.trim(),
    asientoIda: asientos[i],
    asientoVuelta: null,
    tarifaId: v.fareIds[0],
    tarifaNombre: v.tarifas,
  }));
};

// ---------- titulares ----------

export const validarTitular = (t: TitularInput): Partial<Record<keyof TitularInput, string>> => {
  const errores: Partial<Record<keyof TitularInput, string>> = {};
  const nombre = t.nombre.trim();
  if (nombre.length < 2 || nombre.length > 100) errores.nombre = 'Ingresá el nombre del titular.';
  if (!DOCUMENTO.test(t.dni.trim())) errores.dni = 'Ingresá un DNI o pasaporte válido.';
  const tel = t.telefono.trim();
  if (!/^[+0-9 ()-]{6,30}$/.test(tel) || tel.replace(/\D/g, '').length < 6) {
    errores.telefono = 'Ingresá un teléfono con código de área.';
  }
  return errores;
};

/** Cuerpo de PUT /{id}/titulares: uno por cada estadía activa. */
export const armarTitulares = (
  c: Carrito,
  form: Record<number, TitularInput | undefined>,
): TitularRequest[] =>
  estadiasActivas(c).map((e) => {
    const t = form[e.id] ?? { nombre: '', dni: '', telefono: '' };
    return {
      estadiaId: e.id,
      nombre: t.nombre.trim(),
      dni: t.dni.trim(),
      telefono: t.telefono.trim(),
    };
  });

// ---------- habitaciones ----------

/** Cantidades de habitaciones que se pueden pedir: de las necesarias a las libres (tope 10). */
export const opcionesCantidad = (necesarias: number | null, libres: number | null): number[] => {
  const desde = Math.max(1, necesarias ?? 1);
  const hasta = Math.min(MAX_HABITACIONES, libres ?? desde);
  return hasta < desde ? [] : Array.from({ length: hasta - desde + 1 }, (_, i) => desde + i);
};

export const capacidadSuficiente = (huespedes: number, capacidad: number, cantidad: number) =>
  huespedes <= capacidad * cantidad;

// ---------- errores ----------

interface CuerpoError {
  codigo?: unknown;
  mensaje?: unknown;
  message?: unknown;
  error?: unknown;
}

const texto = (v: unknown) => (typeof v === 'string' && v.trim() ? v : null);

/**
 * Normaliza los errores de los tres formatos (D24): reservation {codigo, mensaje}, payment
 * {error, message} y hotel {error}. Sin cuerpo, usa un mensaje por estado.
 */
export const leerErrorApi = (err: unknown, porDefecto: string): ErrorApi => {
  if (!axios.isAxiosError(err)) return { status: null, codigo: null, mensaje: porDefecto };
  if (!err.response) {
    return {
      status: null,
      codigo: null,
      mensaje: 'No pudimos conectarnos. Revisá tu conexión y probá de nuevo.',
    };
  }
  const { status, data } = err.response;
  const cuerpo: CuerpoError = typeof data === 'object' && data !== null ? data : {};
  const mensaje = texto(cuerpo.mensaje) ?? texto(cuerpo.message) ?? texto(cuerpo.error);
  // 410: el carrito venció. Cualquier llamada del carrito puede responderlo.
  if (status === 410) {
    return {
      status,
      codigo: texto(cuerpo.codigo) ?? 'CARRITO_EXPIRADO',
      mensaje: texto(cuerpo.mensaje) ?? 'Tu carrito venció. Armalo de nuevo para seguir.',
    };
  }
  if (status >= 502 && status <= 504 && !texto(cuerpo.mensaje)) {
    return {
      status,
      codigo: texto(cuerpo.codigo),
      mensaje: 'El servicio no está respondiendo. Probá de nuevo en unos minutos.',
    };
  }
  return { status, codigo: texto(cuerpo.codigo), mensaje: mensaje ?? porDefecto };
};
