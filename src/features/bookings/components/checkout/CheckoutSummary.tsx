import type { ReactNode } from 'react';
import type { FlightById } from '@/features/flights/flights.types';
import { formatDate } from '@/utils/formatDate';
import { formatMoney } from '@/utils/formatCurrency';

const FlightLeg = ({ label, flight }: { label: string; flight?: FlightById }) => {
  if (!flight) return null;

  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-bold tracking-wide text-gray-500 uppercase">{label}</span>
      <p className="text-secondary font-semibold">
        {flight.originAirport.city} ({flight.originAirport.code}) → {flight.destinationAirport.city}{' '}
        ({flight.destinationAirport.code})
      </p>
      <p className="text-sm text-gray-600">{formatDate(flight.departureTime)}</p>
      <p className="text-xs text-gray-500">
        {flight.airline.name} · {flight.flightNumber}
      </p>
    </div>
  );
};

interface CheckoutSummaryProps {
  departureFlight?: FlightById;
  returnFlight?: FlightById;
  passengerCount: number;
  fareName?: string;
  /** Importe a mostrar; `null` mientras se calcula. */
  total: number | null;
  currency?: string | null;
  totalLabel?: string;
  /** Aviso bajo el total (ej: "el importe definitivo lo confirma el pago"). */
  note?: string;
  /** Acciones (botón de continuar, errores) al pie del resumen. */
  children?: ReactNode;
}

/** Resumen de la compra, compartido por el paso de datos y el de pago. */
export const CheckoutSummary = ({
  departureFlight,
  returnFlight,
  passengerCount,
  fareName,
  total,
  currency,
  totalLabel = 'Total estimado',
  note,
  children,
}: CheckoutSummaryProps) => (
  <aside className="flex h-fit flex-col gap-4 rounded-2xl border border-black/10 bg-white p-5 sm:p-6 lg:sticky lg:top-24">
    <h2 className="text-secondary text-lg font-extrabold">Resumen de tu viaje</h2>

    <FlightLeg label="Ida" flight={departureFlight} />
    <FlightLeg label="Vuelta" flight={returnFlight} />
    {!departureFlight && <p className="text-sm text-gray-500">Cargando vuelo…</p>}

    <div className="flex flex-col gap-2 border-t border-black/10 pt-4 text-sm">
      <div className="flex justify-between gap-4">
        <span>{passengerCount === 1 ? '1 pasajero' : `${passengerCount} pasajeros`}</span>
        {fareName && <span className="text-gray-600">Tarifa {fareName}</span>}
      </div>
      <div className="text-secondary flex items-baseline justify-between gap-4">
        <span className="font-semibold">{totalLabel}</span>
        <span className="text-xl font-extrabold">
          {total !== null ? formatMoney(total, currency) : 'Calculando…'}
        </span>
      </div>
      {note && <p className="text-xs text-gray-500">{note}</p>}
    </div>

    {children}
  </aside>
);
