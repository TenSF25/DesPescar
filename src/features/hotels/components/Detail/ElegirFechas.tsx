import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { DateRangePicker } from '@/components/ui/DateRangePicker';
import type { HotelSearchParams } from '../../hotels.types';
import { MAX_HUESPEDES, buildHotelSearchQuery, toIsoDate } from '../../hotelSearchParams';

interface Props {
  params: HotelSearchParams;
  onBuscar: (query: string) => void;
}

/** Para entrar al detalle sin fechas: pide check-in, check-out y huéspedes antes de cotizar. */
export const ElegirFechas = ({ params, onBuscar }: Props) => {
  const [range, setRange] = useState<DateRange | undefined>();
  const [huespedes, setHuespedes] = useState(params.huespedes);
  const listo = Boolean(range?.from && range?.to);

  return (
    <div className="bg-secondary flex flex-col gap-4 rounded-2xl p-5 text-white">
      <p className="font-semibold">Elegí tus fechas para ver disponibilidad y precios</p>
      <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
        <DateRangePicker
          range={range}
          onRangeChange={setRange}
          error={false}
          labels={{ desde: 'Check-in', hasta: 'Check-out' }}
        />
        <select
          aria-label="Huéspedes"
          value={huespedes}
          onChange={(e) => setHuespedes(Number(e.target.value))}
          className="h-16 rounded-xl border border-white/10 bg-black/20 px-4 font-semibold"
        >
          {Array.from({ length: MAX_HUESPEDES }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n} className="text-secondary">
              {n} {n === 1 ? 'huésped' : 'huéspedes'}
            </option>
          ))}
        </select>
        <button
          type="button"
          disabled={!listo}
          onClick={() =>
            range?.from &&
            range.to &&
            onBuscar(
              buildHotelSearchQuery({
                ...params,
                checkIn: toIsoDate(range.from),
                checkOut: toIsoDate(range.to),
                huespedes,
              }),
            )
          }
          className="h-16 cursor-pointer rounded-xl bg-[#FF6B00] px-6 font-bold disabled:cursor-not-allowed disabled:opacity-50"
        >
          Ver disponibilidad
        </button>
      </div>
    </div>
  );
};
