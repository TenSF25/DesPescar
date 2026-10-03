import type { BadgeTone } from '@/components/admin';
import type { BookingStatus } from './admin-bookings.types';

export const BOOKING_STATUS_TONE: Record<BookingStatus, BadgeTone> = {
  Confirmada: 'success',
  Pendiente: 'warning',
  Cancelada: 'danger',
};
