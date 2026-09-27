import { Button } from '@/components/ui/Button';
import type { IncludedServices } from '@/features/flights/flights.types';

interface BaggageProps {
  name: string;
  type: string;
  price: string;
  isSelect: boolean;
  serviciosIncluidos: IncludedServices;
  onSelect: () => void;
}

export const BaggageCard = ({
  name,
  type,
  price,
  isSelect,
  serviciosIncluidos,
  onSelect,
}: BaggageProps) => {
  return (
    <div
      className={`${isSelect ? 'border-primary/30 hover:border-primary border-2' : 'border border-slate-300 shadow-sm hover:shadow-xl'} flex h-full min-h-75 w-full max-w-200 flex-col overflow-hidden rounded-2xl bg-white transition-all duration-300`}
    >
      <div className="flex flex-col items-center justify-center border-b border-black/20 bg-slate-50 py-3">
        <h3 className="text-sm font-bold tracking-wide text-slate-700 uppercase">{name}</h3>
        <h5 className="text-[11px] font-semibold text-slate-500">{type}</h5>
      </div>

      <div className="flex flex-col items-center justify-center bg-linear-to-b from-white to-slate-50/30 py-6">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900">+ $ {price}</h2>
        <p className="mt-1 text-xs font-medium text-slate-400">Por persona</p>
      </div>

      <hr className="mx-4 border-black/20" />

      <div className="flex flex-1 flex-col justify-between gap-6 p-4">
        {isSelect ? (
          <div className="bg-primary/10 flex items-center justify-center gap-2 rounded-xl px-4 py-2.5">
            <span className="material-symbols-outlined text-primary fill-1 text-[20px]">
              check_circle
            </span>
            <h4 className="text-primary text-sm font-bold tracking-wide">Seleccionado</h4>
          </div>
        ) : (
          <Button
            variant="secondary"
            className="h-11 w-full cursor-pointer rounded-xl text-sm font-bold tracking-wide shadow-sm transition-all duration-150 hover:shadow active:scale-98"
            onClick={onSelect}
          >
            Seleccionar
          </Button>
        )}

        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-600">
            {serviciosIncluidos.personalItem && (
              <span
                className="material-symbols-outlined hover:text-primary cursor-pointer text-[24px] transition-colors"
                title="Mochila personal incluida"
              >
                backpack
              </span>
            )}
            {serviciosIncluidos.carryOn && (
              <span
                className="material-symbols-outlined hover:text-primary cursor-pointer text-[24px] transition-colors"
                title="Equipaje de mano incluido"
              >
                luggage
              </span>
            )}
            {serviciosIncluidos.checkedBaggage && (
              <span
                className="material-symbols-outlined hover:text-primary cursor-pointer text-[24px] transition-colors"
                title="Equipaje de bodega incluido"
              >
                work
              </span>
            )}
            {serviciosIncluidos.wifi && (
              <span
                className="material-symbols-outlined hover:text-primary cursor-pointer text-[24px] transition-colors"
                title="Wi-Fi a bordo"
              >
                wifi
              </span>
            )}
          </div>

          <button className="text-primary hover:text-primary/80 cursor-pointer text-xs font-bold tracking-wide uppercase transition-all hover:underline">
            Ver más
          </button>
        </div>
      </div>
    </div>
  );
};
