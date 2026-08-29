import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Section } from '../../../components/ui/Section';
import { formatCurrency } from '../../../utils/formatCurrency';
import { useMisReservas } from '../hooks/useMisReservas';
import { useHotels } from '../hooks/useHotels';
import type { EstadoReserva } from '../hotels.types';

const ESTADO_INFO: Record<EstadoReserva, { label: string; clase: string }> = {
  proximo: { label: 'PRÓXIMO', clase: 'bg-green-100 text-green-700' },
  completado: { label: 'COMPLETADO', clase: 'bg-blue-100 text-blue-700' },
  cancelado: { label: 'CANCELADO', clase: 'bg-alert/10 text-alert' },
};

const MESES = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
];

const formatFechaCorta = (fechaISO: string) => {
  const fecha = new Date(`${fechaISO}T00:00:00`);
  return `${fecha.getDate()} ${MESES[fecha.getMonth()]} ${fecha.getFullYear()}`;
};

const DESTINOS_POPULARES = ['Barcelona', 'Cancún', 'Roma', 'Tokio'];

// Ids de hoteles con precio promocional (tienen precioOriginal en el mock),
// para armar la sección de "Recomendados para tu paquete".
const IDS_RECOMENDADOS = [1, 2, 4];

export const MisReservasPage = () => {
  // TODO(Arnold): esta vista debería requerir sesión iniciada (como /my-reservations
  // de vuelos, que tiene el mismo pendiente). Falta que useAuthStore.ts se complete
  // para poder chequear acá "si no hay usuario logueado -> navigate('/login')".
  const { reservas, loading } = useMisReservas();
  const { hoteles } = useHotels();
  const [destinoActivo, setDestinoActivo] = useState('Barcelona');

  const recomendados = hoteles.filter((h) => IDS_RECOMENDADOS.includes(h.id));

  return (
    <Section>
      <div className="flex w-full flex-col gap-10 p-6">
        <div>
          <h1 className="text-secondary text-2xl font-bold sm:text-3xl">Mis Reservas de Hotel</h1>

          <div className="mt-4 overflow-hidden rounded-2xl border border-black/10">
            {loading ? (
              <p className="p-6">Cargando reservas...</p>
            ) : reservas.length === 0 ? (
              <p className="text-neutral p-6">Todavía no tenés reservas de hotel.</p>
            ) : (
              <>
                {/* Tabla — desktop */}
                <table className="hidden w-full lg:table">
                  <thead>
                    <tr className="bg-black/5 text-left text-[13px] tracking-wide uppercase">
                      <th className="text-neutral p-4 font-semibold">Hotel / Ubicación</th>
                      <th className="text-neutral p-4 font-semibold">Fechas de estadía</th>
                      <th className="text-neutral p-4 font-semibold">Estado</th>
                      <th className="text-neutral p-4 font-semibold">Precio total</th>
                      <th className="text-neutral p-4 font-semibold">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservas.map((reserva) => (
                      <tr key={reserva.id} className="border-t border-black/10">
                        <td className="flex items-center gap-3 p-4">
                          <img
                            src={reserva.imageUrl}
                            alt={reserva.hotelNombre}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                          <div>
                            <p className="text-secondary font-semibold">{reserva.hotelNombre}</p>
                            <p className="text-neutral text-[13px]">
                              {reserva.ciudad}, {reserva.pais}
                            </p>
                          </div>
                        </td>
                        <td className="p-4 text-[14px]">
                          {formatFechaCorta(reserva.fechaInicio)} -{' '}
                          {formatFechaCorta(reserva.fechaFin)}
                        </td>
                        <td className="p-4">
                          <span
                            className={`rounded-md px-3 py-1 text-[12px] font-bold ${ESTADO_INFO[reserva.estado].clase}`}
                          >
                            {ESTADO_INFO[reserva.estado].label}
                          </span>
                        </td>
                        <td className="text-secondary p-4 font-bold">
                          {formatCurrency(reserva.precioTotal)}
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-2">
                            <Link
                              to={`/hotels/${reserva.hotelId}`}
                              className="text-secondary rounded-lg border border-black/20 px-4 py-1.5 text-[14px] font-semibold hover:bg-black/5"
                            >
                              Ver detalles
                            </Link>
                            {reserva.estado === 'proximo' && (
                              <Link
                                to={`/hotels/mis-reservas/${reserva.id}/cancelar`}
                                className="text-alert rounded-lg border border-current px-4 py-1.5 text-[14px] font-semibold hover:bg-red-50"
                              >
                                Cancelar
                              </Link>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Tarjetas — mobile/tablet */}
                <div className="flex flex-col divide-y divide-black/10 lg:hidden">
                  {reservas.map((reserva) => (
                    <div key={reserva.id} className="flex flex-col gap-3 p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={reserva.imageUrl}
                          alt={reserva.hotelNombre}
                          className="h-14 w-14 rounded-lg object-cover"
                        />
                        <div>
                          <p className="text-secondary font-semibold">{reserva.hotelNombre}</p>
                          <p className="text-neutral text-[13px]">
                            {reserva.ciudad}, {reserva.pais}
                          </p>
                        </div>
                        <span
                          className={`ml-auto rounded-md px-2 py-1 text-[11px] font-bold whitespace-nowrap ${ESTADO_INFO[reserva.estado].clase}`}
                        >
                          {ESTADO_INFO[reserva.estado].label}
                        </span>
                      </div>
                      <p className="text-neutral text-[14px]">
                        {formatFechaCorta(reserva.fechaInicio)} -{' '}
                        {formatFechaCorta(reserva.fechaFin)}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-secondary font-bold">
                          {formatCurrency(reserva.precioTotal)}
                        </span>
                        <div className="flex gap-2">
                          <Link
                            to={`/hotels/${reserva.hotelId}`}
                            className="text-secondary rounded-lg border border-black/20 px-4 py-1.5 text-[14px] font-semibold"
                          >
                            Ver detalles
                          </Link>
                          {reserva.estado === 'proximo' && (
                            <Link
                              to={`/hotels/mis-reservas/${reserva.id}/cancelar`}
                              className="text-alert rounded-lg border border-current px-4 py-1.5 text-[14px] font-semibold"
                            >
                              Cancelar
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Hoteles recomendados */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-secondary text-xl font-bold sm:text-2xl">
              Hoteles Recomendados para tu Paquete
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-neutral text-[13px]">Destinos Populares:</span>
              {DESTINOS_POPULARES.map((ciudad) => (
                <Link
                  key={ciudad}
                  to={`/hotels?destino=${encodeURIComponent(ciudad)}`}
                  onClick={() => setDestinoActivo(ciudad)}
                  className={`rounded-full border px-4 py-1.5 text-[13px] font-semibold transition-colors ${
                    destinoActivo === ciudad
                      ? 'bg-secondary border-secondary text-white'
                      : 'text-secondary border-black/20 hover:bg-black/5'
                  }`}
                >
                  {ciudad}
                </Link>
              ))}
            </div>
          </div>

          {/* Banner promo */}
          <div className="bg-secondary flex flex-col justify-between gap-4 rounded-2xl p-8 text-white md:flex-row md:items-center">
            <div>
              <span className="bg-primary rounded-md px-3 py-1 text-[12px] font-bold tracking-wider uppercase">
                Paquete Vuelo + Hotel
              </span>
              <h3 className="mt-3 text-2xl font-bold sm:text-3xl">
                Ahorra hasta un 25% reservando tu hospedaje y vuelo juntos
              </h3>
              <p className="mt-1 text-white/70">
                Accedé a traslados gratis y tarifas especiales combinando tus reservas en
                DESPESCAR.
              </p>
            </div>
            <Link
              to="/"
              className="bg-primary w-full rounded-[10px] px-6 py-3 text-center font-bold whitespace-nowrap text-white sm:w-auto"
            >
              Ver Paquetes Activos
            </Link>
          </div>

          {/* Cards de hoteles con descuento */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recomendados.map((hotel) => (
              <div
                key={hotel.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-black/10"
              >
                <img
                  src={hotel.imageUrl}
                  alt={hotel.nombre}
                  className="h-40 w-full object-cover"
                />
                <div className="flex flex-col gap-2 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-neutral flex items-center gap-1 text-[13px]">
                      <span className="material-symbols-outlined text-primary text-[16px]!">
                        location_on
                      </span>
                      {hotel.ciudad}, {hotel.pais}
                    </p>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={`material-symbols-outlined text-[14px]! ${
                            i < hotel.estrellas ? 'text-primary' : 'text-black/20'
                          }`}
                        >
                          star
                        </span>
                      ))}
                    </div>
                  </div>
                  <h4 className="text-secondary font-semibold">{hotel.nombre}</h4>
                  <hr className="text-black/10" />
                  <div className="flex items-center justify-between">
                    <div>
                      {hotel.precioOriginal && (
                        <p className="text-neutral text-[13px] line-through">
                          Original: {formatCurrency(hotel.precioOriginal)} USD
                        </p>
                      )}
                      <p className="text-secondary font-bold">
                        {formatCurrency(hotel.precioPorNoche)}{' '}
                        <span className="text-neutral text-[12px] font-normal">/ noche</span>
                      </p>
                    </div>
                    <button className="bg-primary rounded-[10px] px-4 py-2 text-[13px] font-bold whitespace-nowrap text-white">
                      Agregar al Paquete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};
