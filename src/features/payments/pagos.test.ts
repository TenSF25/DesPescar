import { describe, expect, it } from 'vitest';
import type { Pago } from './payments.types';
import { leerRetornoPago, resultadoPago, ultimoPago } from './pagos';

const pago = (cambios: Partial<Pago> = {}): Pago => ({
  id: 'p1',
  reservationId: 12,
  userId: 7,
  amount: 1060000,
  status: 'PENDING',
  paymentMethod: null,
  transactionId: null,
  preferenceId: 'MOCK-PREF-1',
  checkoutUrl: '/pago/simulado?pago=p1',
  paymentDate: null,
  currency: 'ARS',
  createdAt: '2026-10-05T10:00:00',
  ...cambios,
});

describe('leerRetornoPago', () => {
  it('mock: ?reserva=<id>', () => {
    expect(leerRetornoPago(new URLSearchParams('reserva=12'))).toEqual({
      tipo: 'mock',
      reservaId: 12,
    });
  });

  it('Mercado Pago: external_reference es el id del pago y payment_id el de MP', () => {
    expect(
      leerRetornoPago(
        new URLSearchParams(
          'payment_id=123456&status=approved&external_reference=p1&collection_status=approved',
        ),
      ),
    ).toEqual({ tipo: 'mercadopago', pagoId: 'p1', mpPaymentId: '123456', estadoMp: 'approved' });
  });

  it('Mercado Pago sin pago (el usuario volvió sin pagar): payment_id "null"', () => {
    expect(
      leerRetornoPago(new URLSearchParams('payment_id=null&status=null&external_reference=p1')),
    ).toEqual({ tipo: 'mercadopago', pagoId: 'p1', mpPaymentId: null, estadoMp: null });
  });

  it('un payment_id que no son dígitos no se concilia', () => {
    expect(
      leerRetornoPago(new URLSearchParams('payment_id=abc&external_reference=p1')),
    ).toMatchObject({ mpPaymentId: null });
  });

  it('sin datos útiles devuelve null', () => {
    expect(leerRetornoPago(new URLSearchParams(''))).toBeNull();
    expect(leerRetornoPago(new URLSearchParams('reserva=abc'))).toBeNull();
    expect(leerRetornoPago(new URLSearchParams('reserva=-1'))).toBeNull();
  });
});

describe('ultimoPago', () => {
  it('elige el más reciente', () => {
    const viejo = pago({ id: 'a', createdAt: '2026-10-05T10:00:00' });
    const nuevo = pago({ id: 'b', createdAt: '2026-10-05T10:05:00' });
    expect(ultimoPago([nuevo, viejo])?.id).toBe('b');
    expect(ultimoPago([])).toBeNull();
  });
});

describe('resultadoPago', () => {
  it('aprobado y reserva confirmada: éxito', () => {
    const r = resultadoPago(pago({ status: 'APPROVED' }), 'CONFIRMADA');
    expect(r.tono).toBe('exito');
    expect(r.seguirConsultando).toBe(false);
  });

  it('aprobado pero la reserva todavía no se confirmó: pendiente y se sigue consultando', () => {
    const r = resultadoPago(pago({ status: 'APPROVED' }), 'PENDIENTE_PAGO');
    expect(r.tono).toBe('pendiente');
    expect(r.seguirConsultando).toBe(true);
  });

  it('reembolsado: error, sin reintento', () => {
    const r = resultadoPago(pago({ status: 'REFUNDED' }), 'CANCELADA');
    expect(r.tono).toBe('error');
    expect(r.titulo).toBe('No pudimos confirmar tu reserva');
    expect(r.reintentar).toBe(false);
  });

  it('rechazado con el carrito vigente: se puede reintentar', () => {
    const r = resultadoPago(pago({ status: 'REJECTED' }), 'PENDIENTE_PAGO');
    expect(r.tono).toBe('error');
    expect(r.reintentar).toBe(true);
    expect(resultadoPago(pago({ status: 'REJECTED' }), 'EXPIRADA').reintentar).toBe(false);
  });

  it('pendiente: se sigue consultando', () => {
    expect(resultadoPago(pago(), 'PENDIENTE_PAGO')).toMatchObject({
      tono: 'pendiente',
      seguirConsultando: true,
      reintentar: true,
    });
  });

  it('cancelado: error', () => {
    expect(resultadoPago(pago({ status: 'CANCELLED' }), 'PENDIENTE_PAGO').tono).toBe('error');
  });
});
