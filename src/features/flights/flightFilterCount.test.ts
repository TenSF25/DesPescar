import { describe, expect, it } from 'vitest';
import { contarFiltrosVuelo } from './flightFilterCount';

const base = {
  escala: 'Todos',
  aerolineas: [],
  equipaje: 'Todos',
  horarioMin: 0,
  horarioMax: 1439,
};

describe('contarFiltrosVuelo', () => {
  it('es cero sin filtros', () => {
    expect(contarFiltrosVuelo(base)).toBe(0);
  });
  it('suma escala, aerolineas, equipaje y horario', () => {
    expect(
      contarFiltrosVuelo({
        escala: 'Directo',
        aerolineas: ['A', 'B'],
        equipaje: 'Con equipaje',
        horarioMin: 60,
        horarioMax: 1439,
      }),
    ).toBe(5);
  });
  it('cuenta el horario una sola vez aunque cambien ambos extremos', () => {
    expect(contarFiltrosVuelo({ ...base, horarioMin: 100, horarioMax: 900 })).toBe(1);
  });
});
