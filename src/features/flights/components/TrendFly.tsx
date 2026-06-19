import { CardImage } from '../../../components/ui/CardImage';

export const TrendFly = () => {
  return (
    <div className="flex flex-col gap-6 p-[70px_130px]">
      <div className="flex flex-col gap-1">
        <h2 className="text-secondary text-4xl font-semibold">Destinos en Tendencia</h2>
        <p className="text-[#44474E]">Tendencias que se convierten en experiencias.</p>
      </div>
      <div className="grid h-200 grid-cols-2 gap-20">
        <CardImage
          variant="full"
          country="Venecia"
          city="Italia"
          imageUrl="/venecia.webp"
          description="Experimenta la mágia de las calles flotantes."
        />
        <div className="grid gap-10 md:grid-cols-2">
          <CardImage
            variant="full"
            country="Suiza"
            city="Zermatt"
            imageUrl="/suiza.webp"
            description="Descubri la mágia de los Alpes suizos."
          />
          <CardImage
            variant="full"
            country="Florida"
            city="Miami"
            imageUrl="/miami.webp"
            description="Viví el ritmo, las playas y la energía de miami."
          />
          <div className="col-span-full">
            <CardImage
              variant="full"
              country="Noruega"
              city="Fiordos"
              imageUrl="/fiordos.webp"
              description="Donde la naturaleza se convierte en espectáculo."
            />
          </div>
        </div>
      </div>
    </div>
  );
};
