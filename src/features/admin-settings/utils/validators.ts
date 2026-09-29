/**
 * Validaciones de los formularios de Ajustes.
 *
 * Son funciones puras (entra un string, sale un mensaje de error o null),
 * así se pueden probar sueltas y el hook solo las llama.
 * Devuelven `null` cuando el valor es válido.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Largo mínimo que pedimos para una contraseña nueva. */
export const MIN_PASSWORD_LENGTH = 8;

export const validateRequired = (value: string, campo: string): string | null =>
  value.trim() === '' ? `${campo} es obligatorio.` : null;

export const validateEmail = (value: string): string | null => {
  if (value.trim() === '') return 'El email es obligatorio.';
  return EMAIL_REGEX.test(value.trim()) ? null : 'Escribí un email válido.';
};

/**
 * Valida un CUIT completo: formato y dígito verificador.
 *
 * Acepta con o sin guiones (30-12345678-9 o 30123456789). Se valida el
 * dígito verificador de verdad, no solo que tenga 11 números: así no se
 * guardan CUITs inventados.
 *
 * Para datos de empresa corresponde CUIT, no CUIL: cualquier proveedor que
 * factura tiene CUIT, sea una S.A. o un monotributista.
 */
export const validateCuit = (value: string): string | null => {
  const limpio = value.replace(/[\s-]/g, '');

  if (limpio === '') return 'El CUIT es obligatorio.';
  if (!/^\d{11}$/.test(limpio)) return 'El CUIT tiene que tener 11 números.';

  const MULTIPLICADORES = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  const digitos = limpio.split('').map(Number);

  const suma = MULTIPLICADORES.reduce(
    (acumulado, multiplicador, indice) => acumulado + digitos[indice] * multiplicador,
    0,
  );

  const resto = suma % 11;
  const verificadorEsperado = resto === 0 ? 0 : resto === 1 ? 9 : 11 - resto;

  return digitos[10] === verificadorEsperado ? null : 'El CUIT no es válido.';
};

/** Da formato XX-XXXXXXXX-X mientras se escribe, para que se lea mejor. */
export const formatCuit = (value: string): string => {
  const limpio = value.replace(/\D/g, '').slice(0, 11);

  if (limpio.length <= 2) return limpio;
  if (limpio.length <= 10) return `${limpio.slice(0, 2)}-${limpio.slice(2)}`;
  return `${limpio.slice(0, 2)}-${limpio.slice(2, 10)}-${limpio.slice(10)}`;
};

export const validateNewPassword = (value: string): string | null => {
  if (value === '') return 'Ingresá una contraseña nueva.';
  if (value.length < MIN_PASSWORD_LENGTH)
    return `La contraseña tiene que tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`;
  return null;
};

export const validatePasswordMatch = (nueva: string, repetir: string): string | null => {
  if (repetir === '') return 'Repetí la contraseña nueva.';
  return nueva === repetir ? null : 'Las contraseñas no coinciden.';
};
