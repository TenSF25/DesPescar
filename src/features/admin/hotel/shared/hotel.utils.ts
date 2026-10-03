import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import type { BadgeTone } from '@/components/admin';
import type { ReservationStatus } from './hotel.types';

export const RESERVATION_STATUS_TONE: Record<ReservationStatus, BadgeTone> = {
  Próxima: 'info',
  'En estadía': 'warning',
  Completada: 'success',
  Cancelada: 'danger',
};

export const formatUsd = (amount: number) => `$${amount.toLocaleString('es-AR')}`;

export const formatHotelDate = (iso: string) =>
  format(parseISO(iso), 'dd MMM yyyy', { locale: es });
