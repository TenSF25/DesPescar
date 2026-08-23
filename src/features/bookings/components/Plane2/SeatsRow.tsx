import { Seats } from './Seats';

interface SeatsRow {
  rowNumber: string;
  items: [
    {
      id?: string;
      type: string;
      fareClass?: string;
      status?: string;
    },
  ];
  colorStyle: {
    available: string;
    select: string;
    occupied: string;
  };
}

export const SeatsRow = ({ rowNumber, items, colorStyle }: SeatsRow) => {
  return (
    <div className="flex w-full justify-between">
      {items.map((seat) => (
        <Seats
          status={seat.status || ''}
          type={seat.type}
          rowNumber={rowNumber}
          colorStyle={colorStyle}
        ></Seats>
      ))}
    </div>
  );
};
