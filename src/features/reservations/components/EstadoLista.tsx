import type { ReactNode } from 'react';

interface EstadoListaProps {
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  /** Lo que se muestra cuando ya cargó y no hay error. */
  children: ReactNode;
}

/** Cargando / error con reintento para las listas y pantallas de "Mis reservas". */
export const EstadoLista = ({ isLoading, error, onRetry, children }: EstadoListaProps) => {
  if (error) {
    return (
      <div
        role="alert"
        className="flex flex-col items-center gap-3 rounded-2xl border border-[#fca5a5] bg-[#fff5f5] p-8 text-center text-sm font-semibold text-[#b91c1c]"
      >
        {error}
        <button
          type="button"
          onClick={onRetry}
          className="text-secondary hover:border-secondary min-h-10 cursor-pointer rounded-lg border-[1.5px] border-gray-200 bg-white px-4 text-[13px] font-bold transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }
  if (isLoading) {
    return (
      <div role="status" aria-label="Cargando tus reservas" className="flex flex-col gap-4">
        <div className="h-36 animate-pulse rounded-[14px] bg-gray-200" />
        <div className="h-36 animate-pulse rounded-[14px] bg-gray-200" />
      </div>
    );
  }
  return <>{children}</>;
};

export const SinReservas = ({ children }: { children: ReactNode }) => (
  <div className="text-neutral rounded-2xl border border-dashed border-gray-200 p-10 text-center text-sm">
    {children}
  </div>
);
