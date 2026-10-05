import { useState } from 'react';
import { cn } from '@/utils/cn';

export const HotelGallery = ({ imagenes, nombre }: { imagenes: string[]; nombre: string }) => {
  const [actual, setActual] = useState(0);
  if (imagenes.length === 0) {
    return (
      <div className="flex h-72 w-full items-center justify-center rounded-2xl bg-[#F8FAFC]">
        <span className="material-symbols-outlined text-secondary/30 text-6xl">apartment</span>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-3">
      <img
        src={imagenes[actual]}
        alt={nombre}
        className="h-72 w-full rounded-2xl object-cover md:h-96"
      />
      {imagenes.length > 1 && (
        <div className="flex gap-3 overflow-x-auto">
          {imagenes.map((url, i) => (
            <button
              key={url + i}
              type="button"
              onClick={() => setActual(i)}
              aria-label={`Ver foto ${i + 1}`}
              className={cn(
                'h-20 w-28 shrink-0 cursor-pointer overflow-hidden rounded-xl border-2',
                i === actual ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100',
              )}
            >
              <img src={url} alt="" loading="lazy" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
