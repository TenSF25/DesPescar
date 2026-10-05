import { fromIsoDate } from './hotelSearchParams';

const fechaCorta = new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'short' });

/** "12 nov." */
export const formatFechaCorta = (iso: string) => fechaCorta.format(fromIsoDate(iso));

export const formatNoches = (n: number) => `${n} ${n === 1 ? 'noche' : 'noches'}`;

export const formatHuespedes = (n: number) => `${n} ${n === 1 ? 'huésped' : 'huéspedes'}`;
