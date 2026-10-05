/** Estrellas del hotel (Font Awesome: Material Symbols se carga sin la variante rellena). */
export const Estrellas = ({ cantidad }: { cantidad: number }) => (
  <span
    className="flex gap-0.5 text-[13px] text-[#F5A524]"
    role="img"
    aria-label={`${cantidad} estrellas`}
  >
    {Array.from({ length: cantidad }, (_, i) => (
      <i key={i} className="fa-solid fa-star" aria-hidden="true" />
    ))}
  </span>
);
