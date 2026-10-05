import { Button } from '@/components/ui/Button';
import type { MetadataSearch } from '../../flights.types';

interface ScheduleProps {
  origin: string;
  destination: string;
  metadatos: MetadataSearch | null;
  handleModificarBusqueda: () => void;
}

export const ScheduleHeader = ({
  origin,
  destination,
  metadatos,
  handleModificarBusqueda,
}: ScheduleProps) => {
  return (
    <header className="bg-secondary flex w-full flex-col items-start justify-between gap-5 rounded-xl p-4 text-white sm:flex-row sm:items-center sm:p-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold sm:text-2xl">Cronograma de vuelos</h2>
        <div>
          <p className="text-sm text-white/60">Elegí el vuelo que mejor se adapte a tu viaje.</p>
          <p className="text-sm font-medium text-white/80">
            Búsqueda para {metadatos?.passengers}{' '}
            {metadatos?.passengers === 1 ? 'pasajero' : 'pasajeros'}
          </p>
        </div>
      </div>

      <div className="flex max-w-full min-w-0 items-center gap-3 sm:gap-6">
        <div className="flex flex-col text-right">
          <h2 className="text-2xl font-bold tracking-wider break-words sm:text-3xl">{origin}</h2>
        </div>
        <span className="material-symbols-outlined text-primary text-3xl">flight</span>
        <div className="flex flex-col text-left">
          <h2 className="text-2xl font-bold tracking-wider break-words sm:text-3xl">
            {destination}
          </h2>
        </div>
      </div>

      <Button
        onClick={handleModificarBusqueda}
        className="border-primary hover:bg-primary flex w-full items-center justify-center gap-2 rounded-[10px] border px-6 py-2.5 font-bold text-white transition-all duration-200 active:scale-95 sm:w-auto"
      >
        <span className="material-symbols-outlined text-[18px]">edit</span>
        Modificar Búsqueda
      </Button>
    </header>
  );
};
