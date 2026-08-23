import { cn } from '../../../../utils/cn';

interface Seats {
  type: 'seat' | 'aisle' | 'empty' | string;
  rowNumber: string;
  status: 'avaliable' | 'select' | 'occupied' | string;
  colorStyle: Record<string, string>;
}

export const Seats = ({ status, colorStyle, type, rowNumber }: Seats) => {
  console.log(colorStyle);

  if (type === 'aisle')
    return (
      <div className="flex h-16 min-w-16 items-center justify-center text-center">
        <h2>{rowNumber}</h2>
      </div>
    );
  if (type === 'empty')
    return <div className="flex h-16 min-w-16 items-center justify-center text-center"></div>;

  return (
    <div
      className={cn(
        'flex h-16 w-16 items-center justify-center rounded-lg border-3 text-center',
        colorStyle.available,
        status === 'select' && colorStyle.status,
        status === 'occupied' && colorStyle.occupied,
      )}
    >
      <h2 className="font-bold">{}</h2>
    </div>
  );
};
