import type { EstadiaKoi, KoiOpcion } from './koi.types';

/** Lo que el usuario puede pedir con una opción de KOI (spec 4.9). */
export type AccionKoi = 'TODO' | 'SOLO_VUELO' | 'SOLO_HOTEL';

export interface BotonOpcion {
  accion: AccionKoi;
  etiqueta: string;
  principal: boolean;
}

/** Lo que se escribe en useFlightStore para que /booking/seats arme el vuelo. */
export interface VueloParaAsientos {
  selectedDepartureFlight: string;
  selectedReturnFlight: string | null;
  selectedDepartureFare: string;
  selectedReturnFare: string | null;
  passengers: number;
}

/** Qué se agrega al carrito y a dónde se navega después. */
export interface PlanCarrito {
  estadia: EstadiaKoi | null;
  vuelo: VueloParaAsientos | null;
  navegarA: '/booking/seats' | null;
}

export const botonesDeOpcion = (opcion: KoiOpcion): BotonOpcion[] => {
  switch (opcion.tipo) {
    case 'COMBO':
      return [
        { accion: 'TODO', etiqueta: 'Agregar todo', principal: true },
        { accion: 'SOLO_VUELO', etiqueta: 'Solo vuelo', principal: false },
        { accion: 'SOLO_HOTEL', etiqueta: 'Solo hotel', principal: false },
      ];
    case 'VUELO':
      return [{ accion: 'SOLO_VUELO', etiqueta: 'Agregar vuelo', principal: true }];
    case 'HOTEL':
      return [{ accion: 'SOLO_HOTEL', etiqueta: 'Agregar hotel', principal: true }];
  }
};

const estadiaDe = (opcion: KoiOpcion): EstadiaKoi => {
  const h = opcion.hotel;
  if (!h) throw new Error('La opción no tiene hotel.');
  return {
    hotelId: h.hotelId,
    tipoHabitacionId: h.tipoHabitacionId,
    checkIn: h.checkIn,
    checkOut: h.checkOut,
    cantidadHabitaciones: h.cantidadHabitaciones,
    huespedes: h.huespedes,
  };
};

const vueloDe = (opcion: KoiOpcion): VueloParaAsientos => {
  const v = opcion.vuelo;
  if (!v) throw new Error('La opción no tiene vuelo.');
  return {
    selectedDepartureFlight: v.departureFlightId,
    selectedReturnFlight: v.returnFlightId ?? null,
    selectedDepartureFare: v.departureFareId,
    selectedReturnFare: v.returnFareId ?? null,
    passengers: opcion.viajeros,
  };
};

/** Traduce una opción y un botón a acciones de carrito. Función pura (se testea sin red). */
export const planDeCarrito = (opcion: KoiOpcion, accion: AccionKoi): PlanCarrito => {
  if (!botonesDeOpcion(opcion).some((b) => b.accion === accion)) {
    throw new Error(`La opción ${opcion.tipo} no admite ${accion}.`);
  }
  switch (accion) {
    case 'TODO':
      return { estadia: estadiaDe(opcion), vuelo: vueloDe(opcion), navegarA: '/booking/seats' };
    case 'SOLO_VUELO':
      return { estadia: null, vuelo: vueloDe(opcion), navegarA: '/booking/seats' };
    case 'SOLO_HOTEL':
      return { estadia: estadiaDe(opcion), vuelo: null, navegarA: null };
  }
};

/** Estado de useFlightStore para entrar a /booking/seats con el vuelo de KOI. */
export const estadoDeAsientos = (vuelo: VueloParaAsientos) => ({
  ...vuelo,
  bookingId: null,
  selectedSeats: [] as string[],
});

/** Texto para el chat cuando el carrito rechaza el pedido (códigos de E2, contrato C4). */
export const mensajeErrorCarrito = (status: number | undefined, codigo?: string): string => {
  if (codigo === 'SIN_DISPONIBILIDAD_HOTEL' || codigo === 'SIN_DISPONIBILIDAD') {
    return 'Uy, no quedan habitaciones de ese tipo para esas fechas. Pedime otra opción y la busco.';
  }
  if (codigo === 'CARRITO_EXPIRADO' || status === 410) {
    return 'Tu carrito venció. Volvé a elegir la opción y lo armo de nuevo.';
  }
  if (codigo === 'CARRITO_EN_USO') {
    return 'Tu carrito está procesando otro pedido. Probá de nuevo en unos segundos.';
  }
  if (codigo === 'CARRITO_YA_TIENE_VUELO') {
    return 'Tu carrito ya tiene un vuelo. Volvé a elegir la opción para reemplazarlo.';
  }
  if (codigo === 'HOTEL_NO_ENCONTRADO') {
    return 'Ese hotel ya no está disponible. Pedime otra opción y la busco.';
  }
  if (status === 401) {
    return 'Tu sesión venció: iniciá sesión de nuevo y volvé a elegir la opción.';
  }
  if (status !== undefined && status >= 500) {
    return 'El carrito no responde en este momento. Probá de nuevo en un ratito.';
  }
  return 'No pude agregarlo al carrito. Probá de nuevo.';
};
