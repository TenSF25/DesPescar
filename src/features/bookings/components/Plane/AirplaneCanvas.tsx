import { useSeats } from '../../hooks/useSeats';
import { CabinAmenity } from './CabinAmenity';
import { SeatsRow } from './SeatsRow';

export const AirplaneCanvas = () => {
  const { seatsMap } = useSeats();

  if (!seatsMap) return <div>Cargando avión...</div>;

  return (
    <div className="plane relative mx-auto w-full max-w-full min-w-126 lg:min-w-0">
      <div className="head bg-gray-200 px-3 [clip-path:ellipse(50%_100%_at_50%_100%)]">
        <div className="head-plane h-100 w-120 bg-white [clip-path:ellipse(50%_100%_at_50%_100%)]"></div>
      </div>

      <div className="cabine bg-gray-200 px-3">
        <div className="cabine-plane flex h-auto min-h-200 w-120 flex-col gap-6 bg-white p-4 pb-20">
          {seatsMap.layout.map((element, index) => {
            if (element.type === 'row') {
              return (
                <SeatsRow
                  key={`row-${element.rowNumber}`}
                  rowNumber={String(element.rowNumber)}
                  items={element.items}
                  fareClasses={seatsMap.fareClasses}
                />
              );
            }

            if (element.type === 'amenity') {
              return (
                <CabinAmenity
                  key={`amenity-${index}`}
                  type={element.amenityType}
                  metadata={element.metadata}
                />
              );
            }
            return null;
          })}
        </div>
      </div>

      <div className="ariplane-tail h-140 bg-gray-200 px-3 [clip-path:ellipse(50%_100%_at_50%_0%)]">
        <div className="airplane-tail h-50 w-120 bg-white [clip-path:ellipse(50%_100%_at_50%_0%)]"></div>
      </div>

      <div className="airplane-wings pointer-events-none relative top-[-2230px] z-20 mx-auto hidden h-40 w-126 lg:block">
        <div className="wing-left absolute right-full z-10 -mx-1 h-200 w-180 bg-gray-200 [clip-path:polygon(0%_100%,0%_80%,100%_0%,100%_70%)]"></div>
        <div className="wing-right absolute left-full z-10 h-200 w-180 bg-gray-200 [clip-path:polygon(0%_0%,100%_80%,100%_100%,0%_70%)]"></div>
      </div>
    </div>
  );
};
