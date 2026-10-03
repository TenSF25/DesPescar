import type { ReactNode } from 'react';

interface FilterFieldProps {
  label: string;
  children: ReactNode;
}

/** Un filtro con su etiqueta en mayúsculas pequeñas, para las barras de filtros de los reportes. */
export const FilterField = ({ label, children }: FilterFieldProps) => (
  <div className="flex flex-col gap-1.5">
    <span className="text-xs font-semibold tracking-wide text-[#44474E] uppercase">{label}</span>
    {children}
  </div>
);
