export type BookingStatus = 'Confirmada' | 'Pendiente' | 'Cancelada';

export interface AdminBooking {
  id: string;
  codigo: string; // ej: "RSV-10432"
  pasajero: string;
  email: string;
  numeroVuelo: string;
  ruta: string; // ej: "MAD → MEX"
  fecha: string;
  estado: BookingStatus;
  monto: number; // USD
}

export interface BookingStats {
  reservasTotales: number;
  confirmadas: number;
  pendientes: number;
  ingresosTotales: number;
}
