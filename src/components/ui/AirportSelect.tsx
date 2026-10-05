import type { Airport } from '@/types/Interfaces';
import { Input } from './Input';

interface AirportSelectProps {
  id: string;
  label: string;
  icon: string;
  texto: string;
  abierto: boolean;
  opciones: Airport[];
  error?: string | null;
  onFocus: () => void;
  onChange: (valor: string) => void;
  onSelect: (aero: Airport) => void;
  onClose: () => void;
}

/**
 * Campo de aeropuerto con lista desplegable: se abre al entrar al campo (sin escribir) y escribir
 * solo filtra. Únicamente se puede elegir una opción de la lista.
 */
export const AirportSelect = ({
  id,
  label,
  icon,
  texto,
  abierto,
  opciones,
  error,
  onFocus,
  onChange,
  onSelect,
  onClose,
}: AirportSelectProps) => {
  return (
    <div
      className="relative flex w-full flex-col"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) onClose();
      }}
    >
      <Input
        id={id}
        icon={icon}
        label={label}
        value={texto}
        autoComplete="off"
        onFocus={onFocus}
        onClick={onFocus}
        onChange={(e) => onChange(e.target.value)}
        className="h-16"
        error={error || undefined}
      />
      {abierto && (
        <ul
          // Evita que el clic en una opción le quite el foco al campo antes de registrarse.
          onMouseDown={(e) => e.preventDefault()}
          className="absolute top-[calc(100%+8px)] z-50 flex max-h-72 w-full [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.3)_transparent] flex-col overflow-y-auto rounded-xl border border-white/10 bg-slate-900/95 text-white shadow-xl backdrop-blur-xl"
        >
          <li className="sticky top-0 z-10 flex items-center gap-2 bg-slate-900/95 p-3 text-[11px] font-bold tracking-wider text-white/50 uppercase backdrop-blur-md">
            <span className="material-symbols-outlined text-[16px]">travel</span> Aeropuertos
          </li>
          {opciones.length === 0 ? (
            <li className="border-t border-white/5 p-3 text-sm text-white/60">
              No hay aeropuertos que coincidan.
            </li>
          ) : (
            opciones.map((aero) => (
              <li
                key={aero.id}
                className="flex cursor-pointer items-center justify-between gap-3 border-t border-white/5 px-4 py-3 transition-colors hover:bg-white/10"
                onClick={() => onSelect(aero)}
              >
                <span className="flex min-w-0 flex-col">
                  <span className="truncate text-sm font-semibold">{aero.city}</span>
                  <span className="text-xs leading-snug text-white/50">{aero.name}</span>
                </span>
                <span className="shrink-0 rounded-md bg-white/10 px-2 py-1 text-xs font-bold tracking-wider">
                  {aero.code}
                </span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};
