import { AirportSelect } from './AirportSelect';
import { DateRangePicker } from '@/components/ui/DateRangePicker';
import { useSearchFly, type ValoresIniciales } from '@/hooks/useSearchFly';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { useNavigate } from 'react-router';
import { Button } from './Button';
import { useFlightStore } from '@/store/useFlightStore';

interface moodleSearch {
  moodle: boolean;
  onClose?: () => void;
  /** Búsqueda actual (la de la URL): el formulario arranca con esos datos y el usuario cambia lo que quiera. */
  initialValues?: ValoresIniciales & { departureDate?: string; returnDate?: string };
}

/** 'YYYY-MM-DD' -> Date en hora local (new Date('YYYY-MM-DD') lo tomaría como UTC y correría un día). */
const parsearFecha = (fecha?: string) => {
  const [anio, mes, dia] = (fecha ?? '').split('-').map(Number);
  return anio && mes && dia ? new Date(anio, mes - 1, dia) : undefined;
};

export const Search = ({ moodle, onClose, initialValues }: moodleSearch) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const from = parsearFecha(initialValues?.departureDate);
    return from ? { from, to: parsearFecha(initialValues?.returnDate) } : undefined;
  });
  const [origenError, setOrigenError] = useState<string | null>();
  const [destinoError, setDestinoError] = useState<string | null>();
  const [fechaError, setFechaError] = useState<string | null>();
  const clearSearch = useFlightStore((state) => state.clearSearch);

  const { origen, destino, pasajeros, setPasajeros } = useSearchFly(initialValues);

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

    if (!origen.seleccionado) {
      setOrigenError('Por favor, elegí un aeropuerto de origen de la lista.');
      errores = true;
    } else {
      setOrigenError(null);
    }

    if (!destino.seleccionado) {
      setDestinoError('Por favor, elegí un aeropuerto de destino de la lista.');
      errores = true;
    } else {
      setDestinoError(null);
    }

    if (errores) return;

    const formatedDateDeparture = formatearFechaAString(dateRange!.from!);
    const formatedDateReturn = dateRange!.to ? formatearFechaAString(dateRange!.to) : '';

    clearSearch();

    navigate(
      `/vuelos?origin=${origen.seleccionado!.code}&destination=${destino.seleccionado!.code}&passengers=${pasajeros}&departureDate=${formatedDateDeparture}${formatedDateReturn ? `&returnDate=${formatedDateReturn}` : ''}`,
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
        <AirportSelect
          id="origen-input"
          label="Origen"
          icon="flight_takeoff"
          texto={origen.texto}
          abierto={origen.abierto}
          opciones={origen.opciones}
          error={origenError}
          onFocus={origen.abrir}
          onChange={(valor) => {
            origen.escribir(valor);
            setOrigenError(null);
          }}
          onSelect={(aero) => {
            origen.seleccionar(aero);
            setOrigenError(null);
          }}
          onClose={origen.cerrar}
        />

        <AirportSelect
          id="destino-input"
          label="Destino"
          icon="flight_land"
          texto={destino.texto}
          abierto={destino.abierto}
          opciones={destino.opciones}
          error={destinoError}
          onFocus={destino.abrir}
          onChange={(valor) => {
            destino.escribir(valor);
            setDestinoError(null);
          }}
          onSelect={(aero) => {
            destino.seleccionar(aero);
            setDestinoError(null);
          }}
          onClose={destino.cerrar}
        />

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
