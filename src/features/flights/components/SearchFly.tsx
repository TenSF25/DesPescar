import { useSearchFly } from '../hooks/useSearchFly';

export const SearchFly = () => {
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
    <div className="flex h-200 w-full flex-col items-center justify-center gap-12 bg-[url(/bgSearch.webp)] bg-cover bg-center bg-no-repeat">
      <div className="flex flex-col items-center justify-center gap-6">
        <h1 className="w-max-180 w-full text-center text-2xl font-extrabold text-white sm:text-4xl md:text-6xl">
          Viajar bien empieza con una buena elección.
        </h1>
        <h3 className="text-[14px] font-semibold text-white md:text-2xl">
          "No colecciones cosas, coleccioná viajes"
        </h3>
      </div>
      <div className="mx-auto grid w-full max-w-312.5 gap-10 rounded-2xl bg-white/54 p-6 pr-8 pl-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <div className="relative flex w-full flex-col gap-2" ref={contenedorOrigenRef}>
          <label htmlFor="" className="font-semibold text-[#1F3051]/78">
            Origen
          </label>
          <div className="flex w-full flex-row items-center rounded-lg border border-black/50 bg-[#EFF0FD] p-3 text-[#75777F]">
            <span className="material-symbols-outlined">flight_land</span>
            <input
              type="text"
              name=""
              id=""
              placeholder="Ciudad o Aeropuerto"
              value={origenInput}
              className="w-full bg-transparent p-1 pl-3 font-semibold outline-none"
              onChange={(e) => {
                setOrigen(e.target.value);
                setOrigenSelect(false);
              }}
            />
          </div>
          {origenInput.trim() != '' && !origenSelect && (
            <ul className="absolute top-full z-12 w-full overflow-hidden rounded-lg border bg-white">
              <h2 className="flex items-center gap-2 p-2 text-[14px] font-bold">
                <span className="material-symbols-outlined text-[16px]!">travel</span>AEROPUERTOS
              </h2>
              {origen.map((aero) => (
                <li
                  className="cursor-pointer border-t p-2 hover:bg-black/10"
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
        <div className="relative flex w-full flex-col gap-2" ref={contenedorDestinoRef}>
          <label htmlFor="" className="font-semibold text-[#1F3051]/78">
            Destino
          </label>
          <div className="flex w-full flex-row items-center rounded-lg border border-black/50 bg-[#EFF0FD] p-3 text-[#75777F]">
            <span className="material-symbols-outlined">flight_takeoff</span>
            <input
              type="text"
              name=""
              id=""
              placeholder="¿A dónde vas?"
              className="w-full bg-transparent p-1 pl-3 font-semibold outline-none"
              value={destinoInput}
              onChange={(e) => {
                setDestino(e.target.value);
                setDestinoSelect(false);
              }}
            />
          </div>
          {destinoInput.trim() != '' && !destinoSelect && (
            <ul className="absolute top-full z-12 w-full overflow-hidden rounded-lg border bg-white">
              <h2 className="flex items-center gap-2 p-2 text-[14px] font-bold">
                <span className="material-symbols-outlined text-[16px]!">travel</span>AEROPUERTOS
              </h2>
              {destino.map((aero) => (
                <li
                  className="cursor-pointer border-t p-2 hover:bg-black/10"
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
        <div className="flex w-full flex-col gap-2">
          <label htmlFor="" className="font-semibold text-[#1F3051]/78">
            Fechas
          </label>
          <div className="flex w-full flex-row items-center rounded-lg border border-black/50 bg-[#EFF0FD] p-3 text-[#75777F]">
            <span className="material-symbols-outlined">calendar_today</span>
            <input
              type="text"
              name=""
              id=""
              placeholder="Ida y vuelta"
              className="w-full bg-transparent p-1 pl-3 font-semibold outline-none"
            />
          </div>
        </div>
        <div className="flex w-full flex-col gap-2">
          <label htmlFor="" className="font-semibold text-[#1F3051]/78">
            Pasajeros
          </label>
          <div className="flex w-full flex-row items-center rounded-lg border border-black/50 bg-[#EFF0FD] p-3 text-[#75777F]">
            <span className="material-symbols-outlined">person</span>
            <input
              type="text"
              name=""
              id=""
              placeholder="1 Adulto"
              className="w-full bg-transparent p-1 pl-3 font-semibold outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
