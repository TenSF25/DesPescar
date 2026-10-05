import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ContactData, PassengerData } from '@/features/bookings/checkout.types';

interface CheckoutState {
  /** Reserva a la que pertenecen estos datos: si cambia la reserva, no se reutilizan. */
  bookingId: number | null;
  passengers: PassengerData[];
  contact: ContactData | null;
  save: (bookingId: number, passengers: PassengerData[], contact: ContactData) => void;
  reset: () => void;
}

/** Datos del checkout (pasajeros y contacto): sobreviven a recargar la página hasta completar la compra. */
export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      bookingId: null,
      passengers: [],
      contact: null,
      save: (bookingId, passengers, contact) => set({ bookingId, passengers, contact }),
      reset: () => set({ bookingId: null, passengers: [], contact: null }),
    }),
    { name: 'despescar-checkout' },
  ),
);
