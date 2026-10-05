export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/** Importe con la moneda que informa el backend (la plataforma opera en ARS; si viene otra se respeta). */
export const formatMoney = (amount: number, currency?: string | null): string => {
  // El backend a veces devuelve el texto "string" cuando no hay moneda cargada.
  const code = !currency || currency.toLowerCase() === 'string' ? 'ARS' : currency;
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};
