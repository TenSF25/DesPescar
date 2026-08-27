import { useCallback, useState } from 'react';
import type { ChatMessage } from '../chatbot.types';
import { sendMessageToKoi } from '../services/koiService';

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const buildWelcomeMessage = (): ChatMessage => ({
  id: createId(),
  role: 'koi',
  text: '¡Hola! Soy KOI AI 🐟, tu asistente de viajes en DesPescar. Contame a dónde querés viajar y te ayudo a encontrar vuelos y hoteles.',
  createdAt: new Date().toISOString(),
});

export const useChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([buildWelcomeMessage()]);
  const [isTyping, setIsTyping] = useState(false);

  const toggleChat = useCallback(() => setIsOpen((prev) => !prev), []);
  const closeChat = useCallback(() => setIsOpen(false), []);
  const openChat = useCallback(() => setIsOpen(true), []);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isTyping) return;

      const userMessage: ChatMessage = {
        id: createId(),
        role: 'user',
        text: trimmed,
        createdAt: new Date().toISOString(),
      };

      const nextHistory = [...messages, userMessage];
      setMessages(nextHistory);
      setIsTyping(true);

      try {
        const reply = await sendMessageToKoi(trimmed, nextHistory);
        const koiMessage: ChatMessage = {
          id: createId(),
          role: 'koi',
          text: reply,
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, koiMessage]);
      } finally {
        setIsTyping(false);
      }
    },
    [messages, isTyping],
  );

  return {
    isOpen,
    toggleChat,
    closeChat,
    openChat,
    messages,
    isTyping,
    sendMessage,
  };
};
