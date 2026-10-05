import { CARD } from '@/features/cart/components/estilos';
import type { FlightById } from '@/features/flights/flights.types';
import { formatFechaCorta, formatHuespedes, formatNoches } from '@/features/hotels/hotelFormat';
import { useFlightId } from '@/hooks/useAPI';
import { cn } from '@/utils/cn';
import { formatDate } from '@/utils/formatDate';
import type { ViajeGrupo as Viaje, VueloGrupo } from '../grupo.types';

const hora = (iso: string) => iso.slice(11, 16);

const Tramo = ({ etiqueta, vuelo }: { etiqueta: string; vuelo: FlightById }) => (
  <p className="text-secondary/80 text-sm">
    <span className="bg-secondary/5 text-secondary mr-2 rounded-md px-2 py-0.5 text-[11px] font-bold tracking-wide">
      {etiqueta}
    </span>
    {vuelo.originAirport.city} ({vuelo.originAirport.code}) → {vuelo.destinationAirport.city} (
    {vuelo.destinationAirport.code}) · {formatDate(vuelo.departureTime)},{' '}
    {hora(vuelo.departureTime)} h
  </p>
);

const Vuelo = ({ vuelo }: { vuelo: VueloGrupo }) => {
  const { flightById: ida } = useFlightId(vuelo.flightIds[0] ?? '');
  const { flightById: vuelta } = useFlightId(vuelo.flightIds[1] ?? '');
  return (
    <div className="flex flex-col gap-1">
      <p className="text-secondary font-semibold">
        <span aria-hidden className="material-symbols-outlined mr-1 align-middle text-[20px]">
          flight
        </span>
        Vuelo · {vuelo.cantidadPasajeros} {vuelo.cantidadPasajeros === 1 ? 'pasajero' : 'pasajeros'}{' '}
        · tarifa {vuelo.tarifas}
      </p>
      {ida ? (
        <Tramo etiqueta="IDA" vuelo={ida} />
      ) : (
        <p className="text-secondary/80 text-sm">
          Sale el {formatDate(vuelo.salida)}, {hora(vuelo.salida)} h.
        </p>
      )}
      {vuelta && <Tramo etiqueta="VUELTA" vuelo={vuelta} />}
    </div>
  );
};

/** El viaje que paga el grupo, sin pasajeros ni titulares (D-b18). */
export const ViajeGrupo = ({ viaje }: { viaje: Viaje }) => (
  <section aria-labelledby="viaje-grupo" className={cn('flex flex-col gap-3', CARD)}>
    <h2 id="viaje-grupo" className="text-secondary text-lg font-bold">
      El viaje
    </h2>
    {viaje.vuelo && <Vuelo vuelo={viaje.vuelo} />}
    {viaje.estadias.map((e, i) => (
      <div key={i} className="flex flex-col gap-1">
        <p className="text-secondary font-semibold">
          <span aria-hidden className="material-symbols-outlined mr-1 align-middle text-[20px]">
            hotel
          </span>
          {e.hotelNombre} · {e.ciudad}
        </p>
        <p className="text-secondary/80 text-sm">
          {e.cantidadHabitaciones} × {e.tipoHabitacionNombre} · {formatFechaCorta(e.checkIn)} –{' '}
          {formatFechaCorta(e.checkOut)} · {formatNoches(e.noches)} · {formatHuespedes(e.huespedes)}
        </p>
      </div>
    ))}
    {!viaje.vuelo && viaje.estadias.length === 0 && (
      <p className="text-secondary/70 text-sm">Sin detalle del viaje.</p>
    )}
  </section>
);
