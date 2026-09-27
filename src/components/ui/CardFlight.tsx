import type { FligthCardsProps } from '@/types/Interfaces';
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/formatCurrency';
import { Button } from './Button';

export const CardFlight = ({
  country,
  price,
  imageUrl,
  priceOffer,
  timeFly,
  scale,
  ...props
}: FligthCardsProps) => {
  return (
    <div
      className={cn(
        'group relative mx-auto flex h-full w-full max-w-md min-w-60 cursor-pointer flex-col overflow-hidden rounded-2xl border border-black/17 bg-white shadow-[4px_4px_30px_-4px_rgba(0,0,0,0.15)] transition-all duration-300 hover:shadow-[4px_4px_30px_-4px_rgba(0,0,0,0.25)]',
      )}
      {...props}
    >
      <div className="relative h-54 min-h-54 overflow-hidden">
        <img
          src={imageUrl}
          className="absolute inset-0 h-full w-full rounded-t-2xl object-cover transition-transform duration-600 ease-out group-hover:scale-110 group-active:scale-110"
          alt="paisaje"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between gap-4 p-6">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-xl leading-tight font-semibold">{country}</h2>
          <div className="flex shrink-0 flex-col">
            <h4 className="text-right text-sm font-medium text-[#44474E]/32 line-through">
              {formatCurrency(priceOffer ? priceOffer : 0)}
            </h4>
            <h2 className="text-secondary text-right text-xl font-bold">
              {formatCurrency(price ? price : 0)}
            </h2>
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-4">
          <div className="flex gap-8 text-nowrap">
            <h4 className="flex items-center gap-2 text-[18px] text-[#44474E]">
              <span className="material-symbols-outlined">schedule</span>
              {timeFly} h
            </h4>

            {scale === 'direct' ? (
              <h4 className="flex items-center gap-2 text-[18px] text-[#44474E]">
                <span className="material-symbols-outlined">done_all</span>
                Directo
              </h4>
            ) : (
              <h4 className="flex items-center gap-2 text-[18px] text-[#44474E]">
                <span className="material-symbols-outlined">swap_horiz</span>
                {scale}
              </h4>
            )}
          </div>
          <Button>Reservar Ahora</Button>
        </div>
      </div>
    </div>
  );
};
