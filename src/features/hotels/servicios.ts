import type { Servicio } from './hotels.types';

/** Rótulo e ícono de Material Symbols de cada servicio. */
export const SERVICIO_INFO: Record<Servicio, { label: string; icon: string }> = {
  WIFI: { label: 'Wi-Fi', icon: 'wifi' },
  PILETA: { label: 'Pileta', icon: 'pool' },
  DESAYUNO: { label: 'Desayuno', icon: 'free_breakfast' },
  ESTACIONAMIENTO: { label: 'Estacionamiento', icon: 'local_parking' },
  GIMNASIO: { label: 'Gimnasio', icon: 'fitness_center' },
  SPA: { label: 'Spa', icon: 'spa' },
  AIRE_ACONDICIONADO: { label: 'Aire acondicionado', icon: 'ac_unit' },
  RESTAURANTE: { label: 'Restaurante', icon: 'restaurant' },
  MASCOTAS: { label: 'Acepta mascotas', icon: 'pets' },
  TRASLADO: { label: 'Traslado', icon: 'airport_shuttle' },
};

export const SERVICIOS: Servicio[] = Object.keys(SERVICIO_INFO) as Servicio[];
