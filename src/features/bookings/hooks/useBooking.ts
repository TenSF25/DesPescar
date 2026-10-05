import { useState } from 'react';
import { api } from '@/config/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useFlightStore } from '@/store/useFlightStore';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';
import type { BookingInitResponse, PaymentCreateResponse } from '../bookings.types';

/** Lo que reservation-service guarda hoy de cada pasajero: nombre completo y documento. */
export type PassengerFormInput = {
  nombreCompleto: string;
  dniPasaporte: string;
};

export type PassengerFareDetails = {
  id: string;
  name: string;
  pricePerPassenger: number;
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
        flightIds,
        cantidadPasajeros: Number(passengersLimit),
        paymentType: 'SINGLE_PAYMENT',
        hotelId: hotelId || null,
        baggageIds,
      };

      const initResponse = await api.post<BookingInitResponse>('/api/bookings/init', initPayload);

      const reservationId = initResponse.data.bookingId;

      if (!reservationId) {
        throw new Error('El servidor no devolvió el ID de la reserva.');
      }

      return { success: true, reservationId };
    } catch (err: unknown) {
      console.error('Error inicializando la reserva:', err);
      const message = getApiErrorMessage(err, 'Ha ocurrido un error al inicializar la reserva.');
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  /** Paso de datos: asigna pasajeros y asientos a la reserva (queda PENDIENTE_PAGO). */
  const savePassengers = async (
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

      // reservation-service acepta la asignación de pasajeros una sola vez por reserva (un segundo PUT da 400).
      if (useFlightStore.getState().passengersAssignedBookingId !== reservationId) {
        // El token lo agrega el interceptor de `api`.
        await api.put(`/api/bookings/${reservationId}/passengers`, { pasajeros: pasajerosPayload });
        setPassengersAssignedBookingId(reservationId);
      }
      return { success: true as const };
    } catch (err: unknown) {
      console.error('Error guardando los pasajeros:', err);
      const message = getApiErrorMessage(err, 'No se pudieron guardar los datos de los pasajeros.');
      setError(message);
      return { success: false as const, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  /** Paso de pago: crea el pago (el importe lo toma el backend de la reserva) y devuelve el link de Mercado Pago. */
  const startPayment = async (reservationId: number) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!token) throw new Error('No hay sesión activa.');
      if (!reservationId) throw new Error('Falta la reserva.');

      const paymentResponse = await api.post<PaymentCreateResponse>('/api/payments', {
        reservationId,
      });
      const paymentUrl = paymentResponse.data.checkoutUrl;
      if (!paymentUrl) throw new Error('No se pudo generar el enlace de pago.');

      return { success: true as const, paymentUrl, payment: paymentResponse.data };
    } catch (err: unknown) {
      console.error('Error iniciando el pago:', err);
      const message = getApiErrorMessage(err, 'Ha ocurrido un error al procesar el pago.');
      setError(message);
      return { success: false as const, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    initBooking,
    savePassengers,
    startPayment,
    isLoading,
    error,
  };
};
