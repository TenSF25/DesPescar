import { useState } from 'react';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { ModifySearch } from '@/features/flights/components/Results/ModifySearch';
import { HotelSearchForm } from '../components/HotelSearchForm';
import { HotelFiltersPanel } from '../components/Results/HotelFiltersPanel';
import { HotelList } from '../components/Results/HotelList';
import { HotelResultsHeader } from '../components/Results/HotelResultsHeader';
import { useHotelResults } from '../hooks/useHotelResults';

export const HotelResultsPage = () => {
  const [modificar, setModificar] = useState(false);
  const { params, hoteles, resultados, isLoading, error, filtros, setFiltros, orden, setOrden } =
    useHotelResults();

  return (
    <>
      <SectionContainer className="py-8">
        <HotelResultsHeader params={params} onModificar={() => setModificar(true)} />

        <div className="mt-6 flex w-full flex-col-reverse gap-6 lg:grid lg:grid-cols-[1fr_320px]">
          <div className="flex min-w-0 flex-col gap-6">
            {isLoading ? (
              <div className="flex h-64 w-full flex-col items-center justify-center gap-3 rounded-2xl border border-black/10 bg-white">
                <span className="material-symbols-outlined animate-spin text-4xl text-[#00205B]">
                  autorenew
                </span>
                <p className="font-semibold text-[#00205B]">Buscando hoteles...</p>
              </div>
            ) : error ? (
              <div className="flex h-64 w-full flex-col items-center justify-center gap-3 rounded-2xl border border-red-200 bg-red-50 text-red-600">
                <span className="material-symbols-outlined text-4xl">error</span>
                <p className="font-semibold">{error}</p>
              </div>
            ) : (
              <HotelList
                hoteles={resultados}
                params={params}
                orden={orden}
                onOrdenChange={setOrden}
              />
            )}
          </div>

          <aside className="w-full">
            <HotelFiltersPanel hoteles={hoteles} filtros={filtros} onChange={setFiltros} />
          </aside>
        </div>
      </SectionContainer>

      {modificar && (
        <ModifySearch onClose={() => setModificar(false)}>
          <HotelSearchForm initial={params} modal onClose={() => setModificar(false)} />
        </ModifySearch>
      )}
    </>
  );
};
