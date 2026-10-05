import type { Servicio } from '../hotels.types';
import { SERVICIO_INFO } from '../servicios';

export const ServiciosIcons = ({ servicios, max = 6 }: { servicios: Servicio[]; max?: number }) => (
  <div className="flex flex-wrap items-center gap-3">
    {servicios.slice(0, max).map((s) => (
      <span
        key={s}
        title={SERVICIO_INFO[s].label}
        className="material-symbols-outlined text-secondary/60 text-[18px]"
      >
        {SERVICIO_INFO[s].icon}
      </span>
    ))}
    {servicios.length > max && (
      <span className="text-secondary/50 text-xs font-semibold">+{servicios.length - max}</span>
    )}
  </div>
);
