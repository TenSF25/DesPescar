import { Input } from './Input';
import { DateRangePicker } from '@/components/ui/DateRangePicker';
import { useSearchFly } from '@/hooks/useSearchFly';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { useNavigate } from 'react-router';
import { Button } from './Button';
import { useFlightStore } from '@/store/useFlightStore';

interface moodleSearch {
  moodle: boolean;
  onClose?: () => void;
}

export const Search = ({ moodle, onClose }: moodleSearch) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [origenError, setOrigenError] = useState<string | null>();
  const [destinoError, setDestinoError] = useState<string | null>();
  const [fechaError, setFechaError] = useState<string | null>();
  const clearSearch = useFlightStore((state) => state.clearSearch);

  const {
    setOrigen,
    setDestino,
    origenSelect,
    origenInput,
    destinoSelect,
    destinoInput,
    origenSeleccionado,
    destinoSeleccionado,
    setOrigenSelect,
    setDestinoSelect,
    origen,
    destino,
    seleccionarOrigen,
    seleccionarDestino,
    setPasajeros,
    pasajeros,
    contenedorDestinoRef,
    contenedorOrigenRef,
  } = useSearchFly();

  const navigate = useNavigate();

  const formatearFechaAString = (date: Date): string => {
    const anio = date.getFullYear();
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const dia = String(date.getDate()).padStart(2, '0');

    return `${anio}-${mes}-${dia}`;
  };

  const submitForm = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    let errores = false;

    if (!dateRange || !dateRange.from) {
      setFechaError('Por favor, seleccione una fecha.');
      errores = true;
    } else {
      setFechaError(null);
    }

    if (origenInput.trim() === '') {
      setOrigenError('Por favor, ingrese un origen.');
      errores = true;
    } else {
      setOrigenError(null);
    }

    if (!destinoInput.trim()) {
      setDestinoError('Por favor, ingrese un destino.');
      errores = true;
    } else {
      setDestinoError(null);
    }

    if (!origenSeleccionado) {
      setOrigenError('Seleccione un aeropuerto de origen.');
      errores = true;
    }

    if (!destinoSeleccionado) {
      setDestinoError('Seleccione un aeropuerto de destino.');
      errores = true;
    }

    if (errores) return;

    const formatedDateDeparture = formatearFechaAString(dateRange!.from!);
    const formatedDateReturn = formatearFechaAString(dateRange!.to!);

    clearSearch();

    navigate(
      `/vuelos?origin=${origenSeleccionado.code}&destination=${destinoSeleccionado.code}&passengers=${pasajeros}&departureDate=${formatedDateDeparture}&returnDate=${formatedDateReturn}`,
    );
    if (moodle && onClose) {
      onClose();
    }
  };

  return (
    <form
      onSubmit={submitForm}
      className="@container relative z-40 mx-auto flex w-full flex-col rounded-3xl border border-white/20 bg-black/40 p-3 text-white shadow-2xl backdrop-blur-xl sm:p-5 @xs:p-4"
    >
      <div className="grid w-full grid-cols-1 gap-3 @md:grid-cols-2 @xl:grid-cols-[1fr_1fr_1fr_1fr_0.5fr]">
        <div className="relative flex w-full flex-col" ref={contenedorOrigenRef}>
          <Input
            id="origen-input"
            icon="flight_takeoff"
            label="Origen"
            value={origenInput}
            onChange={(e) => {
              setOrigen(e.target.value);
              setOrigenSelect(false);
              if (e.target.value.trim() !== '') setOrigenError(null);
            }}
            className="h-16"
            error={origenError || undefined}
          />
          {origenInput.trim() !== '' && !origenSelect && origen.length > 0 && (
            <ul className="absolute top-[calc(100%+8px)] z-50 flex max-h-56 w-full flex-col overflow-y-auto rounded-xl border border-white/10 bg-slate-900/95 text-white shadow-xl backdrop-blur-xl">
              <li className="sticky top-0 z-10 flex items-center gap-2 bg-slate-900/95 p-3 text-[11px] font-bold tracking-wider text-white/50 uppercase backdrop-blur-md">
                <span className="material-symbols-outlined text-[16px]">travel</span> Aeropuertos
              </li>
              {origen.map((aero) => (
                <li
                  key={aero.id}
                  className="cursor-pointer border-t border-white/5 p-3 text-sm transition-colors hover:bg-white/10"
                  onClick={() => {
                    seleccionarOrigen(aero);
                    setOrigenError(null);
                  }}
                >
                  {aero.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="relative flex w-full flex-col" ref={contenedorDestinoRef}>
          <Input
            id="destino-input"
            icon="flight_land"
            label="Destino"
            value={destinoInput}
            onChange={(e) => {
              setDestino(e.target.value);
              setDestinoSelect(false);
              if (e.target.value.trim() !== '') setDestinoError(null);
            }}
            className="h-16"
            error={destinoError || undefined}
          />
          {destinoInput.trim() !== '' && !destinoSelect && destino.length > 0 && (
            <ul className="absolute top-[calc(100%+8px)] z-50 flex max-h-56 w-full flex-col overflow-y-auto rounded-xl border border-white/10 bg-slate-900/95 text-white shadow-xl backdrop-blur-xl">
              <li className="sticky top-0 z-10 flex items-center gap-2 bg-slate-900/95 p-3 text-[11px] font-bold tracking-wider text-white/50 uppercase backdrop-blur-md">
                <span className="material-symbols-outlined text-[16px]">travel</span> Aeropuertos
              </li>
              {destino.map((aero) => (
                <li
                  key={aero.id}
                  className="cursor-pointer border-t border-white/5 p-3 text-sm transition-colors hover:bg-white/10"
                  onClick={() => {
                    seleccionarDestino(aero);
                    setDestinoError(null);
                  }}
                >
                  {aero.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="relative flex w-full min-w-0 flex-col gap-1">
          <DateRangePicker
            range={dateRange}
            onRangeChange={(range) => {
              setDateRange(range);
              if (range?.from) setFechaError(null);
            }}
            error={!!fechaError}
          />

          {fechaError && (
            <span className="animate-fade-in mt-1 flex items-center gap-1 pl-2 text-[11px] font-semibold tracking-wide text-red-400">
              {fechaError}
            </span>
          )}
        </div>

        <div className="relative flex w-full flex-col">
          <div className="group flex h-16 w-full flex-col items-center justify-center gap-1 rounded-xl border border-white/10 bg-black/20 p-2 transition-colors duration-200 focus-within:border-white/40 focus-within:bg-white/10 @xs:flex-row @xs:justify-between @xs:px-3">
            <div className="flex items-center gap-2 @xs:gap-3">
              <span className="material-symbols-outlined shrink-0 text-[22px] text-white/50 transition-colors duration-200 group-focus-within:text-white">
                person
              </span>
              <div className="hidden flex-col pt-1.5 @xs:flex">
                <span className="text-[11px] font-bold tracking-wider text-white/50 uppercase transition-colors duration-200 group-focus-within:text-white/70">
                  Pasajeros
                </span>
                <span className="text-[15px] font-semibold text-white">
                  {pasajeros} {pasajeros === 1 ? 'Pasajero' : 'Pasajeros'}
                </span>
              </div>
              <span className="text-[15px] font-bold text-white @xs:hidden">{pasajeros}</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPasajeros(Math.max(1, pasajeros - 1))}
                className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white transition-all hover:bg-white/20 active:scale-95 @xs:h-7 @xs:w-7 @xs:text-base"
              >
                -
              </button>
              <button
                type="button"
                onClick={() => setPasajeros(Math.min(9, pasajeros + 1))}
                className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white transition-all hover:bg-white/20 active:scale-95 @xs:h-7 @xs:w-7 @xs:text-base"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          className={`group col-span-1 flex h-16 w-full items-center justify-center gap-2 rounded-xl bg-[#FF6B00] text-white transition-all hover:bg-[#FF6B00]/90 ${moodle ? '@md:col-span-1 @xl:col-span-1' : '@md:col-span-2 @xl:col-span-1'}`}
        >
          <span className="material-symbols-outlined text-[24px] transition-transform duration-300 ease-in-out group-hover:rotate-12 group-active:rotate-12">
            search
          </span>
          <span className="font-bold">Buscar</span>
        </Button>

        {moodle && (
          <Button
            variant="danger"
            type="button"
            onClick={onClose}
            className="group col-span-1 flex h-16 w-full items-center justify-center gap-2 rounded-xl text-white transition-all @md:col-span-1 @xl:col-span-1"
          >
            <span className="font-bold">Cancelar</span>
          </Button>
        )}
      </div>
    </form>
  );
};
