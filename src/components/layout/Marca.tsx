interface MarcaProps {
  variante?: 'claro' | 'oscuro';
  tamano?: 'sm' | 'lg';
}

export const Marca = ({ variante = 'claro', tamano = 'lg' }: MarcaProps) => {
  const oscuro = variante === 'oscuro';
  const grande = tamano === 'lg';

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <img
        src="/despescar-isotipo.webp"
        alt=""
        className={grande ? 'h-8 w-auto sm:h-11' : 'h-8 w-auto'}
      />
      <div className="flex flex-col items-start">
        <h3
          className={`${grande ? 'text-xl sm:text-3xl' : 'text-xl'} leading-none font-bold tracking-widest ${
            oscuro ? 'text-white' : 'text-secondary'
          }`}
        >
          DESPESCAR
        </h3>
        <span
          className={`${grande ? 'hidden sm:flex' : 'flex'} text-primary mt-1 items-center gap-1.5 text-[9px] font-semibold tracking-[0.2em] uppercase`}
        >
          <span aria-hidden="true" className="bg-primary h-px w-3" />
          Vuela diferente
          <span aria-hidden="true" className="bg-primary h-px w-3" />
        </span>
      </div>
    </div>
  );
};
