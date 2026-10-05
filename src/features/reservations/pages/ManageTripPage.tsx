import { useState } from 'react';
import { useParams } from 'react-router';
import { cn } from '@/utils/cn';
import { useReservation } from '@/features/reservations/hooks/useReservations';
import { BackButton } from '@/features/reservations/components/BackButton';
import { EstadoLista } from '@/features/reservations/components/EstadoLista';

type Section = 'asiento' | 'equipaje' | 'servicios' | 'docs' | 'check';

const mgrTabs: { id: Section; label: string; icon: string }[] = [
  { id: 'asiento', label: 'Asientos', icon: '🪑' },
  { id: 'equipaje', label: 'Equipaje', icon: '🧳' },
  { id: 'servicios', label: 'Servicios extra', icon: '✨' },
  { id: 'docs', label: 'Documentos', icon: '📄' },
  { id: 'check', label: 'Check-in', icon: '✅' },
];

type SeatState = 'free' | 'occupied' | 'selected';

const seatRows: SeatState[][] = [
  ['occupied', 'occupied', 'free', 'occupied', 'occupied', 'free'],
  ['free', 'free', 'selected', 'free', 'selected', 'free'],
  ['occupied', 'occupied', 'free', 'free', 'free', 'occupied'],
  ['free', 'free', 'free', 'free', 'free', 'free'],
  ['free', 'free', 'free', 'free', 'free', 'free'],
  ['free', 'free', 'free', 'free', 'free', 'free'],
  ['free', 'free', 'free', 'free', 'free', 'free'],
  ['free', 'free', 'free', 'free', 'free', 'free'],
];

const seatColor: Record<SeatState, string> = {
  occupied: 'bg-[#e53935] border-[#ef9a9a]',
  free: 'bg-[#e8f5e9] border-[#a5d6a7] cursor-pointer',
  selected: 'bg-primary border-[#e06b10] cursor-pointer',
};

export const ManageTripPage = () => {
  const { id } = useParams();
  const { flight, isLoading, error, recargar } = useReservation(id);
  const [activeSection, setActiveSection] = useState<Section>('asiento');

  if (!flight || !flight.origin || !flight.destination) {
    return (
      <div>
        <BackButton />
        <EstadoLista isLoading={isLoading} error={error} onRetry={recargar}>
          <p className="text-neutral text-sm">
            {flight ? 'Esta reserva no tiene vuelo para gestionar.' : 'No se encontró esa reserva.'}
          </p>
        </EstadoLista>
      </div>
    );
  }

  const { origin, destination, flightNumber, seats, reservationCode } = flight;
  const seatList = seats.split(', ');
  const checkInPassengers = (flight.passengers ?? []).map((name, i) => ({
    label: `Pasajero ${i + 1}`,
    name,
    doc: seatList[i] ? `Asiento ${seatList[i]}` : 'Asiento sin asignar',
  }));

  return (
    <div>
      <BackButton />

      <div className="mb-6 overflow-hidden rounded-[14px] border border-gray-200 bg-white">
        <div className="bg-secondary flex flex-wrap items-center gap-x-5 gap-y-3 px-4 py-5 sm:px-7">
          <div>
            <div className="mb-1 text-[11px] font-bold tracking-wide text-white/50 uppercase">
              Vuelo seleccionado
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="text-2xl font-extrabold text-white">{origin.iata}</span>
              <span className="material-symbols-outlined text-[20px]! text-white/60">
                flight_takeoff
              </span>
              <span className="text-2xl font-extrabold text-white">{destination.iata}</span>
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-bold text-white sm:ml-2">
                {flightNumber} · Reserva {reservationCode}
              </span>
            </div>
            <div className="mt-1.5 text-[13px] font-semibold text-white/55">
              {origin.date} &nbsp;·&nbsp; {origin.time} → {destination.time} &nbsp;·&nbsp; Asientos{' '}
              {seats}
            </div>
          </div>
          <div className="sm:ml-auto sm:text-right">
            <div className="text-[11px] font-semibold text-white/50">Estado</div>
            <div className="mt-1 flex items-center gap-1.5">
              <span
                className={cn(
                  'h-2 w-2 rounded-full',
                  flight.status === 'cancelled' ? 'bg-[#fca5a5]' : 'bg-[#22c55e]',
                )}
              />
              <span
                className={cn(
                  'text-sm font-extrabold',
                  flight.status === 'cancelled' ? 'text-[#fca5a5]' : 'text-[#22c55e]',
                )}
              >
                {flight.status === 'cancelled'
                  ? 'Cancelado'
                  : flight.status === 'completed'
                    ? 'Completado'
                    : 'Confirmado'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex overflow-x-auto border-b border-gray-200">
          {mgrTabs.map(({ id: sectionId, label, icon }) => (
            <button
              key={sectionId}
              type="button"
              onClick={() => setActiveSection(sectionId)}
              className={cn(
                'shrink-0 cursor-pointer px-5 py-3.5 text-sm font-bold whitespace-nowrap transition-colors',
                activeSection === sectionId
                  ? 'border-primary text-primary border-b-2'
                  : 'hover:text-secondary border-b-2 border-transparent text-gray-400',
              )}
            >
              {icon} {label}
            </button>
          ))}
        </div>

        {activeSection === 'asiento' && (
          <div className="p-7">
            <div className="text-secondary mb-4 text-base font-extrabold">
              Selección de asientos
            </div>
            <div className="flex flex-col items-start gap-6 lg:flex-row">
              <div className="shrink-0 rounded-xl bg-gray-100 p-5">
                <div className="mb-3 text-center text-[11px] font-bold tracking-wide text-gray-400 uppercase">
                  Cabina Económica · Boeing 787
                </div>
                <div className="mb-3.5 flex justify-center gap-3 text-[11px] font-bold text-gray-400">
                  <span className="flex items-center gap-1">
                    <span className="bg-primary inline-block h-3 w-3 rounded" /> Tu asiento
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="inline-block h-3 w-3 rounded bg-[#e53935]" /> Ocupado
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="inline-block h-3 w-3 rounded border border-[#a5d6a7] bg-[#e8f5e9]" />
                    Libre
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="mb-1 flex items-center justify-center gap-1">
                    <div className="w-5.5" />
                    {['A', 'B', 'C'].map((l) => (
                      <div
                        key={l}
                        className="w-6 text-center text-[10px] font-extrabold text-gray-400"
                      >
                        {l}
                      </div>
                    ))}
                    <div className="w-2.5" />
                    {['D', 'E', 'F'].map((l) => (
                      <div
                        key={l}
                        className="w-6 text-center text-[10px] font-extrabold text-gray-400"
                      >
                        {l}
                      </div>
                    ))}
                  </div>
                  {seatRows.map((row, rowIdx) => (
                    <div key={rowIdx} className="flex items-center justify-center gap-1">
                      <div className="w-5.5 pr-1 text-right text-[10px] font-bold text-gray-400">
                        {rowIdx + 1}
                      </div>
                      {row.slice(0, 3).map((state, i) => (
                        <div key={i} className={cn('h-6 w-6 rounded border', seatColor[state])} />
                      ))}
                      <div className="w-2.5" />
                      {row.slice(3, 6).map((state, i) => (
                        <div key={i} className={cn('h-6 w-6 rounded border', seatColor[state])} />
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-1">
                <div className="mb-4 rounded-xl border border-gray-200 bg-white p-5">
                  <div className="mb-3 text-[13px] font-bold tracking-wide text-gray-400 uppercase">
                    Asientos actuales
                  </div>
                  <div className="mb-4 flex flex-wrap gap-3">
                    {seatList.filter(Boolean).map((seat) => (
                      <div
                        key={seat}
                        className="bg-primary rounded-[10px] px-4.5 py-3 text-center text-white"
                      >
                        <div className="text-2xl leading-none font-extrabold">{seat}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col gap-2">
                    {[
                      'Fila de emergencia — mayor espacio para piernas',
                      'Reclinación estándar',
                    ].map((text) => (
                      <div
                        key={text}
                        className="flex items-center gap-2 text-[13px] font-semibold text-gray-700"
                      >
                        <span className="material-symbols-outlined text-[15px]! text-[#22c55e]">
                          check
                        </span>
                        {text}
                      </div>
                    ))}
                    <div className="text-primary flex items-center gap-2 text-[13px] font-semibold">
                      <span className="material-symbols-outlined text-[15px]!">info</span>
                      Acceso al pasillo central
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="bg-primary hover:bg-primary/90 w-full cursor-pointer rounded-lg py-3 text-sm font-bold text-white transition-colors"
                >
                  Cambiar asientos
                </button>
                <div className="mt-2 text-center text-[11px] font-semibold text-gray-400">
                  El cambio puede tener costo adicional según tarifa
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'equipaje' && (
          <div className="p-7">
            <div className="text-secondary mb-4 text-base font-extrabold">Equipaje</div>
            <div className="flex flex-col gap-4 lg:flex-row">
              <div className="flex-1 rounded-xl border border-gray-200 bg-gray-100 p-5">
                <div className="mb-3 text-xs font-extrabold tracking-wide text-gray-400 uppercase">
                  Incluido en tu tarifa
                </div>
                <div className="flex flex-col gap-2.5">
                  {[
                    { label: 'Equipaje de mano', detail: '1 pieza · máx 8 kg · 55×40×20cm' },
                    { label: 'Maleta facturada', detail: '1 pieza · máx 23 kg' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <div className="rounded-lg border border-gray-200 bg-white p-2.5">
                        <span className="material-symbols-outlined text-secondary text-[22px]!">
                          luggage
                        </span>
                      </div>
                      <div>
                        <div className="text-secondary text-sm font-extrabold">{item.label}</div>
                        <div className="text-xs font-semibold text-gray-400">{item.detail}</div>
                      </div>
                      <span className="material-symbols-outlined ml-auto text-[18px]! text-[#22c55e]">
                        check
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-1 rounded-xl border-[1.5px] border-dashed border-gray-200 p-5">
                <div className="mb-3 text-xs font-extrabold tracking-wide text-gray-400 uppercase">
                  Agregar equipaje extra
                </div>
                <div className="flex flex-col gap-2.5">
                  {[
                    { label: '2ª maleta facturada · 23 kg', price: '$77.000' },
                    { label: 'Maleta extra · 32 kg', price: '$112.000' },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between rounded-[10px] border border-gray-200 bg-white p-3"
                    >
                      <div>
                        <div className="text-secondary text-[13px] font-extrabold">
                          {item.label}
                        </div>
                        <div className="text-xs font-semibold text-gray-400">Por pasajero</div>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className="text-secondary text-[15px] font-extrabold">
                          {item.price}
                        </span>
                        <button
                          type="button"
                          className="bg-primary hover:bg-primary/90 cursor-pointer rounded-lg px-3.5 py-1.5 text-xs font-bold text-white transition-colors"
                        >
                          Agregar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'servicios' && (
          <div className="p-7">
            <div className="text-secondary mb-4 text-base font-extrabold">Servicios extra</div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                {
                  icon: '🍽️',
                  label: 'Menú especial',
                  detail: 'Vegetariano, celíaco, kosher, etc.',
                  cta: 'Solicitar',
                },
                {
                  icon: '💺',
                  label: 'Asiento Premium',
                  detail: 'Clase Ejecutiva desde $448.000',
                  cta: 'Ver opciones',
                },
                {
                  icon: '🚗',
                  label: 'Transporte al aeropuerto',
                  detail: 'Servicio puerta a puerta',
                  cta: 'Reservar',
                },
                {
                  icon: '🛡️',
                  label: 'Seguro de viaje',
                  detail: 'Cobertura total desde $39.200',
                  cta: 'Agregar',
                },
              ].map((service) => (
                <div
                  key={service.label}
                  className="flex items-center gap-3.5 rounded-xl border border-gray-200 bg-white p-4"
                >
                  <div className="text-3xl">{service.icon}</div>
                  <div className="flex-1">
                    <div className="text-secondary text-sm font-extrabold">{service.label}</div>
                    <div className="text-xs font-semibold text-gray-400">{service.detail}</div>
                  </div>
                  <button
                    type="button"
                    className="text-secondary hover:border-secondary cursor-pointer rounded-lg border-[1.5px] border-gray-200 px-3.5 py-1.5 text-xs font-bold whitespace-nowrap transition-colors hover:bg-gray-100"
                  >
                    {service.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'docs' && (
          <div className="p-7">
            <div className="text-secondary mb-4 text-base font-extrabold">Documentos del viaje</div>
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-3.5 rounded-xl border border-gray-200 bg-white px-4.5 py-3.5">
                <span className="material-symbols-outlined text-secondary text-[22px]!">
                  description
                </span>
                <div className="flex-1">
                  <div className="text-secondary text-sm font-extrabold">Itinerario de vuelo</div>
                  <div className="text-xs font-semibold text-gray-400">
                    {origin.iata} → {destination.iata} · Reserva {reservationCode} · PDF
                  </div>
                </div>
                <button
                  type="button"
                  className="text-secondary hover:border-secondary flex cursor-pointer items-center gap-1.5 rounded-lg border-[1.5px] border-gray-200 px-4 py-1.5 text-xs font-bold whitespace-nowrap transition-colors hover:bg-gray-100"
                >
                  <span className="material-symbols-outlined text-[14px]!">download</span>
                  Descargar
                </button>
              </div>

              <div className="flex items-center gap-3.5 rounded-xl border border-gray-200 bg-white px-4.5 py-3.5">
                <span className="material-symbols-outlined text-primary text-[22px]!">
                  confirmation_number
                </span>
                <div className="flex-1">
                  <div className="text-secondary text-sm font-extrabold">Tarjeta de embarque</div>
                  <div className="text-primary text-xs font-bold">
                    Disponible 24hs antes del vuelo
                  </div>
                </div>
                <button
                  type="button"
                  disabled
                  className="cursor-not-allowed rounded-lg border-[1.5px] border-gray-200 px-4 py-1.5 text-xs font-bold whitespace-nowrap text-gray-400 opacity-50"
                >
                  No disponible aún
                </button>
              </div>

              <div className="flex items-center gap-3.5 rounded-xl border border-gray-200 bg-white px-4.5 py-3.5">
                <span className="material-symbols-outlined text-secondary text-[22px]!">
                  receipt_long
                </span>
                <div className="flex-1">
                  <div className="text-secondary text-sm font-extrabold">Factura electrónica</div>
                  <div className="text-xs font-semibold text-gray-400">
                    Comprobante de pago · PDF
                  </div>
                </div>
                <button
                  type="button"
                  className="text-secondary hover:border-secondary flex cursor-pointer items-center gap-1.5 rounded-lg border-[1.5px] border-gray-200 px-4 py-1.5 text-xs font-bold whitespace-nowrap transition-colors hover:bg-gray-100"
                >
                  <span className="material-symbols-outlined text-[14px]!">download</span>
                  Descargar
                </button>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'check' && (
          <div className="p-7">
            <div className="text-secondary mb-4 text-base font-extrabold">Check-in online</div>
            <div className="mb-5 flex items-center gap-3 rounded-xl border border-[#f47c2044] bg-[#fff8f0] px-5 py-4">
              <span className="material-symbols-outlined text-primary text-[20px]!">info</span>
              <span className="text-primary text-[13px] font-bold">
                El check-in online abre el <strong>14 de octubre 2026 a las 10:30hs</strong> (24hs
                antes del vuelo)
              </span>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-4 sm:flex-row">
                {checkInPassengers.map((p) => (
                  <div
                    key={p.label}
                    className="flex-1 rounded-xl border border-gray-200 bg-white p-4.5"
                  >
                    <div className="mb-2 text-xs font-bold text-gray-400">{p.label}</div>
                    <div className="text-secondary text-[15px] font-extrabold">{p.name}</div>
                    <div className="mt-1 text-xs font-semibold text-gray-400">{p.doc}</div>
                    <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-gray-400">
                      <span className="material-symbols-outlined text-[14px]!">schedule</span>
                      Pendiente de check-in
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                disabled
                className="bg-secondary w-fit cursor-not-allowed rounded-lg px-5 py-3 text-sm font-bold text-white opacity-50"
              >
                Iniciar check-in online (no disponible aún)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
