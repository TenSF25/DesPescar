import { useState } from 'react';
import { Search } from '@/components/ui/Search';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { HotelSearchForm } from '@/features/hotels/components/HotelSearchForm';
import { cn } from '@/utils/cn';

type Pestana = 'vuelos' | 'hoteles';

const PESTANAS: { id: Pestana; label: string; icon: string }[] = [
  { id: 'vuelos', label: 'Vuelos', icon: 'flight' },
  { id: 'hoteles', label: 'Hoteles', icon: 'apartment' },
];

export const SearchFly = () => {
  const [pestana, setPestana] = useState<Pestana>('vuelos');

  return (
    <div className="flex h-200 w-full items-center justify-center gap-12 bg-[url(/bgSearch.webp)] bg-cover bg-center bg-no-repeat">
      <SectionContainer className="gap-10">
        <div className="w-max-180 flex w-full flex-col gap-6 text-center text-white">
          <h1 className="text-2xl font-extrabold sm:text-4xl md:text-6xl">
            Viajar bien empieza con una buena elección.
          </h1>
          <h3 className="text-sm font-semibold md:text-2xl">
            "No colecciones cosas, coleccioná viajes y momentos inolvidables"
          </h3>
        </div>
        <div className="flex w-full flex-col gap-3">
          <div role="tablist" className="flex gap-2">
            {PESTANAS.map((p) => (
              <button
                key={p.id}
                role="tab"
                type="button"
                aria-selected={pestana === p.id}
                onClick={() => setPestana(p.id)}
                className={cn(
                  'flex cursor-pointer items-center gap-2 rounded-full border px-5 py-2 text-sm font-bold backdrop-blur-xl transition-all',
                  pestana === p.id
                    ? 'text-secondary border-white bg-white'
                    : 'border-white/20 bg-black/40 text-white hover:bg-black/50',
                )}
              >
                <span className="material-symbols-outlined text-[18px]">{p.icon}</span>
                {p.label}
              </button>
            ))}
          </div>
          {pestana === 'vuelos' ? <Search moodle={false} /> : <HotelSearchForm />}
        </div>
      </SectionContainer>
    </div>
  );
};
