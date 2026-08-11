import { cn } from '../../../utils/cn';
import type { FlightReservation } from '../reservations.types';

interface FlightCardProps {
  flight: FlightReservation;
  onManage?: (id: string) => void;
  onViewDetails?: (id: string) => void;
  onCancel?: (id: string) => void;
}

export const FlightCard = ({ flight, onManage, onViewDetails, onCancel }: FlightCardProps) => {
  const { origin, destination, flightNumber, seats, reservationCode, status, nextDayArrival } =
    flight;
  const isCompleted = status === 'completed';

  return (
    <div
      className={cn(
        'mb-4 flex items-stretch overflow-hidden rounded-[14px] border border-gray-200 bg-white transition-shadow hover:shadow-[0_4px_20px_rgba(13,27,62,.08)]',
        isCompleted && 'opacity-88',
      )}
    >
      <img
        src={flight.thumbnail}
        alt={destination.city}
        className="w-25 shrink-0 object-cover"
      />

      <div className="flex flex-1 items-center gap-0 px-6 py-5">
        <div className="flex flex-1 items-center gap-6">
          <div className="flex flex-col gap-0.5">
            <span
              className={cn(
                'text-[26px] leading-tight font-extrabold tracking-tight',
                isCompleted ? 'text-gray-700' : 'text-secondary',
              )}
            >
              {origin.iata}
            </span>
            <span className="text-xs font-semibold text-gray-400">{origin.city}</span>
            <span
              className={cn(
                'mt-1.5 text-lg font-bold',
                isCompleted ? 'text-gray-700' : 'text-secondary',
              )}
            >
              {origin.time}
            </span>
            {origin.date && (
              <span className="text-[11px] font-semibold text-gray-400">{origin.date}</span>
            )}
          </div>

          <div className="flex shrink-0 flex-col items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[22px]!">
              flight_takeoff
            </span>
            <div className="flex items-center gap-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-1.5 w-1.5 rounded-full bg-gray-200" />
              ))}
            </div>
            {status === 'upcoming' && (
              <span className="rounded-full bg-[#e8f5e9] px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-[#2e7d32] uppercase">
                Próximo
              </span>
            )}
          </div>

          <div className="flex flex-col items-end gap-0.5 text-right">
            <span
              className={cn(
                'text-[26px] leading-tight font-extrabold tracking-tight',
                isCompleted ? 'text-gray-700' : 'text-secondary',
              )}
            >
              {destination.iata}
            </span>
            <span className="text-xs font-semibold text-gray-400">{destination.city}</span>
            <span
              className={cn(
                'mt-1.5 text-lg font-bold',
                isCompleted ? 'text-gray-700' : 'text-secondary',
              )}
            >
              {destination.time}
              {nextDayArrival && (
                <span className="text-primary align-super text-[10px]">+1</span>
              )}
            </span>
          </div>
        </div>

        <div className="ml-7 flex min-w-40 flex-col gap-1.5 border-l border-gray-200 pl-7 text-[13px]">
          <div className="flex items-center gap-2">
            <span className="min-w-16 font-semibold text-gray-400">Vuelo</span>
            <span className="text-secondary font-bold">{flightNumber}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="min-w-16 font-semibold text-gray-400">Asientos</span>
            <span className="text-secondary font-bold">{seats}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="min-w-16 font-semibold text-gray-400">Reserva</span>
            <span className="text-secondary font-bold">{reservationCode}</span>
          </div>
        </div>
      </div>

      <div className="relative flex min-w-45 flex-col justify-center gap-2.5 border-l border-gray-200 px-6 py-5">
        <button
          type="button"
          onClick={() => onManage?.(flight.id)}
          className="bg-primary hover:bg-primary/90 cursor-pointer rounded-lg px-4 py-2.5 text-center text-[13px] font-bold whitespace-nowrap text-white transition-colors"
        >
          Gestionar viaje
        </button>
        <button
          type="button"
          onClick={() => onViewDetails?.(flight.id)}
          className="text-secondary hover:border-secondary hover:bg-gray-100 cursor-pointer rounded-lg border-[1.5px] border-gray-200 px-4 py-[9px] text-center text-[13px] font-bold whitespace-nowrap transition-colors"
        >
          Ver detalles
        </button>
        <button
          type="button"
          onClick={() => onCancel?.(flight.id)}
          className="text-alert cursor-pointer py-0.5 text-center text-xs font-semibold transition-opacity hover:opacity-70"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};
