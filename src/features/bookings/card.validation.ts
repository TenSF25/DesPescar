import type { CardBrand, CardData } from './card.types';
import type { FieldErrors } from './checkout.types';

const soloDigitos = (valor: string) => valor.replace(/\D/g, '');

/** Marca según los primeros dígitos (BIN) del número. */
export const detectBrand = (numero: string): CardBrand => {
  const n = soloDigitos(numero);
  if (/^4/.test(n)) return 'visa';
  if (/^(5[1-5]|2(2[2-9][1-9]|2[3-9]\d|[3-6]\d{2}|7[01]\d|720))/.test(n)) return 'mastercard';
  if (/^3[47]/.test(n)) return 'amex';
  return 'otra';
};

/** Largo del código de seguridad: 4 en American Express y 3 en el resto. */
export const cvvLength = (brand: CardBrand) => (brand === 'amex' ? 4 : 3);

/** Agrupa el número para mostrarlo: 4-6-5 en Amex y de a 4 en las demás. */
export const formatCardNumber = (valor: string) => {
  const n = soloDigitos(valor);
  const brand = detectBrand(n);
  if (brand === 'amex') {
    return [n.slice(0, 4), n.slice(4, 10), n.slice(10, 15)].filter(Boolean).join(' ');
  }
  return (
    n
      .slice(0, 19)
      .match(/.{1,4}/g)
      ?.join(' ') ?? ''
  );
};

/** "1226" -> "12/26" a medida que se escribe. */
export const formatExpiry = (valor: string) => {
  const n = soloDigitos(valor).slice(0, 4);
  return n.length > 2 ? `${n.slice(0, 2)}/${n.slice(2)}` : n;
};

/** Algoritmo de Luhn: detecta números de tarjeta mal tipeados. */
const luhn = (numero: string) => {
  let suma = 0;
  let doble = false;
  for (let i = numero.length - 1; i >= 0; i--) {
    let digito = Number(numero[i]);
    if (doble) {
      digito *= 2;
      if (digito > 9) digito -= 9;
    }
    suma += digito;
    doble = !doble;
  }
  return suma % 10 === 0;
};

const vencida = (vencimiento: string) => {
  const [mes, anio] = vencimiento.split('/').map(Number);
  // La tarjeta vale hasta el último día del mes de vencimiento.
  return new Date(2000 + anio, mes, 1) <= new Date();
};

/** Errores del formulario de tarjeta. `credito` habilita la validación de cuotas. Vacío = datos válidos. */
export const validateCard = (card: CardData, credito: boolean): FieldErrors => {
  const errores: FieldErrors = {};
  const numero = soloDigitos(card.numero);
  const brand = detectBrand(numero);

  if (!numero) errores.numero = 'Ingresá el número de la tarjeta';
  else if (numero.length < 13 || numero.length > 19 || !luhn(numero)) {
    errores.numero = 'El número de la tarjeta no es válido';
  }

  if (!card.titular.trim()) errores.titular = 'Ingresá el nombre como figura en la tarjeta';
  else if (!/^[\p{L}][\p{L}\s'.-]*$/u.test(card.titular.trim())) {
    errores.titular = 'El nombre solo puede tener letras';
  }

  if (!card.vencimiento) errores.vencimiento = 'Ingresá el vencimiento';
  else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.vencimiento)) {
    errores.vencimiento = 'Usá el formato MM/AA';
  } else if (vencida(card.vencimiento)) errores.vencimiento = 'La tarjeta está vencida';

  if (!card.cvv) errores.cvv = 'Ingresá el código de seguridad';
  else if (soloDigitos(card.cvv).length !== cvvLength(brand)) {
    errores.cvv = `Son ${cvvLength(brand)} números${brand === 'amex' ? ' (en el frente)' : ' (al dorso)'}`;
  }

  const documento = card.documento.replace(/[\s.-]/g, '');
  if (!documento) errores.documento = 'Ingresá el documento del titular';
  else if (card.tipoDocumento === 'DNI' && !/^\d{7,8}$/.test(documento)) {
    errores.documento = 'El DNI tiene 7 u 8 números';
  } else if (card.tipoDocumento === 'CUIT' && !/^\d{11}$/.test(documento)) {
    errores.documento = 'El CUIT tiene 11 números';
  } else if (card.tipoDocumento === 'Pasaporte' && !/^[A-Za-z0-9]{6,9}$/.test(documento)) {
    errores.documento = 'El pasaporte tiene entre 6 y 9 letras o números';
  }

  if (!card.banco) errores.banco = 'Elegí el banco emisor';
  if (credito && !card.cuotas) errores.cuotas = 'Elegí la cantidad de cuotas';

  return errores;
};
