import { Button } from '../../../../components/ui/Button';

interface ScheduleHeaderProps {
  origenCiudad: string;
  origenCodigo: string;
  destinoCiudad: string;
  destinoCodigo: string;
  fecha: string;
  pasajeros: number;
}

const formatearFecha = (fechaISO: string) => {
  if (!fechaISO) return '';
  const fecha = new Date(`${fechaISO}T00:00:00`);
  return new Intl.DateTimeFormat('es-AR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(fecha);
};

export const ScheduleHeader = ({
  origenCiudad,
  origenCodigo,
  destinoCiudad,
  destinoCodigo,
  fecha,
  pasajeros,
}: ScheduleHeaderProps) => {
  return (
    <div className="bg-secondary flex w-full flex-col gap-6 rounded-b-2xl p-6 text-white lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Cronograma de vuelos</h1>
        <p className="text-white/70">
          Elegí el vuelo que mejor se adapte a tu viaje. Búsqueda para {pasajeros} pasajeros
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-2xl font-bold">{origenCodigo}</p>
          <p className="text-sm text-white/60">{origenCiudad}</p>
        </div>
        <span className="material-symbols-outlined text-primary">flight</span>
        <div>
          <p className="text-2xl font-bold">{destinoCodigo}</p>
          <p className="text-sm text-white/60">{destinoCiudad}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/15 px-4 py-2">
        <span className="material-symbols-outlined text-[20px]">calendar_today</span>
        <div>
          <p className="text-xs text-white/60">Ida</p>
          <p className="font-semibold capitalize">{formatearFecha(fecha)}</p>
        </div>
      </div>

      <Button variant="primary" className="w-auto px-6 text-white lg:w-fit">
        <span className="material-symbols-outlined text-[18px]">edit</span>
        Modificar búsqueda
      </Button>
    </div>
  );
};
