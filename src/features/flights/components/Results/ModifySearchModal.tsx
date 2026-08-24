import { useSearchFly } from '../../../../hooks/useSearchFly';
import { Button } from '../../../../components/ui/Button';
import type { Aeropuerto } from '../../../../types/Interfaces';

interface ValoresBusqueda {
  origen: Aeropuerto | null;
  destino: Aeropuerto | null;
  fecha: string;
  pasajeros: number;
}

interface ModifySearchModalProps {
  valoresIniciales: ValoresBusqueda;
  onCerrar: () => void;
  onBuscar: (valores: ValoresBusqueda) => void;
}

export const ModifySearchModal = ({
  valoresIniciales,
  onCerrar,
  onBuscar,
}: ModifySearchModalProps) => {
  const {
    origen,
    destino,
    origenInput,
    destinoInput,
    origenSelect,
    destinoSelect,
    setOrigen,
    setDestino,
    setOrigenSelect,
    setDestinoSelect,
    origenSeleccionado,
    destinoSeleccionado,
    seleccionarOrigen,
    seleccionarDestino,
    fecha,
    setFecha,
    pasajeros,
    setPasajeros,
    contenedorOrigenRef,
    contenedorDestinoRef,
  } = useSearchFly(valoresIniciales);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onCerrar}
    >
      <div
        className="flex w-full max-w-2xl flex-col gap-5 rounded-2xl bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-secondary text-lg font-bold">Modificar búsqueda</h2>
          <button type="button" onClick={onCerrar} className="hover:text-secondary text-[#44474E]">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="relative flex flex-col gap-1" ref={contenedorOrigenRef}>
            <label className="text-secondary text-xs font-semibold">Origen</label>
            <div className="flex items-center gap-2 rounded-xl border border-black/15 p-3">
              <span className="material-symbols-outlined text-secondary text-[20px]">
                flight_takeoff
              </span>
              <input
                type="text"
                value={origenInput}
                placeholder="Ciudad o Aeropuerto"
                className="w-full outline-none"
                onChange={(e) => {
                  setOrigen(e.target.value);
                  setOrigenSelect(false);
                }}
              />
            </div>
            {origenInput.trim() !== '' && !origenSelect && (
              <ul className="absolute top-[calc(100%+4px)] z-10 max-h-48 w-full overflow-auto rounded-xl border border-black/10 bg-white shadow-xl">
                {origen.map((aero) => (
                  <li
                    key={aero.id}
                    className="cursor-pointer border-t border-black/5 p-3 text-sm hover:bg-black/5"
                    onClick={() => seleccionarOrigen(aero)}
                  >
                    {aero.nombre}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="relative flex flex-col gap-1" ref={contenedorDestinoRef}>
            <label className="text-secondary text-xs font-semibold">Destino</label>
            <div className="flex items-center gap-2 rounded-xl border border-black/15 p-3">
              <span className="material-symbols-outlined text-secondary text-[20px]">
                flight_land
              </span>
              <input
                type="text"
                value={destinoInput}
                placeholder="¿A dónde vas?"
                className="w-full outline-none"
                onChange={(e) => {
                  setDestino(e.target.value);
                  setDestinoSelect(false);
                }}
              />
            </div>
            {destinoInput.trim() !== '' && !destinoSelect && (
              <ul className="absolute top-[calc(100%+4px)] z-10 max-h-48 w-full overflow-auto rounded-xl border border-black/10 bg-white shadow-xl">
                {destino.map((aero) => (
                  <li
                    key={aero.id}
                    className="cursor-pointer border-t border-black/5 p-3 text-sm hover:bg-black/5"
                    onClick={() => seleccionarDestino(aero)}
                  >
                    {aero.nombre}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-secondary text-xs font-semibold">Fecha</label>
            <div className="flex items-center gap-2 rounded-xl border border-black/15 p-3">
              <span className="material-symbols-outlined text-secondary text-[20px]">
                calendar_today
              </span>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-secondary text-xs font-semibold">Pasajeros</label>
            <div className="flex items-center justify-between gap-2 rounded-xl border border-black/15 p-3">
              <span className="font-semibold">
                {pasajeros} {pasajeros === 1 ? 'pasajero' : 'pasajeros'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPasajeros(Math.max(1, pasajeros - 1))}
                  className="border-secondary text-secondary flex h-7 w-7 items-center justify-center rounded-full border"
                >
                  −
                </button>
                <button
                  type="button"
                  onClick={() => setPasajeros(Math.min(9, pasajeros + 1))}
                  className="border-secondary text-secondary flex h-7 w-7 items-center justify-center rounded-full border"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        <Button
          variant="primary"
          className="w-full"
          onClick={() =>
            onBuscar({
              origen: origenSeleccionado,
              destino: destinoSeleccionado,
              fecha,
              pasajeros,
            })
          }
        >
          Buscar Vuelos
        </Button>
      </div>
    </div>
  );
};
