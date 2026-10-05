/**
 * Tarjeta de la pasarela de prueba. Los datos viven solo en el estado del formulario: no se
 * envían al servidor, no se guardan y no se registran en la consola.
 */
export interface TarjetaPrueba {
  numero: string;
  titular: string;
  vencimiento: string;
  cvv: string;
}

export type ErroresTarjeta = Partial<Record<keyof TarjetaPrueba, string>>;

const sinEspacios = (v: string) => v.replace(/\s/g, '');

/** Hasta 16 dígitos, mostrados de a cuatro. */
export const formatearNumero = (valor: string) =>
  valor
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, '$1 ');

/** Arma MM/AA mientras se escribe. */
export const formatearVencimiento = (valor: string) => {
  const d = valor.replace(/\D/g, '').slice(0, 4);
  return d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

export const validarTarjeta = (t: TarjetaPrueba, hoy: Date = new Date()): ErroresTarjeta => {
  const errores: ErroresTarjeta = {};
  if (!/^\d{16}$/.test(sinEspacios(t.numero))) {
    errores.numero = 'El número de tarjeta debe tener 16 dígitos.';
  }
  if (!t.titular.trim()) errores.titular = 'Ingresá el nombre del titular.';
  const v = /^(\d{2})\/(\d{2})$/.exec(t.vencimiento);
  const mes = v ? Number(v[1]) : 0;
  if (!v || mes < 1 || mes > 12) {
    errores.vencimiento = 'Ingresá un vencimiento válido (MM/AA).';
  } else {
    // La tarjeta sirve hasta el último día del mes de vencimiento.
    const anio = 2000 + Number(v[2]);
    const vencida =
      anio < hoy.getFullYear() || (anio === hoy.getFullYear() && mes < hoy.getMonth() + 1);
    if (vencida) errores.vencimiento = 'La tarjeta está vencida.';
  }
  if (!/^\d{3,4}$/.test(t.cvv)) errores.cvv = 'El código de seguridad debe tener 3 o 4 dígitos.';
  return errores;
};

/** Regla de la pasarela de prueba: terminada en 0000 o empezada en 9999, se rechaza. */
export const tarjetaRechazada = (numero: string) => {
  const n = sinEspacios(numero);
  return n.endsWith('0000') || n.startsWith('9999');
};
