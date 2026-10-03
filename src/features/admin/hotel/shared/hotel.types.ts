export type HotelType = 'Boutique' | 'Resort All-Inclusive' | 'Negocios' | 'Apartamentos';

export const HOTEL_TYPES: HotelType[] = [
  'Boutique',
  'Resort All-Inclusive',
  'Negocios',
  'Apartamentos',
];

/** Un tipo de habitación del hotel; `unidades` es cuántas habitaciones de ese tipo hay. */
export interface HotelRoom {
  id: number;
  nombre: string;
  descripcion: string;
  precioPorNoche: number; // USD
  capacidad: number;
  unidades: number;
  imageUrl: string;
  disponible: boolean;
}

export interface HotelInfo {
  id: number;
  nombre: string;
  ciudad: string;
  pais: string;
  tipo: HotelType;
  estrellas: 1 | 2 | 3 | 4 | 5;
  activo: boolean;
  rooms: HotelRoom[];
}

export type ReservationStatus = 'Próxima' | 'En estadía' | 'Completada' | 'Cancelada';

export interface HotelReservation {
  id: string;
  codigo: string; // ej: "#RES-2026-4892"
  roomId: number;
  habitacion: string;
  huesped: string;
  email: string;
  telefono: string;
  creadaEl: string; // YYYY-MM-DD, día en que se hizo la reserva
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  noches: number;
  total: number; // USD
  estado: ReservationStatus;
}
