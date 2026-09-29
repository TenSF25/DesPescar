import { useState } from 'react';
import axios from 'axios';
import { api, gatewayBaseUrl } from '@/config/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useFlightStore } from '@/store/useFlightStore';
import type { BookingInitResponse, PaymentCreateResponse } from '../bookings.types';

export type PassengerFormInput = {
  nombreCompleto: string;
  dniPasaporte: string;
};

export type PassengerFareDetails = {
  id: string;
  name: string;
  pricePerPassenger: number;
};

const getRequestErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message || error.message || fallback;
  }
  return error instanceof Error ? error.message : fallback;
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
    selectedDepartureFare,
    selectedReturnFare,
      setPassengersAssignedBookingId,
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

      const flightIds = [selectedDepartureFlight, selectedReturnFlight].filter(
        (flightId): flightId is string => Boolean(flightId),
      );
      const baggageIds = [selectedDepartureFare, selectedReturnFare].filter(
        (fareId): fareId is string => Boolean(fareId),
      );

      if (baggageIds.length === 0) {
        throw new Error('Seleccioná una tarifa antes de continuar.');
      }

      const initPayload = {
        creadorId: myUserId,
        flightIds,
        cantidadPasajeros: Number(passengersLimit),
        paymentType: 'SINGLE_PAYMENT',
        hotelId: hotelId || null,
        baggageIds,
        packageId: null,
      };

      const initResponse = await api.post<BookingInitResponse>(
        'http://localhost:8085/api/bookings/init',
        initPayload,
        getAuthHeaders(),
      );

      const reservationId = initResponse.data.bookingId;

      if (!reservationId) {
        throw new Error('El servidor no devolvió el ID de la reserva.');
      }

      return { success: true, reservationId };
    } catch (err: unknown) {
      console.error('Error inicializando la reserva:', err);
      const message = getRequestErrorMessage(err, 'Ha ocurrido un error al inicializar la reserva.');
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const finalizeBookingAndPay = async (
    reservationId: number,
    formData: PassengerFormInput[],
    selectedSeats: string[],
    fareDetails: PassengerFareDetails,
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!token) throw new Error('No hay sesión activa.');
      if (!reservationId || !myUserId) throw new Error('Faltan datos de la reserva o del usuario.');
      if (formData.length !== selectedSeats.length) {
        throw new Error('Debes completar los datos para todos los pasajeros.');
      }
      if (selectedSeats.length === 0 || !fareDetails.id) {
        throw new Error('Faltan asientos o una tarifa válida para continuar.');
      }

      const pasajerosPayload = formData.map((pasajero, index) => ({
          nombreCompleto: pasajero.nombreCompleto,
          dniPasaporte: pasajero.dniPasaporte,
          asientoIda: selectedSeats[index],
          asientoVuelta: null,
          tarifaId: fareDetails.id,
          tarifaNombre: fareDetails.name,
          precioTarifa: fareDetails.pricePerPassenger,
        }));

      // 1. Guardar pasajeros inyectando el token
      if (useFlightStore.getState().passengersAssignedBookingId !== reservationId) {
        await api.put(
          `http://localhost:8085/api/bookings/${reservationId}/passengers`,
          {
            solicitanteId: myUserId,
            pasajeros: pasajerosPayload,
          },
          getAuthHeaders(),
        );
        setPassengersAssignedBookingId(reservationId);
      }

      // El backend obtiene el importe y la moneda desde la reserva.
      const paymentResponse = await api.post<PaymentCreateResponse>(
        `${gatewayBaseUrl}/api/payments`,
        {
          reservationId: reservationId,
          userId: myUserId,
        },
        getAuthHeaders(),
      );

      const paymentUrl = paymentResponse.data.checkoutUrl;
      if (!paymentUrl) throw new Error('No se pudo generar el enlace de pago.');

      return { success: true, paymentUrl, payment: paymentResponse.data };
    } catch (err: unknown) {
      console.error('Error finalizando la reserva:', err);
      const message = getRequestErrorMessage(err, 'Ha ocurrido un error al procesar el pago.');
      setError(message);
      return { success: false, error: message };
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
