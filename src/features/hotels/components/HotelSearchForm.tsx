import { useEffect, useRef, useState, type FormEvent } from 'react';
import type { DateRange } from 'react-day-picker';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/Button';
import { DateRangePicker } from '@/components/ui/DateRangePicker';
import { Input } from '@/components/ui/Input';
import { useDestinos } from '../hooks/useDestinos';
import type { HotelSearchParams } from '../hotels.types';
import {
  HUESPEDES_POR_DEFECTO,
  MAX_HUESPEDES,
  buildHotelsUrl,
  fromIsoDate,
  toIsoDate,
  validarRangoEstadia,
} from '../hotelSearchParams';

interface HotelSearchFormProps {
  initial?: HotelSearchParams;
  /** true dentro del modal "Modificar búsqueda": suma el botón Cancelar. */
  modal?: boolean;
  onClose?: () => void;
}

export const HotelSearchForm = ({ initial, modal = false, onClose }: HotelSearchFormProps) => {
  const navigate = useNavigate();
  const [destino, setDestino] = useState(initial?.destino ?? '');
  const [elegido, setElegido] = useState(Boolean(initial?.destino));
  const [range, setRange] = useState<DateRange | undefined>(
    initial?.checkIn && initial.checkOut
      ? { from: fromIsoDate(initial.checkIn), to: fromIsoDate(initial.checkOut) }
      : undefined,
  );
  const [huespedes, setHuespedes] = useState(initial?.huespedes ?? HUESPEDES_POR_DEFECTO);
  const [destinoError, setDestinoError] = useState<string | null>(null);
  const [fechaError, setFechaError] = useState<string | null>(null);
  const { sugerencias } = useDestinos(elegido ? '' : destino);
  const contenedorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cerrar = (e: MouseEvent) => {
      if (contenedorRef.current && !contenedorRef.current.contains(e.target as Node))
        setElegido(true);
    };
    document.addEventListener('mousedown', cerrar);
    return () => document.removeEventListener('mousedown', cerrar);
  }, []);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const sinDestino = destino.trim() === '';
    const sinFechas = !range?.from || !range?.to;
    setDestinoError(sinDestino ? 'Elegí un destino' : null);
    if (sinDestino || sinFechas || !range?.from || !range?.to) {
      setFechaError(sinFechas ? 'Elegí check-in y check-out' : null);
      return;
    }
    const errorRango = validarRangoEstadia(range.from, range.to);
    setFechaError(errorRango);
    if (errorRango) return;

    navigate(
      buildHotelsUrl({
        destino: destino.trim(),
        checkIn: toIsoDate(range.from),
        checkOut: toIsoDate(range.to),
        huespedes,
      }),
    );
    onClose?.();
  };

  return (
    <form
      onSubmit={submit}
      className="@container relative z-40 mx-auto flex w-full flex-col rounded-3xl border border-white/20 bg-black/40 p-3 text-white shadow-2xl backdrop-blur-xl sm:p-5 @xs:p-4"
    >
      <div className="grid w-full grid-cols-1 gap-3 @md:grid-cols-2 @xl:grid-cols-[1.4fr_1.6fr_1fr_0.6fr]">
        <div className="relative flex w-full flex-col" ref={contenedorRef}>
          <Input
            id="destino-hotel"
            icon="location_on"
            label="Destino"
            value={destino}
            onChange={(e) => {
              setDestino(e.target.value);
              setElegido(false);
              if (e.target.value.trim() !== '') setDestinoError(null);
            }}
            className="h-16"
            error={destinoError || undefined}
          />
          {sugerencias.length > 0 && (
            <ul className="absolute top-[calc(100%+8px)] z-50 flex max-h-56 w-full flex-col overflow-y-auto rounded-xl border border-white/10 bg-slate-900/95 text-white shadow-xl backdrop-blur-xl">
              <li className="sticky top-0 z-10 flex items-center gap-2 bg-slate-900/95 p-3 text-[11px] font-bold tracking-wider text-white/50 uppercase backdrop-blur-md">
                <span className="material-symbols-outlined text-[16px]">apartment</span> Destinos
              </li>
              {sugerencias.map((d) => (
                <li
                  key={`${d.ciudad}-${d.pais}`}
                  className="cursor-pointer border-t border-white/5 p-3 text-sm transition-colors hover:bg-white/10"
                  onClick={() => {
                    setDestino(d.ciudad);
                    setElegido(true);
                    setDestinoError(null);
                  }}
                >
                  {d.ciudad}, <span className="text-white/60">{d.pais}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="relative flex w-full min-w-0 flex-col gap-1">
          <DateRangePicker
            range={range}
            onRangeChange={(r) => {
              setRange(r);
              if (r?.from && r?.to) setFechaError(null);
            }}
            error={Boolean(fechaError)}
            labels={{ desde: 'Check-in', hasta: 'Check-out' }}
          />
          {fechaError && (
            <span className="pl-2 text-[11px] font-semibold tracking-wide text-red-400">
              {fechaError}
            </span>
          )}
        </div>

        <div className="flex h-16 items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold tracking-wider text-white/50 uppercase">
              Huéspedes
            </span>
            <span className="font-semibold">
              {huespedes} {huespedes === 1 ? 'huésped' : 'huéspedes'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Menos huéspedes"
              onClick={() => setHuespedes(Math.max(1, huespedes - 1))}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-white/10 font-bold transition-all hover:bg-white/20 active:scale-95"
            >
              −
            </button>
            <button
              type="button"
              aria-label="Más huéspedes"
              onClick={() => setHuespedes(Math.min(MAX_HUESPEDES, huespedes + 1))}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-white/10 font-bold transition-all hover:bg-white/20 active:scale-95"
            >
              +
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="group flex h-16 w-full items-center justify-center gap-2 rounded-xl bg-[#FF6B00] text-white transition-all hover:bg-[#FF6B00]/90 @md:col-span-2 @xl:col-span-1"
        >
          <span className="material-symbols-outlined text-[24px] transition-transform duration-300 group-hover:rotate-12">
            search
          </span>
          <span className="font-bold">Buscar</span>
        </Button>

        {modal && (
          <Button
            variant="danger"
            type="button"
            onClick={onClose}
            className="flex h-16 w-full items-center justify-center rounded-xl text-white @md:col-span-2 @xl:col-span-4"
          >
            <span className="font-bold">Cancelar</span>
          </Button>
        )}
      </div>
    </form>
  );
};
