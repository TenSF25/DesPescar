import { useAuthStore } from '@/store/useAuthStore';
import { cn } from '../../../../utils/cn';
import type { FareClassDetail, LayoutItem } from '../../bookings.types';
import { useSeats } from '../../hooks/useSeats';

interface SeatsProps {
  data: LayoutItem;
  fareClass: FareClassDetail;
  rowNumber: string;
  colorStyle: { available: string; select: string; occupied: string };
}

export const Seats = ({ data, fareClass, rowNumber, colorStyle }: SeatsProps) => {
  const { handleSeatClick } = useSeats();
  const myUserId = useAuthStore((state) => state.user?.id);

  if (data.type === 'aisle') {
    return (
      <div className="flex h-10 min-w-10 items-center justify-center text-center sm:h-12 sm:min-w-12">
        <h2 className="font-bold text-gray-400">{rowNumber}</h2>
      </div>
    );
  }

  if (data.type === 'empty') {
    return <div className="flex h-10 min-w-10 sm:h-12 sm:min-w-12"></div>;
  }

  const isOccupiedByOther =
    data.status === 'BLOQUEADO' ||
    (data.status === 'RESERVADO_TEMPORAL' && data.blockedByUserId !== myUserId);

  const isSelectedByMe = data.status === 'RESERVADO_TEMPORAL' && data.blockedByUserId === myUserId;

  const handleClick = () => {
    if (!isOccupiedByOther && data.displayNumber) {
      handleSeatClick(data.seatUuid, data.status, data.blockedByUserId);
    }
  };

  return (
    <div
      className={cn(
        'group relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-center transition-colors sm:h-12 sm:w-12',
        colorStyle.available,
        isSelectedByMe && colorStyle.select,
        isOccupiedByOther && colorStyle.occupied,
      )}
      onClick={handleClick}
    >
      <span className="material-symbols-outlined text-4xl!">chair</span>
      {!isSelectedByMe && (
        <div className="absolute top-10 z-20 hidden flex-col gap-1 rounded-lg border border-black/20 bg-white p-2 group-hover:flex sm:top-12">
          <div className="flex gap-2">
            <h4 className="text-md font-bold">{data.displayNumber}</h4>
            <span>-</span>
            <h4 className="font-medium">${fareClass.price}</h4>
          </div>
          <h4 className="font-semibold text-nowrap">{fareClass.name}</h4>
        </div>
      )}
    </div>
  );
};
