import { useParams } from 'react-router';
import { useReservation } from '@/features/reservations/hooks/useReservations';
import { formatCurrency } from '@/utils/formatCurrency';
import { BackButton } from '@/features/reservations/components/BackButton';

const passengers = [
  { initials: 'NM', name: 'Noelia Montecinos', bg: 'bg-primary' },
  { initials: 'LN', name: 'Luciano Nuñez', bg: 'bg-secondary' },
];

const conditions = [
  { ok: true, label: 'Cambio de fecha', detail: 'Permitido con cargo ($112.000/pax)' },
  { ok: false, label: 'Reembolso', detail: 'Parcial según tiempo restante' },
  { ok: true, label: 'Equipaje de mano', detail: '1 pieza 8 kg incluida' },
  { ok: true, label: 'Maleta facturada', detail: '1 pieza 23 kg incluida' },
  { ok: true, label: 'Selección de asiento', detail: 'Incluida en la tarifa' },
  { ok: true, label: 'Millas acumuladas', detail: '100% de millas Aerolíneas Plus' },
];

export const FlightDetailsPage = () => {
  const { id } = useParams();
  const flight = useReservation(id);

  if (!flight) {
    return (
      <div>
        <BackButton />
        <p className="text-neutral text-sm">No se encontró ese vuelo.</p>
      </div>
    );
  }

  const { origin, destination, flightNumber, reservationCode, totalPaid = 0 } = flight;
  const taxes = Math.round(totalPaid * 0.115);
  const fareLines = [
    { label: 'Tarifa base', value: formatCurrency(totalPaid - taxes) },
    { label: 'Tasas e impuestos', value: formatCurrency(taxes) },
    { label: 'Equipaje facturado', value: 'Incluido' },
  ];
  const colores = ['bg-primary', 'bg-secondary'];
  const passengerList = flight.passengers
    ? flight.passengers.map((name, i) => ({
        initials: name
          .split(' ')
          .map((n) => n[0])
          .slice(0, 2)
          .join('')
          .toUpperCase(),
        name,
        bg: colores[i % colores.length],
      }))
    : passengers;

  return (
    <div>
      <BackButton />

      <div className="mb-5 overflow-hidden rounded-[14px] border border-gray-200 bg-white">
        <div className="bg-secondary px-7 py-5">
          <div className="mb-1.5 text-[11px] font-bold tracking-wide text-white/50 uppercase">
            Detalles del vuelo
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-extrabold text-white">{origin.iata}</span>
            <span className="material-symbols-outlined text-[20px]! text-white/50">
              flight_takeoff
            </span>
            <span className="text-2xl font-extrabold text-white">{destination.iata}</span>
            <div className="ml-auto text-right">
              <div className="text-[11px] font-semibold text-white/50">Vuelo · Reserva</div>
              <div className="text-base font-extrabold text-white">
                {flightNumber} · {reservationCode}
              </div>
            </div>
          </div>
        </div>

        <div className="px-7 pt-7 pb-5">
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
                <div className="text-xs font-bold text-gray-400">⏱ Duración: 11h 25min</div>
                <div className="h-5 w-px bg-gray-200" />
                <div className="text-xs font-bold text-gray-400">✈ {flightNumber}</div>
              </div>

              <div>
                <div className="text-secondary text-xl leading-none font-extrabold">
                  {destination.time}
                </div>
                <div className="text-secondary mt-0.5 text-sm font-bold">
                  Aeropuerto {destination.city}
                </div>
                <div className="text-xs font-semibold text-gray-400">{destination.iata}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-5 flex flex-col gap-4 lg:flex-row">
        <div className="flex-1 rounded-[14px] border border-gray-200 bg-white p-5">
          <div className="mb-3.5 text-xs font-extrabold tracking-wide text-gray-400 uppercase">
            Pasajeros
          </div>
          <div className="flex flex-col gap-3">
            {passengerList.map((p) => (
              <div key={p.name} className="flex items-center gap-3 rounded-[10px] bg-gray-100 p-3">
                <div
                  className={`h-9 w-9 shrink-0 rounded-full ${p.bg} flex items-center justify-center text-[13px] font-extrabold text-white`}
                >
                  {p.initials}
                </div>
                <div>
                  <div className="text-secondary text-sm font-extrabold">{p.name}</div>
                  <div className="text-xs font-semibold text-gray-400">Asiento · Adulto</div>
                </div>
              </div>
            ))}
          </div>
        </div>

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
            <div className="flex justify-between text-xs font-bold text-[#22c55e]">
              <span>Ahorro aplicado</span>
              <span>– {formatCurrency(Math.round(totalPaid * 0.21))}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[14px] border border-gray-200 bg-white p-5">
        <div className="mb-3.5 text-xs font-extrabold tracking-wide text-gray-400 uppercase">
          Condiciones de la tarifa
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {conditions.map((c) => (
            <div key={c.label} className="flex items-start gap-2.5">
              <span
                className={`material-symbols-outlined mt-0.5 text-[16px]! ${
                  c.ok ? 'text-[#22c55e]' : 'text-primary'
                }`}
              >
                {c.ok ? 'check' : 'error_outline'}
              </span>
              <div>
                <div className="text-secondary text-[13px] font-bold">{c.label}</div>
                <div className="text-xs font-semibold text-gray-400">{c.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
