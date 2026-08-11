import { Search } from '../../../../components/ui/Search';

export const SearchFly = () => {
  return (
    <div className="flex h-200 w-full flex-col items-center justify-center gap-12 bg-[url(/bgSearch.webp)] bg-cover bg-center bg-no-repeat">
      <div className="flex flex-col items-center justify-center gap-6">
        <h1 className="w-max-180 w-full text-center text-2xl font-extrabold text-white sm:text-4xl md:text-6xl">
          Viajar bien empieza con una buena elección.
        </h1>
        <h3 className="text-[14px] font-semibold text-white md:text-2xl">
          "No colecciones cosas, coleccioná viajes"
        </h3>
      </div>
      <Search />
    </div>
  );
};
