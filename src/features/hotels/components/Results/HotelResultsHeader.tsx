import { Button } from '@/components/ui/Button';
import type { HotelSearchParams } from '../../hotels.types';
import { formatFechaCorta, formatHuespedes } from '../../hotelFormat';

interface Props {
  params: HotelSearchParams;
  onModificar: () => void;
}

export const HotelResultsHeader = ({ params, onModificar }: Props) => (
  <header className="bg-secondary flex w-full flex-col items-start justify-between gap-5 rounded-xl p-5 text-white sm:flex-row sm:items-center">
    <div className="flex flex-col gap-1">
      <h2 className="text-2xl font-bold">Hoteles en {params.destino || 'todos los destinos'}</h2>
      <p className="text-sm font-medium text-white/80">
        {params.checkIn && params.checkOut
          ? `${formatFechaCorta(params.checkIn)} – ${formatFechaCorta(params.checkOut)} · `
          : 'Sin fechas · '}
        {formatHuespedes(params.huespedes)}
      </p>
    </div>
    <Button
      onClick={onModificar}
      className="border-primary hover:bg-primary flex w-full items-center justify-center gap-2 rounded-[10px] border px-6 py-2.5 font-bold text-white transition-all duration-200 active:scale-95 sm:w-auto"
    >
      <span className="material-symbols-outlined text-[18px]">edit</span>
      Modificar Búsqueda
    </Button>
  </header>
);
