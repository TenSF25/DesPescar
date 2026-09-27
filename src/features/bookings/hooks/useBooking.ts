import { useState } from 'react';
import { api } from '@/config/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useFlightStore } from '@/store/useFlightStore';
import type { FlightSeatMapResponse } from '../bookings.types';

export type PassengerFormInput = {
  nombreCompleto: string;
  dniPasaporte: string;
};

export const useBooking = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const myUserId = useAuthStore((state) => state.user?.id);
  const token = useAuthStore((state) => state.tokens?.accessToken);
  const {
    selectedDepartureFlight,
    selectedReturnFlight,
    passengers: passengersLimit,
    clearSearch,
    selectedDepartureFare,
    selectedReturnFare,
  } = useFlightStore();

  const getAuthHeaders = () => {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const initBooking = async (hotelId?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!myUserId || !selectedDepartureFlight || !token) {
        throw new Error('Faltan datos de sesión, token o vuelo.');
      }

      const initPayload = {
        creadorId: myUserId,
        flightIds: [selectedDepartureFlight, selectedReturnFlight],
        cantidadPasajeros: Number(passengersLimit),
        paymentType: 'SINGLE_PAYMENT',
        hotelId: hotelId || null,
        baggageIds: [selectedDepartureFare, selectedReturnFare],
        packageId: null,
      };

      const initResponse = await api.post(
        'http://localhost:8085/api/bookings/init',
        initPayload,
        getAuthHeaders(),
      );

      const reservationId = initResponse.data.bookingId;

      if (!reservationId) {
        throw new Error('El servidor no devolvió el ID de la reserva.');
      }

      return { success: true, reservationId };
    } catch (err: any) {
      console.error('Error inicializando la reserva:', err);
      setError(err.message || 'Ha ocurrido un error al inicializar la reserva.');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const finalizeBookingAndPay = async (
    reservationId: string,
    formData: PassengerFormInput[],
    selectedSeats: string[],
    seatsMap: FlightSeatMapResponse,
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!token) throw new Error('No hay sesión activa.');
      if (formData.length !== selectedSeats.length) {
        throw new Error('Debes completar los datos para todos los pasajeros.');
      }

      const pasajerosPayload = formData.map((pasajero, index) => {
        const seatUuid = selectedSeats[index];

        const getFareDetails = (uuid: string) => {
          let fareClassKey = null;
          for (const row of seatsMap.layout) {
            if (row.type === 'row') {
              const seat = row.items.find((item) => item.type === 'seat' && item.seatUuid === uuid);
              if (seat && seat.type === 'seat') {
                fareClassKey = seat.fareClass;
                break;
              }
            }
          }
          return fareClassKey ? seatsMap.fareClasses[fareClassKey] : null;
        };

        const fareData = getFareDetails(seatUuid);

        return {
          nombreCompleto: pasajero.nombreCompleto,
          dniPasaporte: pasajero.dniPasaporte,
          asientoIda: seatUuid,
          asientoVuelta: null,
          tarifaId: fareData?.id,
          tarifaNombre: fareData?.name,
          precioTarifa: fareData?.price,
        };
      });

      // 1. Guardar pasajeros inyectando el token
      await api.put(
        `http://localhost:8085/api/bookings/${reservationId}/passengers`,
        {
          solicitanteId: myUserId,
          pasajeros: pasajerosPayload,
        },
        getAuthHeaders(),
      );

      // 2. Crear Preferencia en MP inyectando el token
      const paymentResponse = await api.post(
        'http://localhost:8086/api/payments/create-preference',
        {
          reservationId: reservationId,
          userId: myUserId,
        },
        getAuthHeaders(),
      );

      const paymentUrl = paymentResponse.data.initPoint;
      if (!paymentUrl) throw new Error('No se pudo generar el enlace de pago.');

      clearSearch();
      return { success: true, paymentUrl };
    } catch (err: any) {
      console.error('Error finalizando la reserva:', err);
      setError(err.message || 'Ha ocurrido un error al procesar el pago.');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    initBooking,
    finalizeBookingAndPay,
    isLoading,
    error,
  };
};
