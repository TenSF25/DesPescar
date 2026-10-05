import { Link, useParams } from 'react-router';
import { useReservation } from '@/features/reservations/hooks/useReservations';
import { formatCurrency } from '@/utils/formatCurrency';
import { BackButton } from '@/features/reservations/components/BackButton';
import { EstadoLista } from '@/features/reservations/components/EstadoLista';

const ESTADO = {
  upcoming: 'Confirmada',
  completed: 'Completada',
  cancelled: 'Cancelada',
} as const;

export const FlightDetailsPage = () => {
  const { id } = useParams();
  const { flight, isLoading, error, recargar } = useReservation(id);

  if (!flight) {
    return (
      <div>
        <BackButton />
        <EstadoLista isLoading={isLoading} error={error} onRetry={recargar}>
          <p className="text-neutral text-sm">No se encontró esa reserva.</p>
        </EstadoLista>
      </div>
    );
  }

  const { origin, destination, flightNumber, reservationCode, totalPaid = 0, hotels } = flight;
  const fareLines = [
    ...(flight.flightPrice != null
      ? [{ label: 'Vuelo', value: formatCurrency(flight.flightPrice) }]
      : []),
    ...hotels.map((h) => ({
      label: `${h.name} · ${h.nights} ${h.nights === 1 ? 'noche' : 'noches'}`,
      value: formatCurrency(h.price),
    })),
  ];
  const colores = ['bg-primary', 'bg-secondary'];
  const seatList = flight.seats ? flight.seats.split(', ') : [];
  const passengerList = (flight.passengers ?? []).map((name, i) => ({
    initials: name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase(),
    name,
    seat: seatList[i],
    bg: colores[i % colores.length],
  }));

  return (
    <div>
      <BackButton />

      {origin && destination && (
        <div className="mb-5 overflow-hidden rounded-[14px] border border-gray-200 bg-white">
          <div className="bg-secondary px-4 py-5 sm:px-7">
            <div className="mb-1.5 text-[11px] font-bold tracking-wide text-white/50 uppercase">
              Detalles del vuelo
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="text-2xl font-extrabold text-white">{origin.iata}</span>
              <span className="material-symbols-outlined text-[20px]! text-white/50">
                flight_takeoff
              </span>
              <span className="text-2xl font-extrabold text-white">{destination.iata}</span>
              <div className="sm:ml-auto sm:text-right">
                <div className="text-[11px] font-semibold text-white/50">Vuelo · Reserva</div>
                <div className="text-base font-extrabold text-white">
                  {flightNumber} · {reservationCode}
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 pt-7 pb-5 sm:px-7">
            <div className="flex items-stretch gap-0">
              <div className="mr-5 flex flex-col items-center pt-1">
                <div className="bg-secondary h-3 w-3 shrink-0 rounded-full" />
                <div className="my-1 min-h-15 w-0.5 flex-1 bg-gray-200" />
                <span className="material-symbols-outlined text-primary text-[18px]!">
                  flight_takeoff
                </span>
                <div className="my-1 min-h-15 w-0.5 flex-1 bg-gray-200" />
                <div className="bg-primary h-3 w-3 shrink-0 rounded-full" />
              </div>

              <div className="flex flex-1 flex-col justify-between gap-5">
                <div>
                  <div className="text-secondary text-xl leading-none font-extrabold">
                    {origin.time}
                  </div>
                  <div className="text-secondary mt-0.5 text-sm font-bold">
                    Aeropuerto {origin.city}
                  </div>
                  <div className="text-xs font-semibold text-gray-400">
                    {origin.iata} · {origin.date}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 rounded-[10px] bg-gray-100 px-4 py-3">
                  <div className="text-xs font-bold text-gray-400">✈ Vuelo directo</div>
                  <div className="h-5 w-px bg-gray-200" />
                  {flight.duration && (
                    <>
                      <div className="text-xs font-bold text-gray-400">
                        ⏱ Duración: {flight.duration}
                      </div>
                      <div className="h-5 w-px bg-gray-200" />
                    </>
                  )}
                  <div className="text-xs font-bold text-gray-400">✈ {flightNumber}</div>
                </div>

                <div>
                  <div className="text-secondary text-xl leading-none font-extrabold">
                    {destination.time}
                  </div>
                  <div className="text-secondary mt-0.5 text-sm font-bold">
                    Aeropuerto {destination.city}
                  </div>
                  <div className="text-xs font-semibold text-gray-400">
                    {destination.iata}
                    {flight.returnDate && ` · Vuelta el ${flight.returnDate}`}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {hotels.map((h) => (
        <div
          key={h.id}
          className="mb-5 overflow-hidden rounded-[14px] border border-gray-200 bg-white"
        >
          <div className="bg-secondary px-4 py-5 sm:px-7">
            <div className="mb-1.5 text-[11px] font-bold tracking-wide text-white/50 uppercase">
              Hotel · Reserva {reservationCode}
            </div>
            <div className="text-2xl font-extrabold text-white">{h.name}</div>
            <div className="text-[13px] font-semibold text-white/60">
              {h.city} · {h.room}
            </div>
          </div>
          <div className="flex flex-wrap gap-x-10 gap-y-3 px-4 py-5 sm:px-7">
            <div>
              <div className="text-xs font-semibold text-gray-400">Check-in</div>
              <div className="text-secondary text-sm font-extrabold">{h.checkIn}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-400">Check-out</div>
              <div className="text-secondary text-sm font-extrabold">{h.checkOut}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-400">Noches</div>
              <div className="text-secondary text-sm font-extrabold">{h.nights}</div>
            </div>
            {h.holder && (
              <div>
                <div className="text-xs font-semibold text-gray-400">Titular</div>
                <div className="text-secondary text-sm font-extrabold">{h.holder}</div>
              </div>
            )}
          </div>
        </div>
      ))}

      <div className="mb-5 flex flex-col gap-4 lg:flex-row">
        {passengerList.length > 0 && (
          <div className="flex-1 rounded-[14px] border border-gray-200 bg-white p-5">
            <div className="mb-3.5 text-xs font-extrabold tracking-wide text-gray-400 uppercase">
              Pasajeros
            </div>
            <div className="flex flex-col gap-3">
              {passengerList.map((p) => (
                <div
                  key={p.name}
                  className="flex items-center gap-3 rounded-[10px] bg-gray-100 p-3"
                >
                  <div
                    className={`h-9 w-9 shrink-0 rounded-full ${p.bg} flex items-center justify-center text-[13px] font-extrabold text-white`}
                  >
                    {p.initials}
                  </div>
                  <div>
                    <div className="text-secondary text-sm font-extrabold">{p.name}</div>
                    <div className="text-xs font-semibold text-gray-400">
                      {p.seat ? `Asiento ${p.seat}` : 'Asiento sin asignar'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 rounded-[14px] border border-gray-200 bg-white p-5">
          <div className="mb-3.5 text-xs font-extrabold tracking-wide text-gray-400 uppercase">
            Resumen de tarifa
          </div>
          <div className="flex flex-col gap-2 text-[13px] font-semibold">
            {fareLines.map((line) => (
              <div key={line.label} className="flex justify-between text-gray-700">
                <span>{line.label}</span>
                <span className="text-secondary font-extrabold">{line.value}</span>
              </div>
            ))}
            <div className="my-1 h-px bg-gray-200" />
            <div className="text-secondary flex justify-between text-[15px] font-extrabold">
              <span>Total pagado</span>
              <span>{formatCurrency(totalPaid)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[14px] border border-gray-200 bg-white p-5">
        <div className="mb-3.5 text-xs font-extrabold tracking-wide text-gray-400 uppercase">
          Estado de la reserva
        </div>
        <div className="text-secondary text-sm font-extrabold">{ESTADO[flight.status]}</div>
        {flight.status === 'cancelled' && flight.refunded != null && (
          <div className="mt-1 text-[13px] font-semibold text-gray-700">
            {flight.refunded > 0
              ? `Te devolvemos ${formatCurrency(flight.refunded)} al medio de pago.`
              : 'Esta cancelación no tuvo reembolso según las condiciones de la reserva.'}
            {flight.refunded > 0 && flight.refundPending && ' El reembolso está en proceso.'}
            {flight.refunded > 0 &&
              flight.groupPaid &&
              ' Como se pagó en grupo, vuelve a cada persona en proporción a lo que pagó.'}
          </div>
        )}
        {flight.status === 'upcoming' && (
          <Link
            to={`/my-reservations/${flight.id}/cancel`}
            className="text-alert mt-2 inline-flex min-h-10 items-center text-[13px] font-bold hover:opacity-70"
          >
            Cancelar la reserva y ver cuánto se reembolsa
          </Link>
        )}
      </div>
    </div>
  );
};
