import { Seats } from './Seats';
import { getColorSettings } from './ColorSettings';
import type { FareClassDetail, SeatItem, SeatsWebSockets } from '../../bookings.types';

interface SeatsRowProps {
  rowNumber: string;
  items: SeatItem[];
  ws: SeatsWebSockets;
  fareClasses: Record<string, FareClassDetail>;
}

export const SeatsRow = ({ rowNumber, items, fareClasses }: SeatsRowProps) => {
  return (
    <div className="flex w-full items-center justify-between px-2">
      {items.map((item, idx) => {
        const fareInfo = item.type === 'seat' ? fareClasses[item.fareClass] : null;
        const colorStyle = getColorSettings(fareInfo?.colorKey);

        return (
          <Seats
            key={item.seatUuid || idx}
            data={item}
            fareClass={fareInfo || fareClasses[item.fareClass]}
            rowNumber={rowNumber}
            colorStyle={colorStyle}
          />
        );
      })}
    </div>
  );
};
