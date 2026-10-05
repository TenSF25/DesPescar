import { esRutaPropiaDePago, isTrustedPaymentUrl } from './isTrustedPaymentUrl';

export type DestinoPago =
  { tipo: 'interno'; ruta: string } | { tipo: 'externo'; url: string } | { tipo: 'invalido' };

/**
 * A donde llevar al usuario con el checkoutUrl de payment-service: el mock es una ruta del
 * front (se navega con el router) y Mercado Pago es una pagina externa (window.location).
 */
export const destinoPago = (checkoutUrl: string | null | undefined): DestinoPago => {
  if (!checkoutUrl || !isTrustedPaymentUrl(checkoutUrl)) return { tipo: 'invalido' };
  if (esRutaPropiaDePago(checkoutUrl)) return { tipo: 'interno', ruta: checkoutUrl };
  return { tipo: 'externo', url: checkoutUrl };
};
