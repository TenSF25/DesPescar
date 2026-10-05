import { precioAsiento } from '../precios';
import { cn } from '@/utils/cn';
import { useSeats } from '../hooks/useSeats';
import { getColorSettings } from './Plane/ColorSettings';

// Función para asignar un orden específico basado en el nombre de la tarifa
const getFareClassRank = (name: string) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('primera')) return 1;
  if (lowerName.includes('rapida') || lowerName.includes('rápida')) return 2;
  if (lowerName.includes('emergencia')) return 3;
  if (lowerName.includes('estandar') || lowerName.includes('estándar')) return 4;
  return 5;
};

export const DetailSelectionSeats = () => {
  const { seatsMap, selectedSeats } = useSeats();

  const maxLimit = seatsMap?.totalSelectedLimit;

  const getSeatDetails = (seatId: string) => {
    if (!seatsMap?.layout) return null;

    for (const element of seatsMap.layout) {
      if (element.type === 'row') {
        const foundSeat = element.items.find(
          (item) => item.type === 'seat' && item.seatUuid === seatId,
        );
        if (foundSeat && foundSeat.type === 'seat') {
          return foundSeat;
        }
      }
    }
    return null;
  };

  return (
    <div className="flex w-full flex-col gap-6 lg:fixed lg:top-60 lg:left-20 lg:z-99 lg:w-auto lg:gap-8">
      <div className="flex flex-col gap-4">
        <h2 className="text-secondary text-xl font-bold lg:text-2xl">Tipos de asientos</h2>
        <div className="flex max-w-150 flex-wrap gap-3">
          {Object.entries(seatsMap?.fareClasses ?? {})
            .sort(([, a], [, b]) => getFareClassRank(a.name) - getFareClassRank(b.name))
            .map(([key, value]) => {
              const colorStyle = getColorSettings(value.colorKey);

              return (
                <div
                  className="border-secondary flex w-full items-center gap-3 rounded-lg border bg-white p-3 sm:w-70"
                  key={key}
                >
                  <div
                    className={cn(
                      `flex h-full max-h-10 w-full max-w-10 items-center justify-center rounded-lg`,
                    )}
                  >
                    <span className={cn('material-symbols-outlined text-4xl!', colorStyle.text)}>
                      chair
                    </span>
                  </div>
                  <div className={cn('flex flex-col', colorStyle.text)}>
                    <h4 className="text-[18px] font-semibold text-nowrap">{value.name}</h4>
                    <h5 className="text-[18px]">{precioAsiento(value.price)}</h5>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-secondary text-xl font-bold lg:text-2xl">Pasajeros</h2>
        <div className="flex max-w-150 flex-wrap gap-3">
          {Array.from({ length: maxLimit ?? 0 }).map((_, index) => {
            const assignedSeatId = selectedSeats[index];

            const seatDetails = assignedSeatId ? getSeatDetails(assignedSeatId) : null;
            const visibleSeatNumber = seatDetails ? seatDetails.displayNumber : null;

            const seatCategoryKey = seatDetails?.fareClass;
            const fareClassData = seatCategoryKey ? seatsMap?.fareClasses?.[seatCategoryKey] : null;
            const colorStyle = fareClassData ? getColorSettings(fareClassData.colorKey) : null;

            return (
              <div
                key={index}
                className="border-secondary flex w-full gap-2 rounded-lg border bg-white p-2 px-3 sm:w-60"
              >
                <div
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-lg',
                    colorStyle ? colorStyle.select : 'bg-gray-200 text-gray-400',
                  )}
                >
                  {assignedSeatId ? (
                    <span className={cn('text-md font-semibold text-white')}>
                      {visibleSeatNumber}
                    </span>
                  ) : (
                    <span className="material-symbols-outlined">close</span>
                  )}
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="text-secondary font-semibold">Pasajero {index + 1}</h4>
                  <h5
                    className={cn(
                      'text-sm text-nowrap',
                      colorStyle ? colorStyle.text : 'text-black/40',
                    )}
                  >
                    {fareClassData ? fareClassData.name : 'Asiento sin seleccionar'}
                  </h5>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
