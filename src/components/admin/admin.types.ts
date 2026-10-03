import type { ReactNode } from 'react';

/** Item de navegación del sidebar de administrador */
export interface AdminNavItem {
  label: string;
  path: string;
  icon: string; // nombre del ícono de Material Symbols
  /** Marcar la ruta activa solo si coincide exacto (ej: el dashboard raíz de cada panel). */
  end?: boolean;
}

export type TrendDirection = 'up' | 'down';

/** Tonos de color disponibles para el componente <Badge /> */
export type BadgeTone = 'success' | 'danger' | 'warning' | 'info' | 'neutral' | 'dark';

/** Definición de una columna para <DataTable /> */
export interface TableColumn<T> {
  key: string;
  header: string;
  className?: string;
  /** Si es true, el header es clickeable y ordena la tabla por esta columna. */
  sortable?: boolean;
  render?: (row: T) => ReactNode;
}

export type SortDirection = 'asc' | 'desc';

/** Dato individual para <DonutChart /> */
export interface DonutChartDatum {
  label: string;
  value: number;
  color: string;
}

/** Dato individual para <LineChart /> */
export interface LineChartDatum {
  label: string;
  value: number;
}
