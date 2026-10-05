import { describe, expect, it } from 'vitest';
import type { Pago } from './payments.types';
import {
  debeConciliar,
  ESPERA_MAXIMA_MS,
  limpiarAlConfirmar,
  mensajePasarela,
  leerRetornoPago,
  resultadoPago,
  seguirConsultando,
  ultimoPago,
} from './pagos';

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

describe('seguirConsultando', () => {
  it('consulta mientras siga pendiente y no pase el máximo', () => {
    expect(seguirConsultando(true, 0, 1000)).toBe(true);
    expect(seguirConsultando(true, 1000, 1000 + ESPERA_MAXIMA_MS - 1)).toBe(true);
  });
  it('se detiene con un estado final o al pasar el máximo', () => {
    expect(seguirConsultando(false, 0, 1000)).toBe(false);
    expect(seguirConsultando(true, 1000, 1000 + ESPERA_MAXIMA_MS)).toBe(false);
  });
});

describe('debeConciliar', () => {
  it('concilia mientras esté pendiente y el payment_id sea válido', () => {
    expect(debeConciliar('PENDING', '123')).toBe(true);
    expect(debeConciliar('AUTHORIZED', '123')).toBe(true);
  });
  it('no concilia sin payment_id o con un estado final', () => {
    expect(debeConciliar('PENDING', null)).toBe(false);
    expect(debeConciliar('APPROVED', '123')).toBe(false);
    expect(debeConciliar('REJECTED', '123')).toBe(false);
    expect(debeConciliar(null, '123')).toBe(true);
  });
});

describe('limpiarAlConfirmar', () => {
  const ahora = Date.parse('2026-10-05T12:00:00');
  it('limpia si se vio pasar de pendiente a aprobado en esta visita', () => {
    expect(limpiarAlConfirmar(true, '2026-10-01T10:00:00', ahora)).toBe(true);
  });
  it('limpia si el pago es reciente (menos de 30 minutos)', () => {
    expect(limpiarAlConfirmar(false, '2026-10-05T11:45:00', ahora)).toBe(true);
  });
  it('no limpia al recargar un pago viejo: puede haber una compra nueva', () => {
    expect(limpiarAlConfirmar(false, '2026-10-05T11:15:00', ahora)).toBe(false);
    expect(limpiarAlConfirmar(false, 'basura', ahora)).toBe(false);
  });
});

describe('mensajePasarela', () => {
  it('404 de la simulación: pasarela no disponible', () => {
    expect(mensajePasarela('simulacion', 404, 'x')).toBe(
      'La pasarela de prueba no está disponible en este entorno.',
    );
  });
  it('403 y 404 al cargar el pago: no existe o no es tuyo', () => {
    expect(mensajePasarela('carga', 403, 'Forbidden')).toBe('Este pago no existe o no es tuyo.');
    expect(mensajePasarela('carga', 404, 'Not Found')).toBe('Este pago no existe o no es tuyo.');
  });
  it('otros errores conservan el mensaje', () => {
    expect(mensajePasarela('carga', 500, 'Algo falló')).toBe('Algo falló');
  });
});

describe('ultimoPago con fechas', () => {
  it('compara como fecha y desempata por id', () => {
    const a = pago({ id: 'a', createdAt: '2026-10-05T10:00:00.5' });
    const b = pago({ id: 'b', createdAt: '2026-10-05T10:00:00.50' });
    expect(ultimoPago([a, b])?.id).toBe('b');
    expect(ultimoPago([b, a])?.id).toBe('b');
    const dos = pago({ id: 'dos', createdAt: '2026-10-05T10:00:00+02:00' });
    const utc = pago({ id: 'utc', createdAt: '2026-10-05T09:00:00Z' });
    expect(ultimoPago([dos, utc])?.id).toBe('utc');
  });
});
