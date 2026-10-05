import { describe, expect, it } from 'vitest';
import { describirPolitica } from './politica';

describe('describirPolitica', () => {
  it('describe tramos escalonados de mayor a menor anticipación', () => {
    expect(
      describirPolitica([
        { horasAntes: 24, porcentajeReembolso: 50 },
        { horasAntes: 72, porcentajeReembolso: 100 },
        { horasAntes: 0, porcentajeReembolso: 0 },
      ]),
    ).toEqual([
      { texto: 'Con 3 días o más de anticipación', porcentaje: 100 },
      { texto: 'Entre 24 h y 3 días antes', porcentaje: 50 },
      { texto: 'Con menos de 24 h', porcentaje: 0 },
    ]);
  });

  it('agrega el tramo sin reembolso si la política no llega a 0 h', () => {
    expect(describirPolitica([{ horasAntes: 24, porcentajeReembolso: 100 }])).toEqual([
      { texto: 'Con 24 h o más de anticipación', porcentaje: 100 },
      { texto: 'Con menos de 24 h', porcentaje: 0 },
    ]);
  });

  it('describe la no reembolsable', () => {
    expect(describirPolitica([{ horasAntes: 0, porcentajeReembolso: 0 }])).toEqual([
      { texto: 'En cualquier momento', porcentaje: 0 },
    ]);
  });
});
