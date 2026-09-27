import { cn } from '@/utils/cn';
import type { FligthCardsProps } from '@/types/Interfaces';

export const CardImage = ({ country, city, description, imageUrl }: FligthCardsProps) => {
  return (
    <div
      className={cn(
        'group relative flex h-full w-full cursor-pointer overflow-hidden rounded-2xl p-6 text-white',
      )}
    >
      <img
        src={imageUrl}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-600 ease-out group-hover:scale-105 group-active:scale-105"
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
};
