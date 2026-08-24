import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Section } from '../../../components/ui/Section';
import { useFlights } from '../../../hooks/useFlights';
import { DateTabs } from '../components/Results/DateTabs';
import { FlightFilters } from '../components/Results/FlightFilters';
import { FlightList } from '../components/Results/FlightList';
import { ModifySearchModal } from '../components/Results/ModifySearchModal';
import { ScheduleHeader } from '../components/Results/ScheduleHeader';
import type { Vuelo } from '../flights.types';
import type { Aeropuerto } from '../../../types/Interfaces';

interface ResultsLocationState {
  origen: Aeropuerto | null;
  destino: Aeropuerto | null;
  fecha?: string;
  pasajeros?: number;
}

export const ResultsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    origen: origenInicial,
    destino: destinoInicial,
    fecha: fechaInicial,
    pasajeros: pasajerosInicial,
  } = (location.state as ResultsLocationState) ?? { origen: null, destino: null };

  const [origenBuscado, setOrigenBuscado] = useState<Aeropuerto | null>(origenInicial);
  const [destinoBuscado, setDestinoBuscado] = useState<Aeropuerto | null>(destinoInicial);
  const [fechaBuscada, setFechaBuscada] = useState<string>(fechaInicial ?? '');
  const [pasajeros, setPasajeros] = useState(pasajerosInicial ?? 2);
  const [modalAbierto, setModalAbierto] = useState(false);

  const ruta = useMemo(
    () => ({
      origenCodigo: origenBuscado?.codigo_iata,
      destinoCodigo: destinoBuscado?.codigo_iata,
      fechaInicial: fechaBuscada || undefined,
    }),
    [origenBuscado?.codigo_iata, destinoBuscado?.codigo_iata, fechaBuscada],
  );

  const {
    fechasDisponibles,
    fechaSeleccionada,
    setFechaSeleccionada,
    aerolineasDisponibles,
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
    vuelosFiltrados,
  } = useFlights(ruta);

  const primerVuelo = vuelosFiltrados[0];

  const handleSeleccionar = (vuelo: Vuelo) => {
    navigate('/booking/reservation', { state: { vuelo } });
  };

  const handleLimpiarFiltros = () => {
    setEscalaFiltro('Todos');
    aerolineasFiltro.forEach((a) => toggleAerolinea(a));
    setEquipajeFiltro('Todos');
    setHorarioMin(0);
    setHorarioMax(23 * 60 + 59);
  };

  const handleModificarBusqueda = (valores: {
    origen: Aeropuerto | null;
    destino: Aeropuerto | null;
    fecha: string;
    pasajeros: number;
  }) => {
    setOrigenBuscado(valores.origen);
    setDestinoBuscado(valores.destino);
    setFechaBuscada(valores.fecha);
    setPasajeros(valores.pasajeros);
    setModalAbierto(false);
  };

  return (
    <div className="flex w-full flex-col gap-6 bg-[#F5F6FA] pb-16">
      <ScheduleHeader
        origenCiudad={origenBuscado?.ciudad ?? primerVuelo?.origenCiudad ?? 'Buenos Aires'}
        origenCodigo={origenBuscado?.codigo_iata ?? primerVuelo?.origenCodigo ?? 'EZE'}
        destinoCiudad={destinoBuscado?.ciudad ?? primerVuelo?.destinoCiudad ?? 'Ciudad de México'}
        destinoCodigo={destinoBuscado?.codigo_iata ?? primerVuelo?.destinoCodigo ?? 'MEX'}
        fecha={fechaSeleccionada}
        pasajeros={pasajeros}
        onModificar={() => setModalAbierto(true)}
      />

      <Section>
        <div className="flex flex-col gap-6 px-4">
          <DateTabs
            fechas={fechasDisponibles}
            fechaSeleccionada={fechaSeleccionada}
            onSelect={setFechaSeleccionada}
          />

          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            <div className="min-w-0 flex-1">
              <FlightList
                vuelos={vuelosFiltrados}
                orden={orden}
                onOrdenChange={setOrden}
                onSeleccionar={handleSeleccionar}
              />
            </div>
            <FlightFilters
              escalaFiltro={escalaFiltro}
              onEscalaChange={setEscalaFiltro}
              aerolineas={aerolineasDisponibles}
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
          </div>
        </div>
      </Section>

      {modalAbierto && (
        <ModifySearchModal
          valoresIniciales={{
            origen: origenBuscado,
            destino: destinoBuscado,
            fecha: fechaBuscada,
            pasajeros,
          }}
          onCerrar={() => setModalAbierto(false)}
          onBuscar={handleModificarBusqueda}
        />
      )}
    </div>
  );
};
