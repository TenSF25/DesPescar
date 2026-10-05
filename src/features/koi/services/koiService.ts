import { api } from '@/config/api';
import type { KoiConversationResponse, KoiMensajeHistorial } from '../koi.types';

// El interceptor de api no agrega el token en /api/koi: KOI es anónimo (spec 8, fuera de alcance).

export const crearSesionKoi = async (): Promise<KoiConversationResponse> =>
  (await api.post<KoiConversationResponse>('/api/koi/sessions')).data;

export const enviarMensajeKoi = async (
  sessionId: string,
  message: string,
): Promise<KoiConversationResponse> =>
  (
    await api.post<KoiConversationResponse>(`/api/koi/sessions/${sessionId}/messages`, {
      message,
    })
  ).data;

export const obtenerHistorialKoi = async (sessionId: string): Promise<KoiMensajeHistorial[]> =>
  (await api.get<KoiMensajeHistorial[]>(`/api/koi/sessions/${sessionId}/messages`)).data;
