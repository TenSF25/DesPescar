import { LayoutCabine } from './LayoutCabine';
import { LayoutSeats } from './LayoutSeats';
import { LayoutServices } from './LayoutServices';
import { SeparatorColumns } from './SeparatorColumns';
import { SeparatorEmergency } from './SeparatorEmergency';
import { SeatsRow } from './SeatsRow';
import { SeparatorClass } from './SeparatorClass';

export const LayoutAirplane = () => {
  return (
    <div className="plane relative mx-auto w-full max-w-full">
      <div className="head bg-gray-200 px-3 [clip-path:ellipse(50%_100%_at_50%_100%)]">
        <div className="head-plane h-100 w-120 bg-white [clip-path:ellipse(50%_100%_at_50%_100%)]"></div>
      </div>
      <div className="cabine bg-gray-200 px-3">
        <LayoutCabine>
          <LayoutServices />
          <SeparatorEmergency />
          <SeparatorColumns />
          <LayoutSeats
            separatorClass={
              <SeparatorClass
                sector="Adelante"
                colorBorder="border-blue-400"
                colorText="text-blue-400"
              />
            }
          >
            {[...Array(3)].map((_, i) => (
              <SeatsRow numberColumn={String(i + 1)} />
            ))}
          </LayoutSeats>
          <LayoutSeats
            separatorClass={
              <SeparatorClass
                sector="Standard adelante"
                colorBorder="border-orange-400"
                colorText="text-orange-400"
              />
            }
          >
            {[...Array(11)].map((_, i) => (
              <SeatsRow
                colorSeats="border-orange-400 hover:bg-orange-400/40"
                numberColumn={String(i + 4)}
              />
            ))}
          </LayoutSeats>
          <LayoutSeats
            separatorClass={
              <SeparatorClass
                sector="Salida de emergencia"
                colorBorder="border-green-600"
                colorText="text-green-600"
              />
            }
          >
            {[...Array(2)].map((_, i) => (
              <>
                <SeparatorEmergency />
                <SeatsRow
                  colorSeats="border-green-600 hover:bg-green-600/40"
                  numberColumn={String(i + 15)}
                />
              </>
            ))}
          </LayoutSeats>
          <LayoutSeats
            separatorClass={
              <SeparatorClass
                sector="Standard"
                colorBorder="border-yellow-400"
                colorText="text-yellow-400"
              />
            }
          >
            {[...Array(16)].map((_, i) => (
              <SeatsRow
                colorSeats="border-yellow-400 hover:bg-yellow-400/40"
                numberColumn={String(i + 17)}
              />
            ))}
          </LayoutSeats>
          <LayoutServices />
          <SeparatorEmergency />
        </LayoutCabine>
      </div>
      <div className="ariplane-tail h-140 bg-gray-200 px-3 [clip-path:ellipse(50%_100%_at_50%_0%)]">
        <div className="airplane-tail h-50 w-120 bg-white [clip-path:ellipse(50%_100%_at_50%_0%)]"></div>
      </div>
      <div className="airplane-wings relative -top-650 z-20 mx-auto h-40 w-126">
        <div className="wing-left absolute right-full z-10 -mx-1 h-200 w-180 bg-gray-200 [clip-path:polygon(0%_100%,0%_80%,100%_0%,100%_70%)]"></div>
        <div className="wing-right absolute left-full z-10 h-200 w-180 bg-gray-200 [clip-path:polygon(0%_0%,100%_80%,100%_100%,0%_70%)]"></div>
      </div>
    </div>
  );
};
