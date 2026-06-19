import { CardImage } from '../../../components/ui/CardImage';

export const OffersDay = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[#EFF0FD] p-[70px_130px]">
      <div className="flex w-full flex-col gap-6">
        <div className="items-initial flex flex-col gap-1">
          <h2 className="text-secondary flex items-center gap-1 text-4xl font-semibold">
            <span className="material-symbols-outlined text-5xl! text-[#ac3500]">
              local_fire_department
            </span>
            Ofertas del Día
          </h2>
          <p className="text-[#44474E]">Vuelos seleccionados con descuentos exclusivos para hoy.</p>
        </div>
        <div className="mx-auto grid w-full grid-cols-1 gap-30 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          <CardImage
            country="Londres, Reino Unido"
            priceOffer={1630000}
            price={1125000}
            scale="direct"
            timeFly={16}
            variant="preview"
            imageUrl="/ru.webp"
          />
          <CardImage
            country="Kioto, Japón"
            priceOffer={4200000}
            price={3425000}
            scale="2 Escalas"
            timeFly={32}
            variant="preview"
            imageUrl="/kioto.webp"
          />
          <CardImage
            country="Maldivas"
            priceOffer={2800000}
            price={2350000}
            scale="1 Escala"
            timeFly={26}
            variant="preview"
            imageUrl="/maldivas.webp"
          />
        </div>
      </div>
    </div>
  );
};
