import { addDays, differenceInCalendarDays, format, parseISO, startOfDay, subDays } from 'date-fns';
import { mockDelay } from '@/utils/mockDelay';
import type {
  HotelInfo,
  HotelReservation,
  HotelRoom,
  HotelType,
  ReservationStatus,
} from './hotel.types';

// Datos de prueba del hotel del administrador. Todo vive en memoria: los cambios
// persisten mientras no se recargue la página.
// TODO(backend): reemplazar por los endpoints de hotel-service (/hoteles) y de reservas,
// filtrando por el hotelId del usuario HOTEL_ADMIN.

const ISO = 'yyyy-MM-dd';

let hotel: HotelInfo = {
  id: 1,
  nombre: 'Hotel Mediterráneo Barcelona',
  ciudad: 'Barcelona',
  pais: 'España',
  tipo: 'Resort All-Inclusive',
  estrellas: 5,
  activo: true,
  rooms: [
    {
      id: 1,
      nombre: 'Habitación Estándar',
      descripcion: 'Cama Queen Size, vista a la ciudad, escritorio de trabajo y baño privado.',
      precioPorNoche: 120,
      capacidad: 2,
      unidades: 6,
      imageUrl: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32',
      disponible: true,
    },
    {
      id: 2,
      nombre: 'Suite Junior',
      descripcion:
        'Cama King Size, sala de estar independiente, balcón privado y tina de hidromasaje.',
      precioPorNoche: 220,
      capacidad: 3,
      unidades: 5,
      imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427',
      disponible: true,
    },
    {
      id: 3,
      nombre: 'Suite Premium',
      descripcion:
        'Vista panorámica al mar mediterráneo, servicio de mayordomo, terraza y bar privado.',
      precioPorNoche: 380,
      capacidad: 4,
      unidades: 4,
      imageUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304',
      disponible: true,
    },
  ],
};

const GUESTS = [
  ['Susana Gómez', 'susana.gomez@email.com', '+34 611 222 333'],
  ['Pablo Molina', 'pablo.molina@email.com', '+34 622 333 444'],
  ['Roberto Roa', 'roberto.roa@email.com', '+54 11 5555 1020'],
  ['Lucía Fernández', 'lucia.fernandez@email.com', '+54 11 5555 2031'],
  ['Martín Castro', 'martin.castro@email.com', '+56 9 6123 4455'],
  ['Valentina Ruiz', 'valentina.ruiz@email.com', '+34 633 444 555'],
  ['Diego Herrera', 'diego.herrera@email.com', '+51 987 654 321'],
  ['Camila Torres', 'camila.torres@email.com', '+57 300 123 4567'],
  ['Martina Suárez', 'martina.suarez@email.com', '+54 351 555 3344'],
  ['Joaquín Peña', 'joaquin.pena@email.com', '+598 99 123 456'],
  ['Sofía Navarro', 'sofia.navarro@email.com', '+34 644 555 666'],
  ['Andrés Giménez', 'andres.gimenez@email.com', '+52 55 1234 5678'],
  ['Florencia Díaz', 'florencia.diaz@email.com', '+54 261 555 7788'],
  ['Tomás Aguirre', 'tomas.aguirre@email.com', '+1 305 555 0123'],
  ['Julieta Romero', 'julieta.romero@email.com', '+39 333 123 4567'],
  ['Nicolás Vega', 'nicolas.vega@email.com', '+33 6 12 34 56 78'],
  ['Carolina Ibáñez', 'carolina.ibanez@email.com', '+55 11 91234 5678'],
  ['Emiliano Sosa', 'emiliano.sosa@email.com', '+54 11 5555 4411'],
  ['Brenda Acosta', 'brenda.acosta@email.com', '+54 341 555 9922'],
  ['Gonzalo Paz', 'gonzalo.paz@email.com', '+34 655 666 777'],
] as const;

const hash = (text: string) => {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};
const random01 = (seed: string) => (hash(seed) % 10000) / 10000;

/** Historial de dos años de reservas (para comparar el último año con el anterior), determinista (misma semilla = mismos datos). */
const generateReservations = (rooms: HotelRoom[]): HotelReservation[] => {
  const today = startOfDay(new Date());
  const todayISO = format(today, ISO);
  const reservations: HotelReservation[] = [];

  for (let offset = -730; offset <= 60; offset++) {
    const checkInDate = addDays(today, offset);
    const checkIn = format(checkInDate, ISO);
    const arrivals = 1 + Math.floor(random01(`arr${checkIn}`) * 5);

    for (let i = 0; i < arrivals; i++) {
      const seed = `${checkIn}-${i}`;
      const creadaEl = subDays(checkInDate, 1 + Math.floor(random01(`lead${seed}`) * 45));
      if (creadaEl > today) continue; // todavía no se hizo esa reserva

      const room = rooms[Math.floor(random01(`room${seed}`) * rooms.length)];
      const noches = 1 + Math.floor(random01(`nights${seed}`) * 6);
      const checkOut = format(addDays(checkInDate, noches), ISO);
      const guest = GUESTS[Math.floor(random01(`guest${seed}`) * GUESTS.length)];
      const cancelled = random01(`cancel${seed}`) < (checkOut < todayISO ? 0.08 : 0.05);

      let estado: ReservationStatus;
      if (cancelled) estado = 'Cancelada';
      else if (checkOut < todayISO) estado = 'Completada';
      else if (checkIn <= todayISO) estado = 'En estadía';
      else estado = 'Próxima';

      reservations.push({
        id: `res-${seed}`,
        codigo: `#RES-${checkIn.slice(0, 4)}-${String(1000 + (hash(seed) % 9000))}`,
        roomId: room.id,
        habitacion: room.nombre,
        huesped: guest[0],
        email: guest[1],
        telefono: guest[2],
        creadaEl: format(creadaEl, ISO),
        checkIn,
        checkOut,
        noches,
        total: noches * room.precioPorNoche,
        estado,
      });
    }
  }
  return reservations;
};

let reservations: HotelReservation[] = generateReservations(hotel.rooms);

export const getHotel = async (): Promise<HotelInfo> => {
  await mockDelay();
  return hotel;
};

export interface HotelInfoInput {
  nombre: string;
  ciudad: string;
  pais: string;
  tipo: HotelType;
  estrellas: HotelInfo['estrellas'];
  activo: boolean;
}

// TODO(backend): PUT /hoteles/{id}
export const updateHotel = async (
  input: HotelInfoInput,
  rooms: Pick<HotelRoom, 'id' | 'precioPorNoche' | 'disponible'>[],
): Promise<HotelInfo> => {
  await mockDelay();
  hotel = {
    ...hotel,
    ...input,
    rooms: hotel.rooms.map((room) => ({ ...room, ...rooms.find((r) => r.id === room.id) })),
  };
  return hotel;
};

export const getReservations = async (): Promise<HotelReservation[]> => {
  await mockDelay();
  return reservations;
};

// TODO(backend): PATCH /reservas/{id}/estado
export const updateReservationStatus = async (
  id: string,
  estado: ReservationStatus,
): Promise<HotelReservation> => {
  await mockDelay();
  const current = reservations.find((r) => r.id === id);
  if (!current) throw new Error('Reserva no encontrada');
  const updated = { ...current, estado };
  reservations = reservations.map((r) => (r.id === id ? updated : r));
  return updated;
};

/** Cantidad total de habitaciones del hotel (suma de unidades de todos los tipos). */
export const totalRoomUnits = (rooms: HotelRoom[]) =>
  rooms.reduce((total, room) => total + room.unidades, 0);

/** Noches ocupadas entre dos fechas (checkOut no cuenta: ese día se libera). */
export const occupiedNights = (reservation: HotelReservation, from: string, to: string) => {
  if (reservation.estado === 'Cancelada') return 0;
  const start = reservation.checkIn > from ? reservation.checkIn : from;
  const lastNight = format(subDays(parseISO(reservation.checkOut), 1), ISO);
  const end = lastNight < to ? lastNight : to;
  return end < start ? 0 : differenceInCalendarDays(parseISO(end), parseISO(start)) + 1;
};
