// mercadopago.com, mercadopago.com.ar, sandbox.mercadopago.com.ar, www.mercadopago.com.br, etc.
const MERCADO_PAGO_HOST = /(^|\.)mercadopago\.com(\.[a-z]{2})?$/;

/** Indica si la URL de checkout que devuelve el backend es de Mercado Pago y va por https. */
export const isTrustedPaymentUrl = (url: string) => {
  try {
    const { protocol, hostname } = new URL(url);
    return protocol === 'https:' && MERCADO_PAGO_HOST.test(hostname);
  } catch {
    return false;
  }
};
