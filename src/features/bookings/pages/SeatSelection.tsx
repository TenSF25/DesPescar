import { SectionContainer } from '@/components/ui/SectionContainer';
import { StickyActionBar } from '@/components/ui/StickyActionBar';
import { AirplaneCanvas } from '../components/Plane/AirplaneCanvas';
import { DetailSelectionSeats } from '../components/DetailSelectionSeats';
import { Button } from '@/components/ui/Button';
import { useBooking } from '../hooks/useBooking';
import { useNavigate } from 'react-router';
import { useFlightStore } from '@/store/useFlightStore';
import { SeatsProvider } from '../context/SeatsProvider';
import { useSeats } from '../hooks/useSeats';

const SeatSelectionContent = () => {
  const { initBooking, isLoading, error } = useBooking();
  const { seatsMap, selectedSeats, isLoading: seatsLoading, error: seatsError } = useSeats();
  const passengers = useFlightStore((state) => state.passengers);
  const setBookingId = useFlightStore((state) => state.setBookingId);
  const navigate = useNavigate();
  const passengerCount = Math.max(1, Number(passengers) || 1);

  const handleClick = async () => {
    if (selectedSeats.length !== passengerCount) return;

    const result = await initBooking();
    if (result.success && result.reservationId) {
      setBookingId(result.reservationId);
      navigate('/booking/checkout');
    }
  };

  return (
    <SectionContainer
      stickyBar
      className="mx-auto flex w-full max-w-312.5 flex-col items-center gap-6 lg:pl-84"
    >
      <DetailSelectionSeats />
      <div className="relative z-1 w-full">
        <AirplaneCanvas></AirplaneCanvas>
      </div>
      <StickyActionBar
        alert={
          (error || seatsError) && (
            <p
              role="alert"
              className="absolute bottom-full mx-4 mb-2 rounded bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {error || seatsError}
            </p>
          )
        }
      >
        <div>
          <h3 className="text-xl font-semibold text-[#323439]">Asientos</h3>
          <p className="text-sm text-gray-600">
            {selectedSeats.length} de {passengerCount} seleccionados
          </p>
        </div>
        <Button
          variant="secondary"
          className="rounded-full px-5 sm:w-auto"
          onClick={handleClick}
          disabled={
            !seatsMap || seatsLoading || isLoading || selectedSeats.length !== passengerCount
          }
        >
          {isLoading ? 'Creando reserva...' : 'Continuar'}
        </Button>
      </StickyActionBar>
    </SectionContainer>
  );
};

export const SeatSelection = () => (
  <SeatsProvider>
    <SeatSelectionContent />
  </SeatsProvider>
);
