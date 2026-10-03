import { api } from '@/config/api';
import { useEffect, useState, useCallback } from 'react';
import type { KoiSession } from '../koi.types';

export interface ChatMessage {
  role: 'user' | 'bot';
  text: string;
}

export const useKoiChat = () => {
  const [session, setSession] = useState<KoiSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const initSession = async () => {
      try {
        const res = await api.post('/api/koi/sessions');
        setSession(res.data);

        if (res.data.reply) {
          setMessages([{ role: 'bot', text: res.data.reply }]);
        }
      } catch (error) {
        console.error('Error al iniciar la sesión de KOI:', error);
      }
    };

    initSession();
  }, []);

  const sendMessage = useCallback(
    async (userText: string) => {
      if (!userText.trim() || !session?.sessionId) return;

      const userMessage: ChatMessage = { role: 'user', text: userText };

      setMessages((prev) => [...prev, userMessage]);
      setLoading(true);

      try {
        const res = await api.post(`/api/koi/sessions/${session.sessionId}/messages`, {
          message: userText,
          history: messages.slice(-6).map((m) => ({
            role: m.role === 'user' ? 'user' : 'assistant',
            content: m.text,
          })),
        });

        const botMessage: ChatMessage = { role: 'bot', text: res.data.reply };

        setMessages((prev) => [...prev, botMessage]);
      } catch (error) {
        console.error('Error al enviar mensaje a KOI:', error);
        setMessages((prev) => [
          ...prev,
          {
            role: 'bot',
            text: 'Disculpa, tuve un error al procesar tu mensaje. ¿Podrías repetirlo?',
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [session, messages],
  );

  return {
    messages,
    sendMessage,
    loading,
    isReady: !!session,
  };
};
