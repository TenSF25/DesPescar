import { CardFlight } from '@/components/ui/CardFlight';
import { SectionContainer } from '@/components/ui/SectionContainer';

export const OffersDay = () => {
  return (
    <SectionContainer>
      <div className="items-initial flex flex-col gap-1">
        <h2 className="text-secondary flex items-center gap-1 text-4xl font-semibold">
          <span className="material-symbols-outlined text-5xl! text-[#ac3500]">
            local_fire_department
          </span>
          Ofertas del Día
        </h2>
        <p className="text-[#44474E]">Vuelos seleccionados con descuentos exclusivos para hoy.</p>
      </div>
      <div className="gird-cols-1 mx-auto grid w-full gap-5 md:grid-cols-3">
        <CardFlight
          country="Londres, Reino Unido"
          priceOffer={1630000}
          price={1125000}
          scale="direct"
          timeFly={16}
          variant="preview"
          imageUrl="/ru.webp"
        />
        <CardFlight
          country="Kioto, Japón"
          priceOffer={4200000}
          price={3425000}
          scale="2 Escalas"
          timeFly={32}
          variant="preview"
          imageUrl="/kioto.webp"
        />
        <CardFlight
          country="Maldivas"
          priceOffer={2800000}
          price={2350000}
          scale="1 Escala"
          timeFly={26}
          variant="preview"
          imageUrl="/maldivas.webp"
        />
      </div>
    </SectionContainer>
  );
};
