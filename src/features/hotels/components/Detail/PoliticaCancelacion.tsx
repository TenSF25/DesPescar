import { cn } from '@/utils/cn';
import type { TramoCancelacion } from '../../hotels.types';
import { describirPolitica } from '../../politica';

/** Tramos de la política del proveedor. resaltar: índice del tramo que aplica (cancelación). */
export const PoliticaCancelacion = ({
  tramos,
  resaltar,
}: {
  tramos: TramoCancelacion[];
  resaltar?: number;
}) => (
  <ul className="flex flex-col gap-2">
    {describirPolitica(tramos).map((linea, i) => (
      <li
        key={linea.texto}
        className={cn(
          'flex items-center justify-between gap-4 rounded-xl border px-4 py-3 text-sm',
          i === resaltar ? 'border-primary bg-primary/5 font-semibold' : 'border-[#E2E8F0]',
        )}
      >
        <span className="text-secondary">{linea.texto}</span>
        <span className={linea.porcentaje > 0 ? 'text-success font-bold' : 'text-alert font-bold'}>
          {linea.porcentaje > 0 ? `${linea.porcentaje}% de reembolso` : 'Sin reembolso'}
        </span>
      </li>
    ))}
  </ul>
);
