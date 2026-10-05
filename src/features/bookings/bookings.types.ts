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
  /** Siempre 0: elegir asiento no se cobra (D3). Se muestra con precioAsiento. */
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
