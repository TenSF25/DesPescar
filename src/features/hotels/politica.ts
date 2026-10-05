import type { TramoCancelacion } from './hotels.types';

const formatHoras = (h: number) => (h >= 48 && h % 24 === 0 ? `${h / 24} días` : `${h} h`);

/** Texto de cada tramo, de mayor a menor anticipación, para mostrar antes de reservar o cancelar. */
export const describirPolitica = (
  tramos: TramoCancelacion[],
): { texto: string; porcentaje: number }[] => {
  const ordenados = [...tramos].sort((a, b) => b.horasAntes - a.horasAntes);
  const lineas = ordenados.map((t, i) => {
    const anterior = ordenados[i - 1];
    let texto: string;
    if (!anterior) {
      texto =
        t.horasAntes > 0
          ? `Con ${formatHoras(t.horasAntes)} o más de anticipación`
          : 'En cualquier momento';
    } else if (t.horasAntes > 0) {
      texto = `Entre ${formatHoras(t.horasAntes)} y ${formatHoras(anterior.horasAntes)} antes`;
    } else {
      texto = `Con menos de ${formatHoras(anterior.horasAntes)}`;
    }
    return { texto, porcentaje: t.porcentajeReembolso };
  });
  const ultimo = ordenados[ordenados.length - 1];
  if (ultimo && ultimo.horasAntes > 0) {
    lineas.push({ texto: `Con menos de ${formatHoras(ultimo.horasAntes)}`, porcentaje: 0 });
  }
  return lineas;
};
