/** Reparte `total` reservas en franjas de 3 horas con una curva diurna (suma exacta). */
export const distributeByHour = (total: number) => {
  const weights = [1, 0.5, 2, 4, 5, 4.5, 6, 3];
  const weightSum = weights.reduce((a, b) => a + b, 0);
  const raw = weights.map((w) => (total * w) / weightSum);
  const counts = raw.map(Math.floor);
  let remainder = total - counts.reduce((a, b) => a + b, 0);
  [...raw.keys()]
    .sort((a, b) => raw[b] - Math.floor(raw[b]) - (raw[a] - Math.floor(raw[a])))
    .forEach((index) => {
      if (remainder > 0) {
        counts[index] += 1;
        remainder -= 1;
      }
    });
  return counts.map((value, index) => ({
    label: `${String(index * 3).padStart(2, '0')}h`,
    value,
  }));
};
