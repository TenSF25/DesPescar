export interface EstadoFiltrosVuelo {
  escala: string;
  aerolineas: string[];
  equipaje: string;
  horarioMin: number;
  horarioMax: number;
}

export const contarFiltrosVuelo = (f: EstadoFiltrosVuelo): number =>
  (f.escala !== 'Todos' ? 1 : 0) +
  f.aerolineas.length +
  (f.equipaje !== 'Todos' ? 1 : 0) +
  (f.horarioMin !== 0 || f.horarioMax !== 1439 ? 1 : 0);
