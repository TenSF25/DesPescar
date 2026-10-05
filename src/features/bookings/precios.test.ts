import { describe, expect, it } from 'vitest';
import { precioAsiento, textoTarifa } from './precios';

// Intl usa espacio duro entre el signo y el número.
const sinEspacios = (s: string) => s.replace(/\s/g, ' ');

describe('textoTarifa', () => {
  it('Light (0) no suma nada', () => {
    expect(textoTarifa(0)).toEqual({
      principal: 'Sin cargo extra',
      aclaracion: 'Incluida en el precio',
    });
  });

  it('Standard suma por persona en pesos', () => {
    const p = textoTarifa(45000);
    expect(sinEspacios(p.principal)).toBe('+ $ 45.000');
    expect(p.aclaracion).toBe('Por persona y tramo');
  });
});

describe('precioAsiento', () => {
  it('elegir asiento no se cobra (D3)', () => {
    expect(precioAsiento(0)).toBe('Sin cargo');
    expect(precioAsiento(undefined)).toBe('Sin cargo');
  });

  it('si algún día se cobra, se muestra en pesos', () => {
    expect(sinEspacios(precioAsiento(5581))).toBe('$ 5.581');
  });
});
