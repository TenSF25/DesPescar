import { useEffect, useState } from 'react';
import type { ReservaHotel } from '../../hotels/hotels.types';
import { getReservasLocales, getHuespedesBloqueados, toggleHuespedBloqueado } from '../../../utils/hotelLocalStore';

export interface HotelGuest {
  email: string;
  nombre: string;
  telefono?: string;
  estado: 'activo' | 'bloqueado';
  reservasRealizadas: number;
  fechaRegistro: string; // fecha de su primera reserva
}

export const useHotelGuests = (hotelId: number) => {
  const [huespedes, setHuespedes] = useState<HotelGuest[]>([]);
  const [loading, setLoading] = useState(true);
  const [bloqueados, setBloqueados] = useState<string[]>(getHuespedesBloqueados());

  useEffect(() => {
    fetch('/json/reservas-hotel.json')
      .then((res) => res.json())
      .then((estaticas: ReservaHotel[]) => {
        const locales = getReservasLocales();
        const todas = [...estaticas, ...locales].filter((r) => r.hotelId === hotelId);

        const porEmail = new Map<string, HotelGuest>();
        todas.forEach((r) => {
          const existente = porEmail.get(r.contactEmail);
          if (existente) {
            existente.reservasRealizadas += 1;
            if (r.fechaInicio < existente.fechaRegistro) existente.fechaRegistro = r.fechaInicio;
          } else {
            porEmail.set(r.contactEmail, {
              email: r.contactEmail,
              nombre: r.huespedNombre || r.contactEmail.split('@')[0],
              telefono: r.huespedTelefono,
              estado: bloqueados.includes(r.contactEmail) ? 'bloqueado' : 'activo',
              reservasRealizadas: 1,
              fechaRegistro: r.fechaInicio,
            });
          }
        });

        setHuespedes(Array.from(porEmail.values()));
      })
      .catch((e) => console.log(e))
      .finally(() => setLoading(false));
  }, [hotelId, bloqueados]);

  const toggleEstado = (email: string) => {
    setBloqueados(toggleHuespedBloqueado(email));
  };

  return { huespedes, loading, toggleEstado };
};
