import type { FormEvent } from 'react';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';

interface SearchHotelProps {
  destino: string;
  setDestino: (valor: string) => void;
  checkIn: string;
  setCheckIn: (valor: string) => void;
  checkOut: string;
  setCheckOut: (valor: string) => void;
  huespedes: number;
  setHuespedes: (valor: number) => void;
  onBuscar: () => void;
}

export const SearchHotel = ({
  destino,
  setDestino,
  checkIn,
  setCheckIn,
  checkOut,
  setCheckOut,
  huespedes,
  setHuespedes,
  onBuscar,
}: SearchHotelProps) => {
  const manejarSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onBuscar();
  };

  return (
    <form
      onSubmit={manejarSubmit}
      className="mx-auto flex w-full max-w-312 flex-col gap-4 rounded-[30px] border bg-[#fdfdff] p-6 shadow-2xl"
    >
      <h2 className="text-secondary text-xl font-bold">
        Encuentra tu hotel ideal al mejor precio
      </h2>
      <div className="grid w-full gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Input
          contentLabel="Destino / País / Hotel"
          placeholder="Barcelona, España o Hotel Mediterráneo"
          value={destino}
          onChange={(e) => setDestino(e.target.value)}
        />
        <div className="grid grid-cols-2 gap-2">
          <Input
            contentLabel="Check-in"
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
          />
          <Input
            contentLabel="Check-out"
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
          />
        </div>
        <Input
          contentLabel="Huéspedes"
          type="number"
          min={1}
          value={huespedes}
          onChange={(e) => setHuespedes(Number(e.target.value) || 1)}
        />
        <Button type="submit" variant="primary" className="mt-8 w-full bg-primary text-white">
          <span className="material-symbols-outlined">search</span> Buscar Hoteles
        </Button>
      </div>
    </form>
  );
};
