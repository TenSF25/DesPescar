import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import type { BadgeTone } from '@/components/admin';
import type { FlightStatus } from './admin-flights.types';

export const FLIGHT_STATUS_TONE: Record<FlightStatus, BadgeTone> = {
  Programado: 'warning',
  'En curso': 'info',
  Completado: 'success',
  Cancelado: 'danger',
};

export const formatFlightDate = (iso: string) =>
  format(parseISO(iso), 'dd MMM yyyy', { locale: es });
