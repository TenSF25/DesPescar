import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ChatMessage } from '../koi.types';
import {
  guardarSessionId,
  leerSessionId,
  mensajeDeErrorKoi,
  mensajeDeRespuesta,
  mensajesDesdeHistorial,
  olvidarSessionId,
} from '../koiSesion';
import { crearSesionKoi, enviarMensajeKoi, obtenerHistorialKoi } from './koiService';
import { pausaParaPensar } from '../koiSesion';
import { useAuthStore } from '@/store/useAuthStore';

export type { ChatMessage } from '../koi.types';

const statusDe = (error: unknown) =>
  axios.isAxiosError(error) ? error.response?.status : undefined;

/**
 * Conversación con KOI. El sessionId se guarda en sessionStorage y, si ya había uno, el
 * historial (con las opciones de cada mensaje) se trae del servidor. El historial no se manda:
 * lo guarda el servidor (spec 4.9).
 */
const esperar = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

export const useKoiChat = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  // Mientras se recupera o crea la sesión inicial; si falla, el chat igual queda usable
  const [iniciando, setIniciando] = useState(true);
  // StrictMode monta dos veces en desarrollo: sin esto se crearían dos sesiones
  const iniciado = useRef(false);

  const empezarDeCero = useCallback(async () => {
    olvidarSessionId();
    const nueva = await crearSesionKoi();
    guardarSessionId(nueva.sessionId);
    setSessionId(nueva.sessionId);
    setMessages([mensajeDeRespuesta(nueva)]);
  }, []);

  useEffect(() => {
    if (iniciado.current) return;
    iniciado.current = true;

    const iniciar = async () => {
      const guardado = leerSessionId();
      if (guardado) {
        try {
          const historial = await obtenerHistorialKoi(guardado);
          setSessionId(guardado);
          setMessages(mensajesDesdeHistorial(historial));
          return;
        } catch (error) {
          // 404: la sesión ya no existe (base recreada); cualquier otro error, también se empieza de nuevo
          console.warn('KOI: no se pudo recuperar la conversación', statusDe(error));
        }
      }
      try {
        await empezarDeCero();
      } catch (error) {
        console.error('Error al iniciar la sesión de KOI:', error);
      }
    };

    void iniciar().finally(() => setIniciando(false));
  }, [empezarDeCero]);

  // Al cambiar de cuenta (o cerrar sesión) la conversación anterior no debe quedar a la vista
  const usuarioId = useAuthStore((state) => state.user?.id ?? null);
  const usuarioPrevio = useRef(usuarioId);
  useEffect(() => {
    if (usuarioPrevio.current === usuarioId) return;
    usuarioPrevio.current = usuarioId;
    olvidarSessionId();
    setSessionId(null);
    setMessages([]);
    empezarDeCero().catch((error) => console.error('Error al reiniciar la sesión de KOI:', error));
  }, [usuarioId, empezarDeCero]);

  const sendMessage = useCallback(
    async (userText: string) => {
      const texto = userText.trim();
      if (!texto) return;

      setMessages((prev) => [...prev, { role: 'user', text: texto, opciones: [] }]);
      setLoading(true);

      try {
        // Si KOI no estaba disponible al abrir la página, la sesión se crea recién ahora
        let id = sessionId;
        if (!id) {
          const nueva = await crearSesionKoi();
          guardarSessionId(nueva.sessionId);
          setSessionId(nueva.sessionId);
          id = nueva.sessionId;
        }
        // KOI "piensa" un momento: la respuesta nunca aparece antes de la pausa mínima
        const [respuesta] = await Promise.all([
          enviarMensajeKoi(id, texto),
          esperar(pausaParaPensar(texto.length)),
        ]);
        setMessages((prev) => [...prev, mensajeDeRespuesta(respuesta)]);
      } catch (error) {
        const status = statusDe(error);
        if (status === 404) {
          // La sesión desapareció en el servidor: se arranca otra y se avisa
          try {
            await empezarDeCero();
          } catch (otro) {
            console.error('Error al reiniciar la sesión de KOI:', otro);
          }
          return;
        }
        setMessages((prev) => [
          ...prev,
          { role: 'bot', text: mensajeDeErrorKoi(status), opciones: [] },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [sessionId, empezarDeCero],
  );

  return {
    messages,
    sendMessage,
    loading,
    isReady: !iniciando,
  };
};
