import { useState } from 'react';
import { useNavigate } from 'react-router';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { Button } from '@/components/ui/Button';
import { useBarraInferior } from '@/hooks/useBarraInferior';
import { useCarritoStore } from '@/store/useCarritoStore';
import { useFlightStore } from '@/store/useFlightStore';
import { AirplaneCanvas } from '../components/Plane/AirplaneCanvas';
import { DetailSelectionSeats } from '../components/DetailSelectionSeats';
import { useBooking, type ResultadoInit } from '../hooks/useBooking';
import { useSeats } from '../hooks/useSeats';

const FOCO =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary';

export const SeatSelection = () => {
  useBarraInferior();
  const { initBooking, reemplazarVuelo, isLoading, error } = useBooking();
  const { seatsMap, selectedSeats, isLoading: seatsLoading, error: seatsError } = useSeats();
  const passengers = useFlightStore((state) => state.passengers);
  const setBookingId = useFlightStore((state) => state.setBookingId);
  const recargarCarrito = useCarritoStore((state) => state.recargar);
  const navigate = useNavigate();
  const passengerCount = Math.max(1, Number(passengers) || 1);
  const [yaTieneVuelo, setYaTieneVuelo] = useState(false);

  const alCarrito = async (resultado: Promise<ResultadoInit>) => {
    const r = await resultado;
    if (r.success) {
      setBookingId(r.reservationId);
      await recargarCarrito();
      navigate('/carrito');
      return;
    }
    setYaTieneVuelo(r.codigo === 'CARRITO_YA_TIENE_VUELO');
  };

  const handleClick = () => {
    if (isLoading || selectedSeats.length !== passengerCount) return;
    void alCarrito(initBooking());
  };

  return (
    <SectionContainer className="mt-6 mr-auto mb-28 ml-auto flex w-full max-w-312.5 flex-col items-center justify-center gap-8 lg:mt-10 lg:mb-10 lg:flex-row lg:gap-20">
      <DetailSelectionSeats />
      <div className="relative z-1 w-full max-w-full min-w-0 overflow-x-auto lg:w-auto lg:overflow-visible">
        <AirplaneCanvas></AirplaneCanvas>
      </div>
      <div className="fixed bottom-0 left-0 z-2 flex w-full justify-center border-t border-[#3234392d] bg-white">
        <div className="flex w-full max-w-360 items-center justify-between gap-3 p-3 sm:p-4">
          <div>
            <h3 className="text-lg font-semibold text-[#323439] sm:text-xl">Asientos</h3>
            <p className="text-sm text-gray-600">
              {selectedSeats.length} de {passengerCount} seleccionados
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-4 sm:gap-12">
            <Button
              variant="secondary"
              className={`min-h-11 rounded-full px-5 disabled:cursor-not-allowed disabled:opacity-50 ${FOCO}`}
              onClick={handleClick}
              aria-busy={isLoading}
              disabled={
                !seatsMap ||
                seatsLoading ||
                isLoading ||
                yaTieneVuelo ||
                selectedSeats.length !== passengerCount
              }
            >
              <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
              {isLoading ? 'Agregando...' : 'Agregar al carrito'}
            </Button>
          </div>
        </div>
        {yaTieneVuelo && (
          <div
            role="alertdialog"
            aria-labelledby="ya-tiene-vuelo"
            aria-describedby="ya-tiene-vuelo-ayuda"
            className="absolute right-3 bottom-full left-3 mb-2 flex flex-col gap-3 rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-lg sm:left-auto sm:max-w-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-1">
                <p id="ya-tiene-vuelo" className="text-secondary font-bold">
                  Tu carrito ya tiene un vuelo
                </p>
                <p id="ya-tiene-vuelo-ayuda" className="text-secondary/70 text-sm">
                  ¿Querés reemplazarlo por este? Las estadías que tengas en el carrito se mantienen.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setYaTieneVuelo(false)}
                aria-label="Cerrar y seguir eligiendo asientos"
                className={`text-secondary/70 hover:bg-secondary/5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${FOCO}`}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                variant="secondary"
                className={`bg-secondary min-h-11 rounded-full text-white hover:opacity-90 ${FOCO}`}
                disabled={isLoading}
                onClick={() => {
                  setYaTieneVuelo(false);
                  void alCarrito(reemplazarVuelo());
                }}
              >
                Reemplazar vuelo
              </Button>
              <Button
                variant="secondary"
                className={`min-h-11 rounded-full ${FOCO}`}
                onClick={() => navigate('/carrito')}
              >
                Ver carrito
              </Button>
            </div>
          </div>
        )}
        {(error || seatsError) && !yaTieneVuelo && (
          <p
            role="alert"
            className="absolute right-3 bottom-full left-3 mb-2 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 sm:right-auto"
          >
            {error || seatsError}
          </p>
        )}
      </div>
    </SectionContainer>
  );
};
