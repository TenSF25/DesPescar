import { useRef, useState } from 'react';
import { Section } from '../../../components/ui/Section';
import { Button } from '../../../components/ui/Button';
import { cn } from '../../../utils/cn';
import { SearchHotel } from '../components/SearchHotel';
import { HotelCard } from '../components/HotelCard';
import { useHotels } from '../hooks/useHotels';
import {
  useHotelFilters,
  PRICE_RANGES,
  TIPOS_HOTEL,
  SERVICIOS,
  type OrdenKey,
} from '../hooks/useHotelFilters';

export const HotelsPage = () => {
  const { hoteles, loading } = useHotels();
  const {
    destino,
    setDestino,
    checkIn,
    setCheckIn,
    checkOut,
    setCheckOut,
    huespedes,
    setHuespedes,
    estrellas,
    precios,
    tipos,
    servicios,
    orden,
    setOrden,
    toggleEstrella,
    togglePrecio,
    toggleTipo,
    toggleServicio,
    resetFiltros,
    hotelesFiltrados,
    totalFiltrosActivos,
  } = useHotelFilters(hoteles);

  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);
  const resultadosRef = useRef<HTMLDivElement>(null);

  // "Buscar Hoteles" ya filtra en vivo con cada tecleo; el submit solo
  // lleva la vista hasta los resultados (útil sobre todo en mobile).
  const irAResultados = () => {
    resultadosRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Query string con las fechas/huéspedes buscados, para llevarlos
  // hasta el detalle del hotel y precargarlos en el flujo de reserva.
  const queryBusqueda = new URLSearchParams();
  if (checkIn) queryBusqueda.set('checkIn', checkIn);
  if (checkOut) queryBusqueda.set('checkOut', checkOut);
  if (huespedes > 1) queryBusqueda.set('huespedes', String(huespedes));
  const queryParams = queryBusqueda.toString();

  return (
    <Section>
      <div className="flex w-full flex-col gap-8 p-6">
        {/* Banner promo */}
        <div className="bg-secondary flex flex-col justify-between gap-4 rounded-2xl p-8 text-white md:flex-row md:items-center">
          <div>
            <span className="bg-primary rounded-md px-3 py-1 text-[12px] font-bold tracking-wider uppercase">
              Súper Promo Especial
            </span>
            <h2 className="mt-3 text-3xl font-bold">
              Ahorra hasta un 35% reservando Vuelo + Hotel
            </h2>
            <p className="mt-1 text-white/70">
              Combina tu hospedaje y ticket aéreo en un solo paquete y obtén traslados gratis.
            </p>
          </div>
          <Button variant="primary" className="w-auto bg-primary px-6 text-white">
            Ver Paquetes
          </Button>
        </div>

        <SearchHotel
          destino={destino}
          setDestino={setDestino}
          checkIn={checkIn}
          setCheckIn={setCheckIn}
          checkOut={checkOut}
          setCheckOut={setCheckOut}
          huespedes={huespedes}
          setHuespedes={setHuespedes}
          onBuscar={irAResultados}
        />

        {/* Botón "Filtros" — solo visible en mobile/tablet, abre el panel */}
        <button
          onClick={() => setFiltrosAbiertos(true)}
          className="border-secondary text-secondary flex w-full items-center justify-center gap-2 rounded-xl border p-3 font-semibold lg:hidden"
        >
          <span className="material-symbols-outlined">tune</span>
          Filtros
          {totalFiltrosActivos > 0 && (
            <span className="bg-primary flex h-5 w-5 items-center justify-center rounded-full text-[12px] text-white">
              {totalFiltrosActivos}
            </span>
          )}
        </button>

        <div ref={resultadosRef} className="grid w-full grid-cols-1 gap-10 lg:grid-cols-[0.8fr_2fr]">
          {/* Overlay — solo mobile, mientras el panel está abierto */}
          {filtrosAbiertos && (
            <div
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
              onClick={() => setFiltrosAbiertos(false)}
            />
          )}

          {/* Sidebar de filtros: panel deslizante en mobile, columna fija en desktop */}
          <div
            className={cn(
              'flex h-max w-full flex-col gap-6 rounded-2xl border bg-white p-5',
              'fixed inset-y-0 left-0 z-50 w-80 max-w-[85%] overflow-y-auto rounded-none transition-transform duration-300 ease-out',
              filtrosAbiertos ? 'translate-x-0' : '-translate-x-full',
              'lg:static lg:z-auto lg:w-full lg:max-w-none lg:translate-x-0 lg:rounded-2xl',
            )}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-bold">Filtros</h2>
              <div className="flex items-center gap-4">
                <span className="text-primary cursor-pointer text-[14px]" onClick={resetFiltros}>
                  Limpiar todo
                </span>
                <span
                  className="material-symbols-outlined cursor-pointer lg:hidden"
                  onClick={() => setFiltrosAbiertos(false)}
                >
                  close
                </span>
              </div>
            </div>
            <hr className="text-black/20" />

            <div className="flex flex-col gap-2">
              <h4 className="text-[14px] font-semibold">VALORACIÓN</h4>
              {[5, 4, 3].map((n) => (
                <div className="flex items-center gap-3" key={n}>
                  <input
                    type="checkbox"
                    className="accent-primary w-4"
                    id={`estrellas-${n}`}
                    checked={estrellas.has(n)}
                    onChange={() => toggleEstrella(n)}
                  />
                  <label htmlFor={`estrellas-${n}`} className="flex cursor-pointer">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={`material-symbols-outlined text-[16px]! ${
                          i < n ? 'text-primary' : 'text-black/20'
                        }`}
                      >
                        star
                      </span>
                    ))}
                  </label>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              <h4 className="text-[14px] font-semibold">RANGO DE PRECIO</h4>
              {PRICE_RANGES.map((range) => (
                <div className="flex gap-3" key={range.key}>
                  <input
                    type="checkbox"
                    className="accent-primary w-4"
                    id={range.key}
                    checked={precios.has(range.key)}
                    onChange={() => togglePrecio(range.key)}
                  />
                  <label htmlFor={range.key} className="cursor-pointer">
                    {range.label}
                  </label>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              <h4 className="text-[14px] font-semibold">TIPO DE HOTEL</h4>
              {TIPOS_HOTEL.map((tipo) => (
                <div className="flex gap-3" key={tipo}>
                  <input
                    type="checkbox"
                    className="accent-primary w-4"
                    id={tipo}
                    checked={tipos.has(tipo)}
                    onChange={() => toggleTipo(tipo)}
                  />
                  <label htmlFor={tipo} className="cursor-pointer">
                    {tipo}
                  </label>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              <h4 className="text-[14px] font-semibold">SERVICIOS</h4>
              {SERVICIOS.map((servicio) => (
                <div className="flex gap-3" key={servicio.key}>
                  <input
                    type="checkbox"
                    className="accent-primary w-4"
                    id={servicio.key}
                    checked={servicios.has(servicio.key)}
                    onChange={() => toggleServicio(servicio.key)}
                  />
                  <label htmlFor={servicio.key} className="cursor-pointer">
                    {servicio.label}
                  </label>
                </div>
              ))}
            </div>

            <Button variant="secondary" onClick={resetFiltros}>
              Reiniciar
            </Button>

            {/* Solo mobile: confirma y cierra el panel */}
            <Button
              variant="primary"
              className="bg-primary text-white lg:hidden"
              onClick={() => setFiltrosAbiertos(false)}
            >
              Ver {hotelesFiltrados.length} resultados
            </Button>
          </div>

          {/* Resultados */}
          <div className="flex w-full flex-col gap-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p>
                Encontramos <span className="font-bold">{hotelesFiltrados.length}</span>{' '}
                propiedades
                {destino.trim() !== '' && (
                  <>
                    {' '}
                    en <span className="font-bold">{destino}</span>
                  </>
                )}
              </p>
              <select
                className="rounded-lg border p-2 text-[14px]"
                value={orden}
                onChange={(e) => setOrden(e.target.value as OrdenKey)}
              >
                <option value="populares">Más populares</option>
                <option value="menor">Menor precio</option>
                <option value="mayor">Mayor precio</option>
              </select>
            </div>

            {loading ? (
              <p>Cargando hoteles...</p>
            ) : hotelesFiltrados.length === 0 ? (
              <p className="text-neutral">
                No encontramos hoteles con esa búsqueda. Probá con otro destino o quitando algún
                filtro.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {hotelesFiltrados.map((hotel) => (
                  <HotelCard key={hotel.id} {...hotel} queryParams={queryParams} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
};
