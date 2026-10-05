import { describe, expect, it } from 'vitest';
import { isTrustedPaymentUrl } from './isTrustedPaymentUrl';

describe('isTrustedPaymentUrl', () => {
  it.each([
    'https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=1',
    'https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=1',
  ])('acepta %s', (url) => expect(isTrustedPaymentUrl(url)).toBe(true));

  it.each([
    'http://www.mercadopago.com.ar/checkout',
    'https://mercadopago.com.ar.evil.com/checkout',
    'https://www.mercadopago.com.ar@evil.com/',
    'javascript:alert(1)//mercadopago.com',
    '',
  ])('rechaza %s', (url) => expect(isTrustedPaymentUrl(url)).toBe(false));
});
