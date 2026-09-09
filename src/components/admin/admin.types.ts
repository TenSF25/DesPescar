import type { ReactNode } from 'react';

/** Item de navegación del sidebar de administrador */
export interface AdminNavLink {
  type: 'link';
  label: string;
  path: string;
  icon: string; // nombre del ícono de Material Symbols
}

/** Título de sección del sidebar, no navegable */
export interface AdminNavTitle {
  type: 'title';
  label: string;
  icon: string;
}

export type AdminNavEntry = AdminNavTitle | AdminNavLink;

export type TrendDirection = 'up' | 'down';

/** Tonos de color disponibles para el componente <Badge /> */
export type BadgeTone = 'success' | 'danger' | 'warning' | 'info' | 'neutral' | 'dark';

/** Definición de una columna para <DataTable /> */
export interface TableColumn<T> {
  key: string;
  header: string;
  className?: string;
  render?: (row: T) => ReactNode;
}

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
