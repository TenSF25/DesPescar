import { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import type { IniciarVueloRequest } from '@/features/cart/cart.types';
import { leerErrorApi } from '@/features/cart/carrito';
import { iniciarVuelo } from '@/features/cart/services/carritoService';
import { useCarritoStore } from '@/store/useCarritoStore';
import { useFlightStore } from '@/store/useFlightStore';

export type ResultadoInit =
  | { success: true; reservationId: number }
  | { success: false; codigo: string | null; error: string };

/** Al reemplazar: si el vuelo ya no está o el carrito venció, no hay nada que quitar. */
const nadaQueQuitar = (status: number | null, codigo: string | null) =>
  status === 410 || codigo === 'SIN_VUELO' || codigo === 'CARRITO_NO_ENCONTRADO';

/** Lleva el vuelo elegido al carrito (POST /init) y, si ya tenía uno, permite reemplazarlo. */
export const useBooking = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    selectedDepartureFlight,
    selectedReturnFlight,
    passengers,
    selectedDepartureFare,
    selectedReturnFare,
  } = useFlightStore(
    useShallow((s) => ({
      selectedDepartureFlight: s.selectedDepartureFlight,
      selectedReturnFlight: s.selectedReturnFlight,
      passengers: s.passengers,
      selectedDepartureFare: s.selectedDepartureFare,
      selectedReturnFare: s.selectedReturnFare,
    })),
  );
  const quitarVueloDelCarrito = useCarritoStore((s) => s.quitarVuelo);

  const armarPedido = (): IniciarVueloRequest | string => {
    if (!selectedDepartureFlight) return 'Elegí un vuelo antes de continuar.';
    const flightIds = [selectedDepartureFlight, selectedReturnFlight].filter((id): id is string =>
      Boolean(id),
    );
    const baggageIds = [selectedDepartureFare, selectedReturnFare].filter((id): id is string =>
      Boolean(id),
    );
    if (baggageIds.length !== flightIds.length) return 'Seleccioná una tarifa para cada tramo.';
    return {
      flightIds,
      cantidadPasajeros: Math.max(1, Number(passengers) || 1),
      paymentType: 'SINGLE_PAYMENT',
      baggageIds,
      hotelId: null,
      packageId: null,
    };
  };

  const initBooking = async (): Promise<ResultadoInit> => {
    setIsLoading(true);
    setError(null);
    try {
      const pedido = armarPedido();
      if (typeof pedido === 'string') {
        setError(pedido);
        return { success: false, codigo: null, error: pedido };
      }
      const res = await iniciarVuelo(pedido);
      return { success: true, reservationId: res.bookingId };
    } catch (err: unknown) {
      const e = leerErrorApi(err, 'No pudimos agregar el vuelo al carrito.');
      // El conflicto se resuelve con el diálogo de reemplazo, no como error.
      if (e.codigo !== 'CARRITO_YA_TIENE_VUELO') setError(e.mensaje);
      return { success: false, codigo: e.codigo, error: e.mensaje };
    } finally {
      setIsLoading(false);
    }
  };

  /** 409 CARRITO_YA_TIENE_VUELO: quita el vuelo del carrito y vuelve a intentar (D29). */
  const reemplazarVuelo = async (): Promise<ResultadoInit> => {
    setIsLoading(true);
    setError(null);
    const r = await quitarVueloDelCarrito();
    setIsLoading(false);
    if (!r.ok && !nadaQueQuitar(r.error.status, r.error.codigo)) {
      setError(r.error.mensaje);
      return { success: false, codigo: r.error.codigo, error: r.error.mensaje };
    }
    return initBooking();
  };

  return { initBooking, reemplazarVuelo, isLoading, error };
};
