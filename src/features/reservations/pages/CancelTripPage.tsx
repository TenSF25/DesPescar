import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/formatCurrency';
import { useAuthStore } from '@/store/useAuthStore';
import { useReservation, useReservations } from '@/features/reservations/hooks/useReservations';
import { BackButton } from '@/features/reservations/components/BackButton';

const reasons = [
  { value: 'cambio-planes', icon: '✈️', label: 'Cambio de planes personales' },
  { value: 'emergencia', icon: '🏥', label: 'Emergencia médica o familiar' },
  { value: 'trabajo', icon: '💼', label: 'Motivos laborales' },
  { value: 'precio', icon: '💸', label: 'Encontré un precio más conveniente' },
  { value: 'otro', icon: '📝', label: 'Otro motivo' },
];

const alternatives = [
  { icon: 'calendar_month', label: 'Cambiar fecha', detail: 'Cargo de $112.000/pax' },
  { icon: 'person', label: 'Cambiar nombre', detail: 'Según disponibilidad' },
  { icon: 'flight', label: 'Crédito de viaje', detail: 'Sin penalidad' },
];

export const CancelTripPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cancelReservation } = useReservations();
  const userEmail = useAuthStore((state) => state.user?.email);
  const flight = useReservation(id);
  const [motivo, setMotivo] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

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
  const baseFare = totalPaid - taxes;
  const penalty = Math.round(baseFare * 0.2);
  const refund = baseFare - penalty;

  if (confirmed) {
    return (
      <div>
        <BackButton />

        <div className="mx-auto max-w-[620px]">
          <div className="rounded-[14px] border-[1.5px] border-[#a5d6a7] bg-[#f0fdf4] p-6 text-center">
            <span className="material-symbols-outlined mb-3 block text-[40px]! text-[#15803d]">
              check_circle
            </span>
            <div className="mb-1.5 text-base font-extrabold text-[#15803d]">
              Cancelación procesada
            </div>
            <div className="text-[13px] font-semibold text-[#166534]">
              Tu reembolso de <strong>{formatCurrency(refund)}</strong> será acreditado en 5–10 días
              hábiles. Recibirás un email de confirmación en{' '}
              <strong>{flight.contactEmail ?? userEmail ?? 'tu correo'}</strong>.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <BackButton />

      <div className="mx-auto max-w-[620px]">
        <div className="mb-5 flex items-start gap-4 rounded-[14px] border-[1.5px] border-[#fca5a5] bg-[#fff5f5] px-7 py-6">
          <span className="material-symbols-outlined mt-0.5 text-[28px]! text-[#e53935]">
            error
          </span>
          <div>
            <div className="mb-1.5 text-[15px] font-extrabold text-[#b91c1c]">
              ¿Estás seguro que querés cancelar?
            </div>
            <div className="text-[13px] leading-relaxed font-semibold text-[#7f1d1d]">
              Esta acción no se puede deshacer. Al cancelar tu reserva{' '}
              <strong>
                {origin.iata} → {destination.iata} ({flightNumber})
              </strong>{' '}
              del {origin.date}, se aplicarán las condiciones de cancelación de tu tarifa.
            </div>
          </div>
        </div>

        <div className="mb-5 rounded-[14px] border border-gray-200 bg-white px-6 py-5">
          <div className="mb-3 text-xs font-extrabold tracking-wide text-gray-400 uppercase">
            Vuelo a cancelar
          </div>
          <div className="text-secondary text-xl font-extrabold">
            {origin.iata} → {destination.iata}
          </div>
          <div className="mt-0.5 text-[13px] font-semibold text-gray-400">
            {origin.date} · {origin.time} → {destination.time} · Vuelo directo
          </div>
          <div className="text-[13px] font-semibold text-gray-400">
            Reserva: {reservationCode} · Pasajeros: Noelia Montecinos, Luciano Nuñez
          </div>
        </div>

        <div className="mb-5 rounded-[14px] border border-gray-200 bg-white px-6 py-5">
          <div className="mb-3.5 text-xs font-extrabold tracking-wide text-gray-400 uppercase">
            Política de reembolso aplicable
          </div>
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between rounded-[10px] bg-gray-100 px-4 py-3">
              <div className="text-[13px] font-bold text-gray-700">Tarifa base</div>
              <div className="text-secondary text-[15px] font-extrabold">
                {formatCurrency(baseFare)}
              </div>
            </div>
            <div className="flex items-center justify-between rounded-[10px] border border-[#fca5a5] bg-[#fff5f5] px-4 py-3">
              <div>
                <div className="text-[13px] font-bold text-[#b91c1c]">Cargo por cancelación</div>
                <div className="text-[11px] font-semibold text-[#e53935]">
                  Cancelación más de 72hs antes del vuelo · 20% de penalidad
                </div>
              </div>
              <div className="text-[15px] font-extrabold text-[#b91c1c]">
                – {formatCurrency(penalty)}
              </div>
            </div>
            <div className="flex items-center justify-between rounded-[10px] border border-[#a5d6a7] bg-[#f0fdf4] px-4 py-3">
              <div>
                <div className="text-[13px] font-extrabold text-[#15803d]">Reembolso estimado</div>
                <div className="text-[11px] font-semibold text-[#16a34a]">
                  Acreditado en 5–10 días hábiles al medio de pago original
                </div>
              </div>
              <div className="text-xl font-extrabold text-[#15803d]">{formatCurrency(refund)}</div>
            </div>
            <div className="px-1 text-[11px] font-semibold text-gray-400">
              * Las tasas e impuestos ({formatCurrency(taxes)}) se reembolsan en su totalidad. Los
              montos pueden variar según confirmación de la aerolínea.
            </div>
          </div>
        </div>

        <div className="mb-6 rounded-[14px] border border-gray-200 bg-white px-6 py-5">
          <div className="mb-3.5 text-xs font-extrabold tracking-wide text-gray-400 uppercase">
            ¿Consideraste estas alternativas?
          </div>
          <div className="flex gap-2.5">
            {alternatives.map((alt) => (
              <button
                key={alt.label}
                type="button"
                onClick={() => navigate(`/my-reservations/${id}/manage`)}
                className="text-secondary hover:border-secondary flex flex-1 cursor-pointer flex-col items-center gap-1 rounded-lg border-[1.5px] border-gray-200 py-3 transition-colors hover:bg-gray-100"
              >
                <span className="material-symbols-outlined text-[20px]!">{alt.icon}</span>
                <span className="text-xs font-extrabold">{alt.label}</span>
                <span className="text-[11px] font-semibold text-gray-400">{alt.detail}</span>
              </button>
            ))}
          </div>
        </div>

        {!confirmed && (
          <>
            <div className="mb-5 rounded-[14px] border border-gray-200 bg-white px-6 py-5">
              <div className="mb-3.5 text-xs font-extrabold tracking-wide text-gray-400 uppercase">
                ¿Por qué querés cancelar?
              </div>
              <div className="flex flex-col gap-2">
                {reasons.map((reason) => (
                  <label
                    key={reason.value}
                    className={cn(
                      'flex cursor-pointer items-center gap-2.5 rounded-[10px] border-[1.5px] px-3.5 py-2.5 text-[13px] font-bold text-gray-700 transition-colors',
                      motivo === reason.value ? 'border-primary' : 'border-gray-200',
                    )}
                  >
                    <input
                      type="radio"
                      name="motivo"
                      value={reason.value}
                      checked={motivo === reason.value}
                      onChange={() => setMotivo(reason.value)}
                      className="accent-primary h-4 w-4"
                    />
                    {reason.icon} &nbsp;{reason.label}
                  </label>
                ))}
                {motivo === 'otro' && (
                  <textarea
                    placeholder="Contanos brevemente el motivo..."
                    className="focus:border-primary mt-1 min-h-20 w-full resize-y rounded-[10px] border-[1.5px] border-gray-200 px-3.5 py-2.5 font-sans text-[13px] font-semibold text-gray-700 transition-colors outline-none"
                  />
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate('/my-reservations')}
                className="text-secondary hover:border-secondary flex-1 cursor-pointer rounded-lg border-[1.5px] border-gray-200 py-3.5 text-sm font-bold transition-colors hover:bg-gray-100"
              >
                Volver sin cancelar
              </button>
              <button
                type="button"
                disabled={!motivo}
                onClick={() => {
                  cancelReservation(flight.id);
                  setConfirmed(true);
                }}
                className={cn(
                  'flex-1 rounded-lg py-3.5 text-sm font-bold text-white transition-opacity',
                  motivo
                    ? 'cursor-pointer bg-[#e53935] hover:opacity-90'
                    : 'cursor-not-allowed bg-[#e53935] opacity-50',
                )}
              >
                Confirmar cancelación
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
