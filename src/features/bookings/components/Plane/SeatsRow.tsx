import type { HTMLAttributes } from 'react';
import { Seats } from './Seats';

interface Seats extends HTMLAttributes<HTMLDivElement> {
  colorSeats?: string;
  numberColumn: string;
}

export const SeatsRow = ({ colorSeats, numberColumn }: Seats) => {
  return (
    <div className="seats-with-column flex w-full justify-between">
      <Seats className={colorSeats} />
      <Seats className={colorSeats} />
      <Seats className={colorSeats} />
      <div className="flex h-16 min-w-16 items-center justify-center rounded-lg bg-red-300">
        <h4 className="text-[#636680]">{numberColumn}</h4>
      </div>
      <Seats className={colorSeats} />
      <Seats className={colorSeats} />
      <Seats className={colorSeats} />
    </div>
  );
};
