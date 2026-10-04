import { wsBrokerUrl } from '@/config/api';
import { useAuthStore } from '@/store/useAuthStore';
import { Client } from '@stomp/stompjs';
import { useEffect, useRef } from 'react';

export const useFlightWebSocket = (flightId: string, onSeatUpdate: (update: unknown) => void) => {
  const clientRef = useRef<Client | null>(null);

  const onSeatUpdateRef = useRef(onSeatUpdate);

  useEffect(() => {
    onSeatUpdateRef.current = onSeatUpdate;
  }, [onSeatUpdate]);

  const userId = useAuthStore((state) => state.user?.id);
  const token = useAuthStore((state) => state.tokens?.accessToken);

  useEffect(() => {
    if (!token || !flightId) return;

    const client = new Client({
      brokerURL: wsBrokerUrl,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      onConnect: () => {
        client.subscribe(`/topic/flight/${flightId}`, (message) => {
          try {
            const update = JSON.parse(message.body);
            onSeatUpdateRef.current(update);
          } catch (error) {
            console.error('Error al parsear el mensaje del WebSocket:', error);
          }
        });

        client.subscribe('/user/queue/errores', (message) => {
          console.error('❌ ERROR DEL SERVIDOR RECIBIDO POR WS:\n', message.body);
        });
      },

      onStompError: (frame) => {
        console.error('Error STOMP:', frame.headers['message']);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [flightId, token]);

  const selectSeat = (seatUuid: string) => {
    if (clientRef.current?.connected) {
      clientRef.current.publish({
        destination: `/app/select-seat/${flightId}`,
        body: JSON.stringify({ seatUuid, userId }),
      });
    } else {
      console.warn('⚠️ No se pudo enviar la acción: El cliente WebSocket no está conectado.');
    }
  };

  const deselectSeat = (seatUuid: string) => {
    if (clientRef.current?.connected) {
      console.log('🚀 Enviando deselección al backend:', { seatUuid, userId });
      clientRef.current.publish({
        destination: `/app/deselect-seat/${flightId}`,
        body: JSON.stringify({ seatUuid, userId }),
      });
    } else {
      console.warn('⚠️ WebSocket no conectado.');
    }
  };

  return { selectSeat, deselectSeat };
};
