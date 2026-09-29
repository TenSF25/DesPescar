import { SectionContainer } from '@/components/ui/SectionContainer';
import { AirplaneCanvas } from '../components/Plane/AirplaneCanvas';
import { DetailSelectionSeats } from '../components/DetailSelectionSeats';
import { Button } from '@/components/ui/Button';
import { useBooking } from '../hooks/useBooking';
import { useNavigate } from 'react-router';
import { useFlightStore } from '@/store/useFlightStore';
import { useSeats } from '../hooks/useSeats';

export const SeatSelection = () => {
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
    <SectionContainer className="mt-10 mr-auto mb-10 ml-auto flex w-full max-w-312.5 flex-row items-center justify-center gap-20">
      <DetailSelectionSeats />
      <div>
        <AirplaneCanvas></AirplaneCanvas>
      </div>
      <div className="fixed bottom-0 left-0 z-9999 flex w-full justify-center border-t border-[#3234392d] bg-white">
        <div className="flex w-360 items-center justify-between p-4">
          <div>
            <h3 className="text-xl font-semibold text-[#323439]">Asientos</h3>
            <p className="text-sm text-gray-600">
              {selectedSeats.length} de {passengerCount} seleccionados
            </p>
          </div>
          <div className="flex items-center gap-12">
            <Button
              variant="secondary"
              className="rounded-full px-5"
              onClick={handleClick}
              disabled={
                !seatsMap ||
                seatsLoading ||
                isLoading ||
                selectedSeats.length !== passengerCount
              }
            >
              {isLoading ? 'Creando reserva...' : 'Continuar'}
            </Button>
          </div>
        </div>
        {(error || seatsError) && (
          <p role="alert" className="absolute bottom-full mb-2 rounded bg-red-50 px-3 py-2 text-sm text-red-700">
            {error || seatsError}
          </p>
        )}
      </div>
    </SectionContainer>
  );
};
