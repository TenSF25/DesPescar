import type { ChatMessage } from '../chatbot.types';

/**
 * Por ahora solo esta el front-end del chat, por lo que las respuestas se generan localmente. Cuando el microservicio
 * de KOI AI esté disponible, reemplazar el cuerpo de `sendMessageToKoi` por una llamada real a la API.
 * Ejemplo:
 * const KOI_API_URL = import.meta.env.VITE_KOI_API_URL;
 *
 * export async function sendMessageToKoi(message: string, history: ChatMessage[]) {
 *   const response = await fetch(`${KOI_API_URL}/chat`, {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify({ message, history }),
 *   });
 *
 *   if (!response.ok) {
 *     throw new Error('No se pudo contactar a KOI AI');
 *   }
 *
 *   const data = await response.json();
 *   return data.reply as string;
 * }
 */
export async function sendMessageToKoi(message: string, history: ChatMessage[]): Promise<string> {
  await simulateNetworkDelay();
  return getMockReply(message, history);
}

function simulateNetworkDelay() {
  return new Promise((resolve) => setTimeout(resolve, 700 + Math.random() * 500));
}

function getMockReply(message: string, history: ChatMessage[]): string {
  const text = message.toLowerCase();

  if (text.includes('hotel')) {
    return 'Puedo ayudarte a buscar hoteles. Contame la ciudad de destino y las fechas de tu estadía.';
  }

  if (text.includes('vuelo') || text.includes('vuelos')) {
    return '¡Perfecto! Decime desde dónde y hacia dónde querés volar, y las fechas de ida y vuelta.';
  }

  if (text.includes('hola') || history.length <= 1) {
    return '¡Hola! Contame qué viaje estás planeando y te ayudo con vuelos y hoteles en DesPescar.';
  }

  if (text.includes('gracias')) {
    return '¡De nada! Estoy para ayudarte con tu próximo viaje. ¿Necesitás algo más?';
  }

  return 'Todavía estoy aprendiendo a responder eso. Muy pronto voy a poder ayudarte con inteligencia artificial real. ¿Querés que busquemos vuelos u hoteles?';
}
