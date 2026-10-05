export type EstadoPago =
  'PENDING' | 'AUTHORIZED' | 'APPROVED' | 'REJECTED' | 'REFUNDED' | 'CANCELLED';

/** PaymentResponse de payment-service (contrato C5). */
export interface Pago {
  id: string;
  reservationId: number;
  userId: number;
  amount: number;
  status: EstadoPago;
  paymentMethod: string | null;
  transactionId: string | null;
  preferenceId: string | null;
  checkoutUrl: string | null;
  paymentDate: string | null;
  currency: string;
  createdAt: string;
}

/** Lo que trae /pago/resultado en la URL (C6). */
export type RetornoPago =
  | { tipo: 'mock'; reservaId: number }
  | { tipo: 'mercadopago'; pagoId: string; mpPaymentId: string | null; estadoMp: string | null };

export type Tono = 'exito' | 'pendiente' | 'error';

export interface ResultadoPago {
  tono: Tono;
  titulo: string;
  detalle: string;
  /** Si conviene volver a consultar en unos segundos. */
  seguirConsultando: boolean;
  /** Si el carrito sigue vigente y se puede reintentar el pago. */
  reintentar: boolean;
}
