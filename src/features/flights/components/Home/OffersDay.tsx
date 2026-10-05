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
      <div className="mx-auto grid w-full grid-cols-1 gap-5 md:grid-cols-3">
        <CardFlight
          country="San Carlos de Bariloche, Río Negro"
          priceOffer={240000}
          price={185000}
          scale="direct"
          timeFly={2}
          variant="preview"
          imageUrl="/bariloche.jpg"
        />
        <CardFlight
          country="Ushuaia, Tierra del Fuego"
          priceOffer={310000}
          price={248000}
          scale="direct"
          timeFly={3}
          variant="preview"
          imageUrl="/ushuaia.jpg"
        />
        <CardFlight
          country="El Calafate, Santa Cruz"
          priceOffer={330000}
          price={269000}
          scale="1 Escala"
          timeFly={5}
          variant="preview"
          imageUrl="/calafate.jpg"
        />
      </div>
    </SectionContainer>
  );
};
