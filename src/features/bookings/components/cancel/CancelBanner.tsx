import { cn } from '../../../../utils/cn';

interface CancelBannerProps {
  variant: 'form' | 'success';
  onBack?: () => void;
}

export const CancelBanner = ({ variant, onBack }: CancelBannerProps) => {
  const isSuccess = variant === 'success';

  return (
    <div
      role={isSuccess ? 'status' : undefined}
      className="bg-secondary relative flex flex-row items-center gap-4 overflow-hidden rounded-2xl p-6 text-white"
    >
      {isSuccess ? (
        <span
          className="bg-success flex items-center justify-center rounded-full p-2"
          aria-hidden="true"
        >
          <span className="material-symbols-outlined">check</span>
        </span>
      ) : (
        <button
          type="button"
          onClick={onBack}
          aria-label="Volver"
          className="flex cursor-pointer items-center justify-center rounded-full bg-white/10 p-2 transition-colors duration-200 hover:bg-white/20"
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            arrow_back
          </span>
        </button>
      )}

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">
          {isSuccess ? 'Cancelación confirmada' : 'Cancelar vuelo'}
        </h1>
        <p className="text-[14px] text-white/80">
          {isSuccess
            ? 'Tu vuelo ha sido cancelado correctamente.'
            : 'Estás por cancelar tu reserva. Revisá los detalles antes de confirmar.'}
        </p>
      </div>

      <span
        className={cn(
          'material-symbols-outlined absolute right-8 text-[64px]! text-white/20',
          'hidden md:block',
        )}
        aria-hidden="true"
      >
        flight
      </span>
    </div>
  );
};
