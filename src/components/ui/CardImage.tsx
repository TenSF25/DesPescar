import { cn } from '../../utils/cn';
import { formatCurrency } from '../../utils/formatCurrency';
import { Button } from './Button';
import type { FligthCardsProps } from '../../types/Interfaces';

export const CardImage = ({
  country,
  city,
  description,
  price,
  imageUrl,
  priceOffer,
  variant = 'preview',
  timeFly,
  scale,
  ...props
}: FligthCardsProps) => {
  if (variant === 'preview' && scale) {
    return (
      <div
        className={cn(
          `mx-auto flex w-full max-w-110 min-w-77.25 cursor-pointer flex-col rounded-2xl border border-black/17 bg-white shadow-[4px_4px_30px_-4px_rgba(0,0,0,0.25)] transition-all duration-400 hover:scale-105`,
        )}
        {...props}
      >
        <img src={imageUrl} className="h-54 w-full rounded-t-2xl" alt="" />
        <div className="flex flex-col gap-2 p-6">
          <div className="flex min-h-16 flex-row items-center justify-between">
            <h2 className="text-secondary text-2xl font-semibold">{country}</h2>
            <div className="flex flex-col items-center">
              <span className="text-center text-[12px] font-semibold text-[#44474E]/32 line-through">
                Desde {formatCurrency(priceOffer ? priceOffer : 0)}
              </span>
              <h2 className="text-secondary text-2xl font-medium">
                {formatCurrency(price ? price : 0)}
              </h2>
            </div>
          </div>
          <div className="flex flex-row items-center gap-10">
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
          <Button variant="primary">Reservar Ahora</Button>
        </div>
      </div>
    );
  }
  if (variant == 'full') {
    return (
      <div
        className={cn(
          'group relative flex h-full w-full cursor-pointer overflow-hidden rounded-2xl p-6 text-white',
        )}
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <img
          src={imageUrl}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-600 ease-out group-hover:scale-105"
          alt=""
        />
        <div className="relative z-10 flex h-full w-full flex-col justify-end">
          <h4 className="flex items-center text-[18px]">
            <span className="material-symbols-outlined">location_on</span>
            {city}
          </h4>
          <h2 className="text-3xl font-bold">{country}</h2>
          <p>{description}</p>
        </div>
      </div>
    );
  }
};
