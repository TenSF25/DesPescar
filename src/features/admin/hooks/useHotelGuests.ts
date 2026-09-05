import { useEffect, useState } from 'react';

export interface HotelGuest {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  hotelId: number;
  estado: 'activo' | 'bloqueado';
  reservasRealizadas: number;
  fechaRegistro: string; // ISO
}

export const useHotelGuests = (hotelId: number) => {
  const [huespedes, setHuespedes] = useState<HotelGuest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/json/huespedes-hotel.json')
      .then((res) => res.json())
      .then((data: HotelGuest[]) => setHuespedes(data))
      .catch((e) => console.log(e))
      .finally(() => setLoading(false));
  }, []);

  // Sin backend todavía: alta/baja solo en memoria.
  const toggleEstado = (id: number) => {
    setHuespedes((prev) =>
      prev.map((h) =>
        h.id === id ? { ...h, estado: h.estado === 'activo' ? 'bloqueado' : 'activo' } : h,
      ),
    );
  };

  const huespedesDelHotel = huespedes.filter((h) => h.hotelId === hotelId);

  return { huespedes: huespedesDelHotel, loading, toggleEstado };
};
