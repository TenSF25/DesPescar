import type { HTMLAttributes } from 'react';
import { cn } from '../../../../utils/cn';

interface CardResume extends HTMLAttributes<HTMLDivElement> {
  variant: 'ida' | 'vuelta';
  origen: string;
  destino: string;
}

export const CardResume = ({ variant, origen, destino }: CardResume) => {
  return (
    <div className={cn('p-5', variant === 'vuelta' && 'pt-3')}>
      <div className="text-secondary mb-5 flex items-center gap-2.5">
        <span
          className={cn(
            'material-symbols-outlined rotate-90 text-2xl!',
            variant === 'vuelta' && '-rotate-90',
          )}
        >
          flight
        </span>
        <h3 className="text-sm font-semibold tracking-wide uppercase opacity-80">
          {variant === 'vuelta' ? 'Vuelta' : 'Ida'} •{' '}
          <span className="font-bold text-black normal-case">
            {origen} a {destino}
          </span>
        </h3>
      </div>

      <div className="relative flex flex-row items-center justify-between">
        <div className="flex flex-1 flex-col">
          <span className="text-secondary text-2xl font-black tracking-tight">
            {origen.slice(0, 3).toUpperCase()}
          </span>
          <span className="mt-0.5 max-w-22.5 truncate text-xs font-medium text-gray-400">
            {origen}
          </span>
          <span className="text-secondary mt-3 text-base font-bold">10:30</span>
          <span className="mt-0.5 text-[11px] font-medium text-gray-400">15 de octubre 2026</span>
        </div>

        <div className="relative bottom-3 flex flex-1 flex-col items-center justify-center px-2">
          <span className="mb-1 text-[11px] font-bold tracking-wide text-gray-400 uppercase">
            Directo
          </span>
          <div className="relative flex w-full items-center justify-center py-1">
            <div className="absolute right-0 left-0 h-0.5 border-t border-dashed border-black/20"></div>
            <div className="absolute left-0 z-10 h-1.5 w-1.5 rounded-full bg-black/20"></div>
            <span className="material-symbols-outlined text-secondary z-10 rotate-90 bg-white px-1 text-xl!">
              flight
            </span>
            <div className="absolute right-0 z-10 h-1.5 w-1.5 rounded-full bg-black/20"></div>
          </div>
          <span className="mt-1 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500">
            12h 25m
          </span>
        </div>

        <div className="flex flex-1 flex-col items-end text-right">
          <span className="text-secondary text-2xl font-black tracking-tight">
            {destino.slice(0, 3).toUpperCase()}
          </span>
          <span className="mt-0.5 max-w-22.5 truncate text-xs font-medium text-gray-400">
            {destino}
          </span>
          <span className="text-secondary mt-3 text-base font-bold">16:55</span>
          <span className="mt-0.5 text-[11px] font-medium text-gray-400">15 de octubre 2026</span>
        </div>
      </div>
    </div>
  );
};
