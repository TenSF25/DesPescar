export interface SeatsWebSockets {
  blockedByUserId: number;
  bloqueadoHasta: string;
  flightId: string;
  id: string;
  numberSeat: string;
  statusSeat: 'DISPONIBLE' | 'BLOQUEADO' | 'RESERVADO_TEMPORAL';
}

export interface FareClassDetail {
  id?: string;
  name: string;
  price: number;
  colorKey: string;
}

export interface SeatItem {
  type: 'seat';
  seatUuid: string;
  displayNumber: string;
  fareClass: string;
  status: 'DISPONIBLE' | 'BLOQUEADO' | 'RESERVADO_TEMPORAL' | 'select';
  blockedByUserId?: number;
}

export interface AisleItem {
  type: 'aisle';
}

export interface EmptyItem {
  type: 'empty';
}

export type LayoutItem = SeatItem | AisleItem | EmptyItem;

export interface LayoutRow {
  type: 'row';
  rowNumber: number;
  items: LayoutItem[];
}

export interface MetadataAmenity {
  title?: string;
  subtitle?: string;
  priceTag?: string;
  color?: string;
  icons?: string[];
}

export interface LayoutAmenity {
  type: 'amenity';
  amenityType: 'services' | 'class_divider' | 'emergency';
  metadata: MetadataAmenity;
}

export type LayoutElement = LayoutRow | LayoutAmenity;

export interface FlightSeatMapResponse {
  aircraftName: string;
  totalSelectedLimit: number;
  fareClasses: Record<string, FareClassDetail>;
  layout: LayoutElement[];
}

export interface BookingInitResponse {
  bookingId: number;
  status: string;
}

export interface PaymentCreateResponse {
  id: string;
  reservationId: number;
  userId: number;
  amount: number;
  currency: string;
  status: string;
  checkoutUrl: string | null;
}

export type BookingStatus =
  'INICIADA' | 'PENDIENTE_PAGO' | 'ESPERANDO_PAGADORES' | 'CONFIRMADA' | 'EXPIRADA' | 'CANCELADA';

/** Respuesta de GET /api/bookings/{id} (ReservationResponse en reservation-service). */
export interface BookingDetail {
  idCarrito: number;
  vueloCodigo: string;
  hotelId: string | null;
  estadoGeneral: BookingStatus;
  segundosRestantes: number | null;
  montoTotal: number;
  moneda: string;
  asientos: Array<{
    asientoIda: string | null;
    asientoVuelta: string | null;
    pagadorId: number | null;
    precioCobrado: number | null;
    estadoPago: string | null;
    nombrePasajero: string | null;
    dniPasaporte: string | null;
    tarifaNombre: string | null;
  }>;
}
