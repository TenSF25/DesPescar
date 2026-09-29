import { Seats } from './Seats';
import { getColorSettings } from './ColorSettings';
import type { FareClassDetail, LayoutItem } from '../../bookings.types';

interface SeatsRowProps {
  rowNumber: string;
  items: LayoutItem[];
  fareClasses: Record<string, FareClassDetail>;
}

const emptyFareClass: FareClassDetail = { name: '', price: 0, colorKey: '' };

export const SeatsRow = ({ rowNumber, items, fareClasses }: SeatsRowProps) => {
  return (
    <div className="flex w-full items-center justify-between px-2">
      {items.map((item, idx) => {
        const fareInfo = item.type === 'seat' ? fareClasses[item.fareClass] : null;
        const colorStyle = getColorSettings(fareInfo?.colorKey);

        return (
          <Seats
            key={item.type === 'seat' ? item.seatUuid || idx : `${item.type}-${idx}`}
            data={item}
            fareClass={fareInfo || emptyFareClass}
            rowNumber={rowNumber}
            colorStyle={colorStyle}
          />
        );
      })}
    </div>
  );
};
