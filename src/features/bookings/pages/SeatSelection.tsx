import { SectionContainer } from '@/components/ui/SectionContainer';
import { AirplaneCanvas } from '../components/Plane/AirplaneCanvas';
import { DetailSelectionSeats } from '../components/DetailSelectionSeats';
import { Button } from '@/components/ui/Button';
import { useBooking } from '../hooks/useBooking';
import { useNavigate } from 'react-router';

export const SeatSelection = () => {
  const { initBooking } = useBooking();
  const navigate = useNavigate();

  const handleClick = () => {
    initBooking();
    navigate('/booking/checkout');
  };

  return (
    <SectionContainer className="mt-10 mr-auto mb-10 ml-auto flex w-full max-w-312.5 flex-row items-center justify-center gap-20">
      <DetailSelectionSeats />
      <div>
        <AirplaneCanvas></AirplaneCanvas>
      </div>
      <div className="fixed bottom-0 left-0 z-9999 flex w-full justify-center border-t border-[#3234392d] bg-white">
        <div className="flex w-360 items-center justify-between p-4">
          <h3 className="text-xl font-semibold text-[#323439]">Tu viaje a Madrid</h3>
          <div className="flex items-center gap-12">
            <div className="flex flex-col">
              <h5 className="text-xs font-semibold">Precio final</h5>
              <div className="flex gap-0.5">
                <span className="material-symbols-outlined text-primary">info</span>
                <h6 className="flex items-end gap-0.5 text-xl">
                  <span className="text-sm text-[#323439]">$</span>
                  200000
                </h6>
              </div>
            </div>
            <Button variant="secondary" className="rounded-full px-5" onClick={handleClick}>
              Continuar
            </Button>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};
