import { Link, useSearchParams } from 'react-router-dom';
import { Section } from '../../../components/ui/Section';
import { Button } from '../../../components/ui/Button';
import { formatCurrency } from '../../../utils/formatCurrency';
import { useHotelDetail } from '../hooks/useHotelDetail';

const AMENIDADES_ICONS: Record<string, { icon: string; label: string }> = {
  wifi: { icon: 'wifi', label: 'WiFi Gratis' },
  piscina: { icon: 'pool', label: 'Piscina Exterior' },
  spa: { icon: 'spa', label: 'Spa de Lujo' },
  restaurante: { icon: 'restaurant', label: 'Restaurante' },
  gimnasio: { icon: 'fitness_center', label: 'Gimnasio' },
  estacionamiento: { icon: 'local_parking', label: 'Estacionamiento' },
  bar: { icon: 'local_bar', label: 'Bar Lounge' },
  room_service: { icon: 'room_service', label: 'Servicio a la Habitación' },
  desayuno: { icon: 'free_breakfast', label: 'Desayuno Incluido' },
};

// Renderiza estrellas admitiendo calificaciones con decimales (ej: 4.5)
const Estrellas = ({ calificacion }: { calificacion: number }) => {
  return (
    <div className="flex">
      {Array.from({ length: 5 }).map((_, i) => {
        const valor = i + 1;
        let icono = 'star';
        let color = 'text-black/20';
        if (calificacion >= valor) {
          color = 'text-primary';
        } else if (calificacion >= valor - 0.5) {
          icono = 'star_half';
          color = 'text-primary';
        }
        return (
          <span key={i} className={`material-symbols-outlined text-[20px]! ${color}`}>
            {icono}
          </span>
        );
      })}
    </div>
  );
};

export const HotelDetailPage = () => {
  const { hotel, loading, notFound } = useHotelDetail();
  const [searchParams] = useSearchParams();
  const queryParams = searchParams.toString();

  if (loading) {
    return (
      <Section>
        <p className="p-6">Cargando hotel...</p>
      </Section>
    );
  }

  if (notFound || !hotel) {
    return (
      <Section>
        <div className="flex flex-col items-center gap-4 p-10 text-center">
          <p className="text-neutral">No encontramos este hotel.</p>
          <Link to="/hotels" className="text-primary font-semibold underline">
            Volver a hoteles
          </Link>
        </div>
      </Section>
    );
  }

  const [imagenPrincipal, ...miniaturas] = hotel.galeria ?? [hotel.imageUrl];

  return (
    <Section>
      <div className="flex w-full flex-col gap-8 p-6">
        <Link
          to="/hotels"
          className="text-neutral hover:text-primary flex w-max items-center gap-1 text-[14px]"
        >
          <span className="material-symbols-outlined text-[18px]!">arrow_back</span>
          Volver a hoteles
        </Link>

        {/* Encabezado */}
        <div>
          <div className="flex flex-wrap items-center gap-3">
            {hotel.calificacion && <Estrellas calificacion={hotel.calificacion} />}
            {hotel.calificacion && (
              <span className="text-secondary font-semibold">{hotel.calificacion} Estrellas</span>
            )}
            {hotel.cantidadResenas && (
              <span className="text-neutral text-[14px]">
                ({hotel.cantidadResenas} Reseñas de huéspedes)
              </span>
            )}
          </div>
          <h1 className="text-secondary mt-2 text-3xl font-bold sm:text-4xl">{hotel.nombre}</h1>
          {hotel.direccion && (
            <p className="text-neutral mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-primary text-[18px]!">
                location_on
              </span>
              {hotel.direccion}
            </p>
          )}
        </div>

        {/* Contenido principal + sidebar */}
        <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr]">
          {/* Columna principal */}
          <div className="flex flex-col gap-8">
            {/* Galería */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[2fr_1fr]">
              <img
                src={imagenPrincipal}
                alt={hotel.nombre}
                className="h-72 w-full rounded-2xl object-cover sm:h-100"
              />
              <div className="flex flex-row gap-3 sm:flex-col">
                {miniaturas.slice(0, 4).map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`${hotel.nombre} ${i + 2}`}
                    className="h-24 flex-1 rounded-xl object-cover sm:h-[91px] sm:w-full sm:flex-none"
                  />
                ))}
              </div>
            </div>

            {/* Sobre el hotel */}
            {hotel.descripcion && (
              <div>
                <h2 className="text-secondary text-xl font-bold">Sobre el Hotel</h2>
                <p className="text-neutral mt-3 leading-relaxed">{hotel.descripcion}</p>
              </div>
            )}

            {/* Amenidades */}
            {hotel.servicios.length > 0 && (
              <div>
                <h2 className="text-secondary text-xl font-bold">
                  Servicios y Amenidades principales
                </h2>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {hotel.servicios.map((key) => {
                    const info = AMENIDADES_ICONS[key];
                    if (!info) return null;
                    return (
                      <div
                        key={key}
                        className="flex items-center gap-2 rounded-xl bg-black/5 px-4 py-3"
                      >
                        <span className="material-symbols-outlined text-primary text-[20px]!">
                          {info.icon}
                        </span>
                        <span className="text-secondary text-[14px] font-medium">
                          {info.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Habitaciones disponibles */}
            {hotel.habitaciones && hotel.habitaciones.length > 0 && (
              <div>
                <h2 className="text-secondary text-xl font-bold">Habitaciones Disponibles</h2>
                <div className="mt-4 flex flex-col gap-4">
                  {hotel.habitaciones.map((hab) => (
                    <div
                      key={hab.id}
                      className="flex flex-col gap-4 rounded-2xl border border-black/10 p-4 sm:flex-row sm:items-center"
                    >
                      <img
                        src={hab.imageUrl}
                        alt={hab.nombre}
                        className="h-40 w-full rounded-xl object-cover sm:h-24 sm:w-32"
                      />
                      <div className="flex-1">
                        <h3 className="text-secondary font-semibold">{hab.nombre}</h3>
                        <p className="text-neutral mt-1 text-[14px]">{hab.descripcion}</p>
                        <p className="text-neutral mt-1 flex items-center gap-1 text-[14px]">
                          <span className="material-symbols-outlined text-[16px]!">group</span>
                          Capacidad: {hab.capacidad} Adultos
                        </p>
                      </div>
                      <div className="flex flex-row items-center justify-between gap-4 sm:flex-col sm:items-end">
                        <p className="text-secondary text-lg font-bold">
                          {formatCurrency(hab.precioPorNoche)}{' '}
                          <span className="text-neutral text-[13px] font-normal">/ noche</span>
                        </p>
                        <Link
                          to={
                            queryParams
                              ? `/hotels/${hotel.id}/reservar/${hab.id}?${queryParams}`
                              : `/hotels/${hotel.id}/reservar/${hab.id}`
                          }
                          className="bg-primary rounded-[10px] px-6 py-2 text-center font-bold text-white transition-all duration-200 active:scale-95"
                        >
                          Reservar
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reseñas */}
            {hotel.resenas && hotel.resenas.length > 0 && (
              <div>
                <h2 className="text-secondary text-xl font-bold">Reseñas de Huéspedes</h2>
                <div className="mt-4 flex flex-col divide-y divide-black/10">
                  {hotel.resenas.map((resena) => (
                    <div key={resena.id} className="flex flex-col gap-1 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="bg-secondary flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-bold text-white">
                            {resena.nombre.charAt(0)}
                          </div>
                          <span className="text-secondary font-semibold">{resena.nombre}</span>
                        </div>
                        <span className="text-neutral text-[13px]">{resena.fecha}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Estrellas calificacion={resena.calificacion} />
                        <span className="text-neutral text-[13px]">{resena.calificacion} / 5</span>
                      </div>
                      <p className="text-neutral mt-1">{resena.comentario}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-6">
            {hotel.notaUbicacion && (
              <div>
                <h2 className="text-secondary mb-3 font-bold">Ubicación</h2>
                <div className="relative flex h-40 w-full items-center justify-center overflow-hidden rounded-2xl bg-[#7dd3d8]">
                  <span className="material-symbols-outlined text-alert text-[40px]!">
                    location_on
                  </span>
                  <span className="text-secondary absolute top-2 left-1/2 -translate-x-1/2 text-[12px] font-bold tracking-wide">
                    {hotel.ciudad.toUpperCase()}
                  </span>
                </div>
                <p className="text-neutral mt-2 flex items-center gap-1 text-[13px]">
                  <span className="material-symbols-outlined text-[16px]!">navigation</span>
                  {hotel.notaUbicacion}
                </p>
              </div>
            )}

            <div className="bg-secondary flex flex-col gap-4 rounded-2xl p-6 text-white">
              <h2 className="text-lg font-bold">Ahorra reservando paquete completo</h2>
              <p className="text-[14px] text-white/70">
                Si agregas tu pasaje aéreo a {hotel.ciudad} hoy mismo, ahorras un{' '}
                <span className="text-primary font-bold">30% extra</span> en tu estadía en el{' '}
                {hotel.nombre}.
              </p>
              <div className="text-secondary rounded-xl bg-white p-4">
                <p className="text-neutral text-[13px]">Vuelo + Hotel (7 noches)</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(hotel.precioPorNoche * 4)}{' '}
                  <span className="text-neutral text-[13px] font-normal">USD total</span>
                </p>
                <p className="mt-1 text-[13px] font-semibold text-green-600">
                  ¡Ahorras {formatCurrency(hotel.precioPorNoche * 2)} USD!
                </p>
              </div>
              <Button variant="primary" className="bg-primary text-white">
                Cotizar Vuelo + Hotel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};
