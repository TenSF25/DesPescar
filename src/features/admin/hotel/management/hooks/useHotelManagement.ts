import { useEffect, useState } from 'react';
import { getHotel, updateHotel, type HotelInfoInput } from '../../shared/hotelService';
import type { HotelInfo, HotelRoom } from '../../shared/hotel.types';

type RoomDraft = Pick<HotelRoom, 'id' | 'precioPorNoche' | 'disponible'>;

const toForm = (hotel: HotelInfo): HotelInfoInput => ({
  nombre: hotel.nombre,
  ciudad: hotel.ciudad,
  pais: hotel.pais,
  tipo: hotel.tipo,
  estrellas: hotel.estrellas,
  activo: hotel.activo,
});

const toRoomDrafts = (hotel: HotelInfo): RoomDraft[] =>
  hotel.rooms.map(({ id, precioPorNoche, disponible }) => ({ id, precioPorNoche, disponible }));

export const useHotelManagement = () => {
  const [hotel, setHotel] = useState<HotelInfo | null>(null);
  const [form, setForm] = useState<HotelInfoInput | null>(null);
  const [rooms, setRooms] = useState<RoomDraft[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      const data = await getHotel();
      if (!isMounted) return;
      setHotel(data);
      setForm(toForm(data));
      setRooms(toRoomDrafts(data));
      setIsLoading(false);
    };

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const updateField = <K extends keyof HotelInfoInput>(field: K, value: HotelInfoInput[K]) => {
    setForm((prev) => (prev ? { ...prev, [field]: value } : prev));
    setSaved(false);
  };

  const updateRoom = (id: number, changes: Partial<Omit<RoomDraft, 'id'>>) => {
    setRooms((prev) => prev.map((room) => (room.id === id ? { ...room, ...changes } : room)));
    setSaved(false);
  };

  const hasChanges =
    !!hotel &&
    !!form &&
    (JSON.stringify(form) !== JSON.stringify(toForm(hotel)) ||
      JSON.stringify(rooms) !== JSON.stringify(toRoomDrafts(hotel)));

  const handleSave = async () => {
    if (!form) return;
    setIsSaving(true);
    const updated = await updateHotel(form, rooms);
    setHotel(updated);
    setForm(toForm(updated));
    setRooms(toRoomDrafts(updated));
    setIsSaving(false);
    setSaved(true);
  };

  const handleDiscard = () => {
    if (!hotel) return;
    setForm(toForm(hotel));
    setRooms(toRoomDrafts(hotel));
    setSaved(false);
  };

  return {
    hotel,
    form,
    rooms,
    isLoading,
    isSaving,
    saved,
    hasChanges,
    updateField,
    updateRoom,
    handleSave,
    handleDiscard,
  };
};
