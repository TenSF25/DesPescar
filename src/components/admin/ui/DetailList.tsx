import type { ReactNode } from 'react';

export interface DetailItem {
  label: string;
  value: ReactNode;
}

interface DetailListProps {
  items: DetailItem[];
}

/** Lista de pares etiqueta / valor en dos columnas, para los modales de detalle. */
export const DetailList = ({ items }: DetailListProps) => {
  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
      {items.map((item) => (
        <div key={item.label} className="flex min-w-0 flex-col gap-1">
          <dt className="text-xs font-semibold tracking-wide text-[#44474E] uppercase">
            {item.label}
          </dt>
          <dd className="text-secondary font-semibold wrap-break-word">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
};
