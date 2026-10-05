import { api } from '@/config/api';
import type { EditarPartesRequest, Grupo, GrupoResumen } from '../grupo.types';

const BASE = '/api/bookings';

export const iniciarGrupo = async (reservaId: number, cantidadPartes: number): Promise<Grupo> => {
  const res = await api.post<Grupo>(`${BASE}/${reservaId}/grupo`, { cantidadPartes });
  return res.data;
};

export const obtenerGrupo = async (reservaId: number): Promise<Grupo> => {
  const res = await api.get<Grupo>(`${BASE}/${reservaId}/grupo`);
  return res.data;
};

export const editarPartes = async (
  reservaId: number,
  pedido: EditarPartesRequest,
): Promise<Grupo> => {
  const res = await api.put<Grupo>(`${BASE}/${reservaId}/grupo/partes`, pedido);
  return res.data;
};

export const liberarParte = async (reservaId: number, numero: number): Promise<Grupo> => {
  const res = await api.post<Grupo>(`${BASE}/${reservaId}/grupo/partes/${numero}/liberar`);
  return res.data;
};

export const cancelarGrupo = async (reservaId: number): Promise<Grupo> => {
  const res = await api.delete<Grupo>(`${BASE}/${reservaId}/grupo`);
  return res.data;
};

/** Para quien tiene parte (organizador incluido). 404 si no la tiene. */
export const participacion = async (reservaId: number): Promise<Grupo> => {
  const res = await api.get<Grupo>(`${BASE}/${reservaId}/grupo/participacion`);
  return res.data;
};

/** El token va en el cuerpo, nunca en la URL de la API (D-b6). */
export const consultarGrupo = async (token: string): Promise<Grupo> => {
  const res = await api.post<Grupo>(`${BASE}/grupos/consultar`, { token });
  return res.data;
};

export const unirseGrupo = async (token: string, apodo: string | null): Promise<Grupo> => {
  const res = await api.post<Grupo>(`${BASE}/grupos/unirse`, apodo ? { token, apodo } : { token });
  return res.data;
};

export const misGrupos = async (): Promise<GrupoResumen[]> => {
  const res = await api.get<GrupoResumen[]>(`${BASE}/grupos/mios`);
  return res.data;
};
