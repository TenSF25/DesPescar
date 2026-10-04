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

/**
 * Versión liviana de una foto para mostrarla en miniatura. Las fotos originales de
 * Unsplash pesan varios MB (miles de píxeles de ancho); pedirlas con el tamaño justo
 * baja a unos pocos KB y evita que la página se trabe al desplazarse.
 * `width` y `height` son el tamaño en pantalla; se piden al doble para pantallas retina.
 */
export const thumbnailUrl = (url: string, width: number, height: number) => {
  if (!url.includes('images.unsplash.com')) return url;
  const thumbnail = new URL(url);
  thumbnail.searchParams.set('auto', 'format');
  thumbnail.searchParams.set('fit', 'crop');
  thumbnail.searchParams.set('w', String(width * 2));
  thumbnail.searchParams.set('h', String(height * 2));
  thumbnail.searchParams.set('q', '60');
  return thumbnail.toString();
};
