import { describe, expect, it } from 'vitest';
import {
  formatearNumero,
  formatearVencimiento,
  tarjetaRechazada,
  validarTarjeta,
  type TarjetaPrueba,
} from './tarjetaPrueba';

const HOY = new Date(2026, 9, 5); // 5 de octubre de 2026
const valida: TarjetaPrueba = {
  numero: '4500123456789010',
  titular: 'ANA PEREZ',
  vencimiento: '12/27',
  cvv: '123',
};

describe('validarTarjeta', () => {
  it('acepta una tarjeta completa y vigente', () => {
    expect(validarTarjeta(valida, HOY)).toEqual({});
  });

  it('pide los 16 dígitos del número', () => {
    expect(validarTarjeta({ ...valida, numero: '4500' }, HOY).numero).toBe(
      'El número de tarjeta debe tener 16 dígitos.',
    );
    expect(validarTarjeta({ ...valida, numero: '' }, HOY).numero).toBeDefined();
    expect(validarTarjeta({ ...valida, numero: '45001234567890ab' }, HOY).numero).toBeDefined();
  });

  it('pide el titular', () => {
    expect(validarTarjeta({ ...valida, titular: '   ' }, HOY).titular).toBe(
      'Ingresá el nombre del titular.',
    );
  });

  it('pide un vencimiento MM/AA con un mes real', () => {
    for (const vencimiento of ['', '1/27', '13/27', '00/27', '1227']) {
      expect(validarTarjeta({ ...valida, vencimiento }, HOY).vencimiento).toBe(
        'Ingresá un vencimiento válido (MM/AA).',
      );
    }
  });

  it('rechaza una tarjeta vencida y acepta la que vence este mes', () => {
    expect(validarTarjeta({ ...valida, vencimiento: '09/26' }, HOY).vencimiento).toBe(
      'La tarjeta está vencida.',
    );
    expect(validarTarjeta({ ...valida, vencimiento: '12/25' }, HOY).vencimiento).toBe(
      'La tarjeta está vencida.',
    );
    expect(validarTarjeta({ ...valida, vencimiento: '10/26' }, HOY).vencimiento).toBeUndefined();
  });

  it('pide un CVV de 3 o 4 dígitos', () => {
    for (const cvv of ['', '12', '12345', '12a']) {
      expect(validarTarjeta({ ...valida, cvv }, HOY).cvv).toBe(
        'El código de seguridad debe tener 3 o 4 dígitos.',
      );
    }
    expect(validarTarjeta({ ...valida, cvv: '1234' }, HOY).cvv).toBeUndefined();
  });
});

describe('tarjetaRechazada', () => {
  it('rechaza las que terminan en 0000 o empiezan con 9999', () => {
    expect(tarjetaRechazada('4500123456780000')).toBe(true);
    expect(tarjetaRechazada('9999123456789010')).toBe(true);
    expect(tarjetaRechazada('4500123456789010')).toBe(false);
  });
});

describe('formato de los campos', () => {
  it('deja solo 16 dígitos en el número y los muestra de a cuatro', () => {
    expect(formatearNumero('4500-1234 5678 9010 99')).toBe('4500 1234 5678 9010');
    expect(formatearNumero('45001')).toBe('4500 1');
  });

  it('arma MM/AA mientras se escribe', () => {
    expect(formatearVencimiento('1')).toBe('1');
    expect(formatearVencimiento('12')).toBe('12');
    expect(formatearVencimiento('122')).toBe('12/2');
    expect(formatearVencimiento('12/277')).toBe('12/27');
  });
});
