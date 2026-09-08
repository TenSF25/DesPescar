import type { Hotel, ReservaHotel } from '../features/hotels/hotels.types';

const KEY_HOTELES = 'despescar_hoteles_registrados';
const KEY_RESERVAS = 'despescar_reservas_locales';
const KEY_MI_HOTEL = 'despescar_mi_hotel_id';
const KEY_CONTADOR = 'despescar_contador_ids';
const KEY_BLOQUEADOS = 'despescar_huespedes_bloqueados';

// Los datos "de fábrica" (hoteles.json / reservas-hotel.json) usan ids bajos
// (1-6 y 1-10). Todo lo creado acá arranca en 1000 para no pisarlos nunca.
const ID_INICIAL = 1000;

const leer = <T>(key: string, porDefecto: T): T => {
  try {
    const valor = localStorage.getItem(key);
    return valor ? JSON.parse(valor) : porDefecto;
  } catch {
    return porDefecto;
  }
};

const siguienteId = (): number => {
  const actual = Number(localStorage.getItem(KEY_CONTADOR) ?? ID_INICIAL);
  localStorage.setItem(KEY_CONTADOR, String(actual + 1));
  return actual;
};

// ---------- Hoteles registrados ----------

export const getHotelesRegistrados = (): Hotel[] => leer(KEY_HOTELES, []);

export const guardarHotelRegistrado = (hotel: Omit<Hotel, 'id'>): Hotel => {
  const nuevo: Hotel = { ...hotel, id: siguienteId() };
  const actuales = getHotelesRegistrados();
  localStorage.setItem(KEY_HOTELES, JSON.stringify([...actuales, nuevo]));
  setMiHotelId(nuevo.id);
  return nuevo;
};

// ---------- Reservas hechas contra cualquier hotel (de fábrica o registrado) ----------

export const getReservasLocales = (): ReservaHotel[] => leer(KEY_RESERVAS, []);

export const guardarReservaLocal = (reserva: Omit<ReservaHotel, 'id'>): ReservaHotel => {
  const nueva: ReservaHotel = { ...reserva, id: siguienteId() };
  const actuales = getReservasLocales();
  localStorage.setItem(KEY_RESERVAS, JSON.stringify([...actuales, nueva]));
  return nueva;
};

// ---------- "Cuál es mi hotel" (simula la sesión hasta que exista login real) ----------

export const getMiHotelId = (): number => Number(localStorage.getItem(KEY_MI_HOTEL) ?? 1);

export const setMiHotelId = (id: number) => localStorage.setItem(KEY_MI_HOTEL, String(id));

// ---------- Huéspedes bloqueados (por email, ya que no tienen id numérico propio) ----------

export const getHuespedesBloqueados = (): string[] => leer(KEY_BLOQUEADOS, []);

export const toggleHuespedBloqueado = (email: string): string[] => {
  const actuales = getHuespedesBloqueados();
  const nuevos = actuales.includes(email)
    ? actuales.filter((e) => e !== email)
    : [...actuales, email];
  localStorage.setItem(KEY_BLOQUEADOS, JSON.stringify(nuevos));
  return nuevos;
};
