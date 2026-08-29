export interface Habitacion {
  id: number;
  nombre: string;
  descripcion: string;
  precioPorNoche: number;
  capacidad: number;
  imageUrl: string;
}

export interface Resena {
  id: number;
  nombre: string;
  fecha: string;
  calificacion: number; // 1 a 5, admite decimales (ej: 4.5)
  comentario: string;
}

export interface Hotel {
  id: number;
  nombre: string;
  ciudad: string;
  pais: string;
  estrellas: 1 | 2 | 3 | 4 | 5;
  precioPorNoche: number;
  precioOferta?: number;
  precioOriginal?: number; // si existe, se muestra tachado (precio "antes") en tarjetas promo
  imageUrl: string;
  tipo: 'Boutique' | 'Resort All-Inclusive' | 'Negocios' | 'Apartamentos';
  servicios: string[]; // 'wifi' | 'piscina' | 'desayuno' | 'spa' | 'gimnasio' | 'restaurante' | 'estacionamiento' | 'bar' | 'room_service'

  // Campos para la vista de detalle (opcionales: el listado no los necesita)
  direccion?: string;
  calificacion?: number; // ej: 4.5
  cantidadResenas?: number;
  descripcion?: string;
  galeria?: string[];
  notaUbicacion?: string; // ej: "A 10 min de la Sagrada Familia"
  habitaciones?: Habitacion[];
  resenas?: Resena[];
}

export interface HotelCardProps {
  id: number;
  nombre: string;
  ciudad: string;
  pais: string;
  estrellas: number;
  precioPorNoche: number;
  precioOferta?: number;
  imageUrl: string;
}

export type EstadoReserva = 'proximo' | 'completado' | 'cancelado';

export interface ReservaHotel {
  id: number;
  hotelId: number;
  hotelNombre: string;
  ciudad: string;
  pais: string;
  estrellas: number;
  imageUrl: string;
  habitacionNombre: string;
  fechaInicio: string; // ISO (yyyy-mm-dd)
  fechaFin: string; // ISO (yyyy-mm-dd)
  estado: EstadoReserva;
  precioTotal: number;
  codigoConfirmacion: string;
  contactEmail: string;
}

export type MotivoCancelacion =
  | 'Cambio de planes'
  | 'Problema personal'
  | 'Motivos de salud'
  | 'Problema con el hotel'
  | 'Otro';
