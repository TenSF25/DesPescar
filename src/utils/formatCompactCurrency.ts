/**
 * Formatea un número grande de forma compacta, ej: 1900000 -> "1.9M".
 * Se usa en los StatCard de los dashboards de admin.
 */
export const formatCompactCurrency = (amount: number, currencySymbol = '$'): string => {
  const compact = new Intl.NumberFormat('es-AR', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(amount);

  return `${currencySymbol}${compact}`;
};
