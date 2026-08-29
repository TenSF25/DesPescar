import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { formatCurrency } from '../../../utils/formatCurrency';
import { useCancelarReserva } from '../hooks/useCancelarReserva';
import type { MotivoCancelacion } from '../hotels.types';

const MOTIVOS: MotivoCancelacion[] = [
  'Cambio de planes',
  'Problema personal',
  'Motivos de salud',
  'Problema con el hotel',
  'Otro',
];

const MESES = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
];

const formatFechaCorta = (fechaISO: string) => {
  const fecha = new Date(`${fechaISO}T00:00:00`);
  return `${fecha.getDate()} ${MESES[fecha.getMonth()]} ${fecha.getFullYear()}`;
};

export const HotelCancelPage = () => {
  const { reservaId } = useParams<{ reservaId: string }>();
  const navigate = useNavigate();
  const {
    loading,
    reserva,
    reembolso,
    notFound,
    yaCancelada,
    motivo,
    setMotivo,
    comentario,
    setComentario,
    entendido,
    setEntendido,
    puedeConfirmar,
    isConfirmando,
    isConfirmada,
    confirmarCancelacion,
  } = useCancelarReserva(reservaId);

  const volverAMisReservas = () => navigate('/hotels/mis-reservas');

  if (loading) {
    return <p className="p-6">Cargando...</p>;
  }

  if (notFound || !reserva || !reembolso) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-black/10 p-10 text-center">
        <p className="text-secondary text-xl font-bold">No encontramos esta reserva</p>
        <Button variant="secondary" className="w-full sm:w-60" onClick={volverAMisReservas}>
          Volver a mis reservas
        </Button>
      </div>
    );
  }

  if (yaCancelada && !isConfirmada) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-black/10 p-10 text-center">
        <p className="text-secondary text-xl font-bold">Esta reserva ya fue cancelada</p>
        <Button variant="secondary" className="w-full sm:w-60" onClick={volverAMisReservas}>
          Volver a mis reservas
        </Button>
      </div>
    );
  }

  if (isConfirmada) {
    return (
      <div className="mx-auto flex w-full max-w-150 flex-col items-center gap-4 rounded-2xl border border-black/10 p-10 text-center">
        <span className="material-symbols-outlined text-primary text-[64px]!">check_circle</span>
        <h1 className="text-secondary text-2xl font-bold">Reserva cancelada</h1>
        <p className="text-neutral">
          Te enviamos el comprobante y los detalles del reembolso a{' '}
          <span className="font-semibold">{reserva.contactEmail}</span>.
        </p>
        <div className="w-full rounded-2xl bg-black/5 p-5 text-left">
          <div className="flex justify-between">
            <span className="text-neutral">Reembolso ({reembolso.porcentaje}%)</span>
            <span className="text-secondary font-bold">{formatCurrency(reembolso.monto)}</span>
          </div>
        </div>
        <Button
          variant="primary"
          className="bg-primary w-full text-white sm:w-60"
          onClick={volverAMisReservas}
        >
          Volver a mis reservas
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-secondary text-2xl font-bold sm:text-3xl">
          ¿Estás seguro de que deseas cancelar tu reserva?
        </h1>
        <p className="text-neutral mt-1">
          Revisá los detalles de tu hospedaje y las políticas de reembolso antes de confirmar la
          cancelación.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Columna principal */}
        <div className="flex flex-col gap-6">
          {/* Política de cancelación */}
          <div className="flex flex-col gap-4 rounded-2xl border border-black/10 p-6">
            <p className="text-secondary flex items-center gap-2 font-bold">
              <span className="material-symbols-outlined text-primary text-[20px]!">
                target
              </span>
              Política de Cancelación Detallada
            </p>
            <p className="text-neutral text-[14px]">
              Tu reserva cuenta con condiciones de devolución específicas según la fecha actual.
              Revisá los plazos a continuación para evitar cargos extra:
            </p>

            <div className="flex flex-col gap-3">
              {[
                { etiqueta: 'Cancelación Gratuita', valor: 'Reembolso del 100%', porcentaje: 100, clase: 'bg-green-50 text-green-700' },
                { etiqueta: 'Cancelación entre 24h y 48h antes del check-in', valor: 'Cargo del 50%', porcentaje: 50, clase: 'bg-orange-50 text-orange-700' },
                { etiqueta: 'Cancelación con menos de 24h antes del check-in', valor: 'Cargo del 100%', porcentaje: 0, clase: 'bg-red-50 text-alert' },
              ].map((tier) => (
                <div
                  key={tier.etiqueta}
                  className={`flex flex-col gap-1 rounded-xl px-4 py-3 sm:flex-row sm:items-center sm:justify-between ${tier.clase} ${
                    reembolso.porcentaje === tier.porcentaje ? 'ring-2 ring-current' : ''
                  }`}
                >
                  <span className="text-[14px] font-semibold">
                    • {tier.etiqueta}
                    {reembolso.porcentaje === tier.porcentaje && (
                      <span className="ml-2 text-[12px] font-bold">(tu caso)</span>
                    )}
                  </span>
                  <span className="font-bold">{tier.valor}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Formulario */}
          <div className="flex flex-col gap-4 rounded-2xl border border-black/10 p-6">
            <h2 className="text-secondary text-xl font-bold">Formulario de Cancelación</h2>

            <div className="flex flex-col gap-2">
              <label className="text-secondary font-semibold">Motivo de la cancelación *</label>
              <select
                value={motivo}
                onChange={(e) => setMotivo(e.target.value as MotivoCancelacion)}
                className="rounded-xl border border-black/20 p-2"
              >
                <option value="">Seleccioná un motivo</option>
                {MOTIVOS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-secondary font-semibold">
                Comentarios adicionales (Opcional)
              </label>
              <textarea
                rows={3}
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Escribí acá cualquier detalle adicional que quieras informarnos sobre tu decisión..."
                className="w-full rounded-xl border border-black/20 p-2"
              />
            </div>

            <label className="flex items-start gap-2 text-[14px]">
              <input
                type="checkbox"
                className="accent-primary mt-1 w-4"
                checked={entendido}
                onChange={(e) => setEntendido(e.target.checked)}
              />
              Entiendo que esta acción no se puede deshacer y liberará mi habitación de forma
              inmediata.
            </label>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                variant="primary"
                className="bg-alert w-full text-white sm:w-auto sm:px-8"
                disabled={!puedeConfirmar || isConfirmando}
                onClick={confirmarCancelacion}
              >
                {isConfirmando ? 'Cancelando...' : 'Confirmar Cancelación'}
              </Button>
              <Button variant="secondary" className="w-full sm:w-auto" onClick={volverAMisReservas}>
                Volver a mi reserva
              </Button>
            </div>
          </div>

          {/* Reprogramar */}
          <div className="border-primary bg-primary/5 flex flex-col gap-3 rounded-2xl border p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-secondary font-bold">
                ¿Querés mantener tus beneficios? Considerá reprogramar tu estadía
              </p>
              <p className="text-neutral text-[14px]">
                Modificá las fechas de tu viaje sin penalizaciones extra y mantené tarifas
                preferenciales.
              </p>
            </div>
            <Link
              to={`/hotels/${reserva.hotelId}`}
              className="bg-primary w-full rounded-[10px] px-6 py-2 text-center font-bold whitespace-nowrap text-white sm:w-auto"
            >
              Reprogramar fechas
            </Link>
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4 rounded-2xl border border-black/10 p-5 lg:sticky lg:top-6 lg:self-start">
          <h2 className="text-secondary font-bold">Resumen de la Reserva</h2>

          <div className="flex items-center gap-3">
            <img
              src={reserva.imageUrl}
              alt={reserva.hotelNombre}
              className="h-14 w-14 rounded-xl object-cover"
            />
            <div>
              <p className="text-secondary font-semibold">{reserva.hotelNombre}</p>
              <p className="text-neutral text-[13px]">
                {reserva.ciudad}, {reserva.pais}
              </p>
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={`material-symbols-outlined text-[14px]! ${
                      i < reserva.estrellas ? 'text-primary' : 'text-black/20'
                    }`}
                  >
                    star
                  </span>
                ))}
              </div>
            </div>
          </div>

          <hr className="text-black/10" />

          <div className="flex flex-col gap-2 text-[14px]">
            <div className="flex justify-between">
              <span className="text-neutral">Habitación</span>
              <span className="text-secondary font-semibold">{reserva.habitacionNombre}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral">Check-in</span>
              <span className="text-secondary font-semibold">
                {formatFechaCorta(reserva.fechaInicio)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral">Check-out</span>
              <span className="text-secondary font-semibold">
                {formatFechaCorta(reserva.fechaFin)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral">Confirmación</span>
              <span className="text-primary font-semibold">{reserva.codigoConfirmacion}</span>
            </div>
          </div>

          <hr className="text-black/10" />

          <div className="flex items-center justify-between">
            <span className="text-secondary font-bold">Total Abonado</span>
            <span className="text-secondary text-xl font-bold">
              {formatCurrency(reserva.precioTotal)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
