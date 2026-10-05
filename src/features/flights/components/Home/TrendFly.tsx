import { CardImage } from '@/components/ui/CardImage';
import { SectionContainer } from '@/components/ui/SectionContainer';

export const TrendFly = () => {
  return (
    <SectionContainer>
      <div className="mx-auto flex max-w-370 flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-secondary text-4xl font-semibold">Destinos en Tendencia</h2>
          <p className="text-[#44474E]">Tendencias que se convierten en experiencias.</p>
        </div>
        <div className="grid grid-cols-1 gap-10 md:h-200 md:grid-cols-2 md:gap-20">
          <CardImage
            country="Salta"
            city="Salta"
            imageUrl="/salta.jpg"
            description="Recorré la Salta la Linda y sus paisajes de colores."
          />
          <div className="grid gap-10 md:grid-cols-2">
            <CardImage
              country="Mendoza"
              city="Mendoza"
              imageUrl="/mendoza.jpg"
              description="Viñedos, vino y la cordillera de los Andes."
            />
            <CardImage
              country="Córdoba"
              city="Córdoba"
              imageUrl="/cordoba.jpg"
              description="Sierras, historia y mucha vida cultural."
            />
            <div className="col-span-full">
              <CardImage
                country="Cataratas del Iguazú"
                city="Misiones"
                imageUrl="/iguazu.jpg"
                description="Una de las maravillas naturales del mundo, en plena selva."
              />
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};
