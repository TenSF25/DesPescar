export const Estrellas = ({ cantidad }: { cantidad: number }) => (
  <span className="flex text-[#F5A524]" aria-label={`${cantidad} estrellas`}>
    {Array.from({ length: cantidad }, (_, i) => (
      <span
        key={i}
        className="material-symbols-outlined text-[16px]"
        style={{ fontVariationSettings: "'FILL' 1" }}
      >
        star
      </span>
    ))}
  </span>
);
