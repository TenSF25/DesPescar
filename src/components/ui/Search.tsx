import type { HTMLAttributes } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchFly } from '../../hooks/useSearchFly';
import { cn } from '../../utils/cn';
import { Button } from './Button';

export const Search = ({ className }: HTMLAttributes<HTMLDivElement>) => {
  const navigate = useNavigate();
  const {
    setOrigen,
    setDestino,
    origenSelect,
    origenInput,
    destinoSelect,
    destinoInput,
    setOrigenSelect,
    setDestinoSelect,
    origen,
    destino,
    contenedorDestinoRef,
    contenedorOrigenRef,
  } = useSearchFly();

  return (
    <div className="mx-auto flex w-full max-w-312 flex-col gap-4 rounded-[30px] border border-white/20 bg-white/15 p-6 text-white shadow-2xl backdrop-blur-[25px]">
      <div
        className={cn(
          'mx-auto grid w-full gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
          className,
        )}
      >
        <div className="relative flex w-full flex-col pt-2" ref={contenedorOrigenRef}>
          <label
            htmlFor=""
            className="absolute -top-1 left-4 z-10 rounded border border-white/10 bg-white/20 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-white uppercase backdrop-blur-md"
          >
            Origen
          </label>
          <div className="flex w-full flex-row items-center rounded-xl border border-white/10 bg-black/15 p-3 text-white/70 focus-within:border-white/30">
            <span className="material-symbols-outlined text-[20px]">flight_takeoff</span>
            <input
              type="text"
              name=""
              id=""
              placeholder="Ciudad o Aeropuerto"
              value={origenInput}
              className="w-full bg-transparent p-1 pl-3 font-semibold text-white outline-none placeholder:text-white/40"
              onChange={(e) => {
                setOrigen(e.target.value);
                setOrigenSelect(false);
              }}
            />
          </div>
          {origenInput.trim() != '' && !origenSelect && (
            <ul className="absolute top-[calc(100%+8px)] z-20 w-full overflow-hidden rounded-xl border border-white/10 bg-slate-900/90 text-white shadow-xl backdrop-blur-xl">
              <h2 className="flex items-center gap-2 p-3 text-[12px] font-bold tracking-wider text-white/50">
                <span className="material-symbols-outlined text-[16px]!">travel</span>AEROPUERTOS
              </h2>
              {origen.map((aero) => (
                <li
                  className="cursor-pointer border-t border-white/5 p-3 text-sm transition-colors hover:bg-white/10"
                  onClick={() => {
                    setOrigen(aero.nombre);
                    setOrigenSelect(true);
                  }}
                  key={aero.id}
                >
                  {aero.nombre}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="relative flex w-full flex-col pt-2" ref={contenedorDestinoRef}>
          <label
            htmlFor=""
            className="absolute -top-1 left-4 z-10 rounded border border-white/10 bg-white/20 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-white uppercase backdrop-blur-md"
          >
            Destino
          </label>
          <div className="flex w-full flex-row items-center rounded-xl border border-white/10 bg-black/15 p-3 text-white/70 focus-within:border-white/30">
            <span className="material-symbols-outlined text-[20px]">flight_land</span>
            <input
              type="text"
              name=""
              id=""
              placeholder="¿A dónde vas?"
              className="w-full bg-transparent p-1 pl-3 font-semibold text-white outline-none placeholder:text-white/40"
              value={destinoInput}
              onChange={(e) => {
                setDestino(e.target.value);
                setDestinoSelect(false);
              }}
            />
          </div>
          {destinoInput.trim() != '' && !destinoSelect && (
            <ul className="absolute top-[calc(100%+8px)] z-20 w-full overflow-hidden rounded-xl border border-white/10 bg-slate-900/90 text-white shadow-xl backdrop-blur-xl">
              <h2 className="flex items-center gap-2 p-3 text-[12px] font-bold tracking-wider text-white/50">
                <span className="material-symbols-outlined text-[16px]!">travel</span>AEROPUERTOS
              </h2>
              {destino.map((aero) => (
                <li
                  className="cursor-pointer border-t border-white/5 p-3 text-sm transition-colors hover:bg-white/10"
                  onClick={() => {
                    setDestino(aero.nombre);
                    setDestinoSelect(true);
                  }}
                  key={aero.id}
                >
                  {aero.nombre}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="relative flex w-full flex-col pt-2">
          <label
            htmlFor=""
            className="absolute -top-1 left-4 z-10 rounded border border-white/10 bg-white/20 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-white uppercase backdrop-blur-md"
          >
            Fechas
          </label>
          <div className="flex w-full flex-row items-center rounded-xl border border-white/10 bg-black/15 p-3 text-white/70 focus-within:border-white/30">
            <span className="material-symbols-outlined text-[20px]">calendar_today</span>
            <input
              type="text"
              name=""
              id=""
              placeholder="Ida y vuelta"
              className="w-full bg-transparent p-1 pl-3 font-semibold text-white outline-none placeholder:text-white/40"
            />
          </div>
        </div>

        <div className="relative flex w-full flex-col pt-2">
          <label
            htmlFor=""
            className="absolute -top-1 left-4 z-10 rounded border border-white/10 bg-white/20 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-white uppercase backdrop-blur-md"
          >
            Pasajeros
          </label>
          <div className="flex w-full flex-row items-center rounded-xl border border-white/10 bg-black/15 p-3 text-white/70 focus-within:border-white/30">
            <span className="material-symbols-outlined text-[20px]">person</span>
            <input
              type="text"
              name=""
              id=""
              placeholder="1 Adulto"
              className="w-full bg-transparent p-1 pl-3 font-semibold text-white outline-none placeholder:text-white/40"
            />
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col gap-4 lg:flex-row lg:justify-between">
        <div className="flex items-center gap-20 lg:justify-between lg:gap-4">
          <label htmlFor="directo" className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              name="directo"
              id="directo"
              className="accent-primary h-4 w-4 cursor-pointer rounded border border-white/20 bg-black/20"
            />
            <span>Vuelos Directos</span>
          </label>
          <label htmlFor="fechas" className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              name="fechas"
              id="fechas"
              className="accent-primary h-4 w-4 cursor-pointer rounded border border-white/20 bg-black/20"
            />
            <span>Flexibilidad de Fechas</span>
          </label>
        </div>
        <Button
          className="bg-primary text-white lg:w-60"
          onClick={() => navigate('/vuelos/resultados')}
        >
          <span className="material-symbols-outlined">search</span> Buscar Vuelos
        </Button>
      </div>
    </div>
  );
};
