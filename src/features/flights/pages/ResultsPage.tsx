import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { DateCarousel } from '../components/Results/DateCarousel';
import { FlightList } from '../components/Results/FlightList';
import { FlightFilters } from '../components/Results/FlightFilters';
import { useFlights } from '../hooks/useFlights';
import type { FiltroEscala, Flight } from '../flights.types';
import { ModifySearch } from '../components/Results/ModifySearch';
import { ScheduleHeader } from '../components/Results/ScheduleHeader';
import { ResponsiveFilters } from '@/components/ui/ResponsiveFilters';
import { contarFiltrosVuelo } from '../flightFilterCount';
import { useFlightStore } from '@/store/useFlightStore';

export const ResultsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [modifySearch, setModifySearch] = useState(false);

  const [vueloIdaSeleccionado, setVueloIdaSeleccionado] = useState<Flight | null>(null);

  const {
    isLoading,
    error,
    origin,
    destination,
    metadatos,
    aerolineasIda,
    aerolineasVuelta,
    vuelosIdaFiltrados,
    vuelosVueltaFiltrados,
    escalaFiltro,
    setEscalaFiltro,
    aerolineasFiltro,
    toggleAerolinea,
    equipajeFiltro,
    setEquipajeFiltro,
    horarioMin,
    horarioMax,
    setHorarioMin,
    setHorarioMax,
    orden,
    setOrden,
    formatDepartureDate,
    formatReturnDate,
  } = useFlights();

  const pasoActual = vueloIdaSeleccionado && searchParams.get('returnDate') ? 'VUELTA' : 'IDA';
  const { setSelectedDepartureFlight, setSelectedReturnFlight } = useFlightStore();

  const handleSeleccionar = (vuelo: Flight) => {
    if (pasoActual === 'IDA') {
      if (searchParams.get('returnDate')) {
        setVueloIdaSeleccionado(vuelo);
        setSelectedDepartureFlight(vuelo.id);

        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        navigate(`/booking/baggage?id=${vuelo.id}&passengers=${metadatos?.passengers ?? 1}`);
      }
    } else {
      setSelectedReturnFlight(vuelo.id);
      navigate(
        `/booking/baggage?departureId=${vueloIdaSeleccionado?.id}&returnId=${vuelo.id}&passengers=${metadatos?.passengers}`,
      );
    }
  };

  const handleLimpiarFiltros = () => {
    setEscalaFiltro('Todos');
    aerolineasFiltro.forEach((a) => toggleAerolinea(a));
    setEquipajeFiltro('Todos');
    setHorarioMin(0);
    setHorarioMax(1439);
  };

  return (
    <>
      <SectionContainer className="py-8">
        <ScheduleHeader
          origin={origin}
          destination={destination}
          metadatos={metadatos}
          handleModificarBusqueda={() => {
            setModifySearch(true);
            setVueloIdaSeleccionado(null);
          }}
        />

        {pasoActual === 'VUELTA' && (
          <div className="mt-6 flex flex-col items-start gap-4 rounded-xl border border-[#4300D2]/20 bg-[#4300D2]/5 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold text-[#4300D2]">Vuelo de ida seleccionado</p>
              <p className="text-sm text-gray-600">
                {vueloIdaSeleccionado?.airline.name} •{' '}
                {vueloIdaSeleccionado?.itinerary.departure.dateTime}
              </p>
            </div>
            <button
              onClick={() => setVueloIdaSeleccionado(null)}
              className="text-sm font-bold text-[#4300D2] hover:underline"
            >
              Cambiar vuelo de ida
            </button>
          </div>
        )}

        <div className="mt-6 flex w-full flex-col gap-6 lg:grid lg:grid-cols-[1fr_320px]">
          <ResponsiveFilters
            className="lg:order-2"
            activos={contarFiltrosVuelo({
              escala: escalaFiltro,
              aerolineas: aerolineasFiltro,
              equipaje: equipajeFiltro,
              horarioMin,
              horarioMax,
            })}
          >
            <FlightFilters
              escalaFiltro={escalaFiltro as FiltroEscala}
              onEscalaChange={setEscalaFiltro}
              aerolineas={pasoActual === 'IDA' ? aerolineasIda : aerolineasVuelta}
              aerolineasFiltro={aerolineasFiltro}
              onToggleAerolinea={toggleAerolinea}
              equipajeFiltro={equipajeFiltro}
              onEquipajeChange={setEquipajeFiltro}
              horarioMin={horarioMin}
              horarioMax={horarioMax}
              onHorarioMinChange={setHorarioMin}
              onHorarioMaxChange={setHorarioMax}
              onLimpiar={handleLimpiarFiltros}
            />
          </ResponsiveFilters>
          <div className="flex min-w-0 flex-col gap-6 lg:order-1">
            <DateCarousel
              activeDate={pasoActual === 'IDA' ? formatDepartureDate : formatReturnDate}
              paramKey={pasoActual === 'IDA' ? 'departureDate' : 'returnDate'}
            />

            {isLoading ? (
              <div className="flex h-64 w-full flex-col items-center justify-center gap-3 rounded-2xl border border-black/10 bg-white">
                <span className="material-symbols-outlined animate-spin text-4xl text-[#00205B]">
                  autorenew
                </span>
                <p className="font-semibold text-[#00205B]">Buscando vuelos...</p>
              </div>
            ) : error ? (
              <div className="flex h-64 w-full flex-col items-center justify-center gap-3 rounded-2xl border border-red-200 bg-red-50 text-red-600">
                <span className="material-symbols-outlined text-4xl">error</span>
                <p className="font-semibold">{error}</p>
              </div>
            ) : (
              <FlightList
                vuelos={pasoActual === 'IDA' ? vuelosIdaFiltrados : vuelosVueltaFiltrados}
                orden={orden}
                onOrdenChange={setOrden}
                onSeleccionar={handleSeleccionar}
              />
            )}
          </div>
        </div>
      </SectionContainer>

      {modifySearch && <ModifySearch onClose={() => setModifySearch(false)} />}
    </>
  );
};
