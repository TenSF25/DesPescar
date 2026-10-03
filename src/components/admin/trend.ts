/**
 * Texto y dirección de la flecha de una variación contra el período anterior,
 * listos para esparcir en un <StatCard {...pctTrend(delta)} />. Verde si sube, rojo si baja.
 * `unit`: '%' para variación porcentual, 'pts' para diferencia en puntos porcentuales.
 */
export const pctTrend = (delta: number | undefined, unit: '%' | 'pts' = '%') =>
  delta === undefined
    ? {}
    : {
        trendValue: `${Math.abs(delta)}${unit === '%' ? '%' : ' pts'} vs periodo anterior`,
        trendDirection: delta >= 0 ? ('up' as const) : ('down' as const),
      };
