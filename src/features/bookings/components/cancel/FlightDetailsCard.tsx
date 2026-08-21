import type { CancellableReservation } from '../../bookings.types';

interface FlightDetailsCardProps {
  reservation: CancellableReservation;
  title: string;
}

export const FlightDetailsCard = ({ reservation, title }: FlightDetailsCardProps) => {
  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-black/10 p-5">
      <h2 className="text-secondary flex flex-row items-center gap-2 font-bold">
        <span className="material-symbols-outlined" aria-hidden="true">
          flight_takeoff
        </span>
        {title}
      </h2>

      <div className="grid grid-cols-1 items-center gap-5 md:grid-cols-[auto_1fr_auto]">
        <img
          src={reservation.imageUrl}
          alt={`Vista de ${reservation.destination.city}`}
          className="h-30 w-full rounded-xl object-cover md:w-40"
        />

        <div className="flex flex-col gap-3">
          <div className="flex flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-secondary text-2xl font-bold">{reservation.origin.iata}</h3>
              <p className="text-neutral text-[14px]">{reservation.origin.city}</p>
            </div>
            <span className="material-symbols-outlined text-secondary" aria-hidden="true">
              flight
            </span>
            <div className="text-right">
              <h3 className="text-secondary text-2xl font-bold">{reservation.destination.iata}</h3>
              <p className="text-neutral text-[14px]">{reservation.destination.city}</p>
            </div>
          </div>

          <div className="flex flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-semibold">{reservation.departureTime}</h4>
              <p className="text-neutral text-[14px]">{reservation.departureDate}</p>
            </div>
            <div className="text-right">
              <h4 className="font-semibold">{reservation.arrivalTime}</h4>
              <p className="text-neutral text-[14px]">Duración: {reservation.duration}</p>
            </div>
          </div>
        </div>

        <dl className="flex flex-col gap-2 text-[14px] md:w-45">
          <div className="flex flex-row justify-between gap-4">
            <dt className="text-neutral">Vuelo</dt>
            <dd className="font-semibold">{reservation.flightNumber}</dd>
          </div>
          <div className="flex flex-row justify-between gap-4">
            <dt className="text-neutral">Reserva</dt>
            <dd className="font-semibold">{reservation.reservationId}</dd>
          </div>
          <div className="flex flex-row justify-between gap-4">
            <dt className="text-neutral">Tarifa</dt>
            <dd className="font-semibold">{reservation.fare}</dd>
          </div>
          <div className="flex flex-row justify-between gap-4">
            <dt className="text-neutral">Asientos</dt>
            <dd className="font-semibold">{reservation.seats.join(', ')}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
};
