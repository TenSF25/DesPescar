import { api } from '@/config/api';
import type { Destino, HotelDetalle, HotelResumen, HotelSearchParams } from '../hotels.types';
import { buildHotelSearchQuery } from '../hotelSearchParams';

export const buscarHoteles = async (p: HotelSearchParams): Promise<HotelResumen[]> => {
  const res = await api.get<HotelResumen[]>(`/api/hotels?${buildHotelSearchQuery(p)}`);
  return res.data;
};

export const obtenerDestinos = async (): Promise<Destino[]> => {
  const res = await api.get<Destino[]>('/api/hotels/destinos');
  return res.data;
};

export const obtenerHotel = async (id: string, p: HotelSearchParams): Promise<HotelDetalle> => {
  const res = await api.get<HotelDetalle>(
    `/api/hotels/${encodeURIComponent(id)}?${buildHotelSearchQuery({ ...p, destino: '' })}`,
  );
  return res.data;
};
