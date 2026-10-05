import { Link } from 'react-router';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { Estrellas } from '../components/Estrellas';
import { ElegirFechas } from '../components/Detail/ElegirFechas';
import { HabitacionCard } from '../components/Detail/HabitacionCard';
import { HotelGallery } from '../components/Detail/HotelGallery';
import { PoliticaCancelacion } from '../components/Detail/PoliticaCancelacion';
import { useHotelDetail } from '../hooks/useHotelDetail';
import { buildHotelsUrl } from '../hotelSearchParams';
import { formatFechaCorta, formatHuespedes, formatNoches } from '../hotelFormat';
import { SERVICIO_INFO } from '../servicios';

export const HotelDetailPage = () => {
  const { hotel, params, setSearchParams, isLoading, error, avisoFechas } = useHotelDetail();

  if (isLoading) {
    return (
      <SectionContainer className="py-8">
        <div className="flex h-64 w-full flex-col items-center justify-center gap-3 rounded-2xl border border-black/10 bg-white">
          <span className="material-symbols-outlined animate-spin text-4xl text-[#00205B]">
            autorenew
          </span>
          <p className="font-semibold text-[#00205B]">Cargando hotel...</p>
        </div>
      </SectionContainer>
    );
  }

  if (error || !hotel) {
    return (
      <SectionContainer className="py-8">
        <div className="flex h-64 w-full flex-col items-center justify-center gap-3 rounded-2xl border border-red-200 bg-red-50 text-red-600">
          <span className="material-symbols-outlined text-4xl">error</span>
          <p className="font-semibold">{error}</p>
          <Link to="/" className="text-secondary font-bold underline">
            Volver al inicio
          </Link>
        </div>
      </SectionContainer>
    );
  }

  const conFechas = hotel.noches !== null && params.checkIn && params.checkOut;

  return (
    <SectionContainer className="py-8">
      <Link
        to={buildHotelsUrl({ ...params, destino: params.destino || hotel.ciudad })}
        className="text-secondary/70 hover:text-secondary flex w-fit items-center gap-1 text-sm font-semibold"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Volver a los resultados
      </Link>

      <header className="flex flex-col gap-2">
        <Estrellas cantidad={hotel.estrellas} />
        <h1 className="text-secondary text-3xl font-bold">{hotel.nombre}</h1>
        <p className="text-secondary/60 flex items-center gap-1">
          <span className="material-symbols-outlined text-[18px]">location_on</span>
          {hotel.direccion}, {hotel.ciudad}, {hotel.pais}
        </p>
        {hotel.cantidadResenas > 0 && (
          <span className="bg-secondary w-fit rounded-md px-2 py-1 text-xs font-semibold text-white">
            {hotel.calificacionPromedio.toFixed(1)} · {hotel.cantidadResenas} reseñas
          </span>
        )}
      </header>

      <HotelGallery imagenes={hotel.imagenes} nombre={hotel.nombre} />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="flex min-w-0 flex-col gap-6">
          {hotel.descripcion && (
            <section className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
              <h2 className="text-secondary mb-2 text-lg font-bold">Sobre el hotel</h2>
              <p className="text-secondary/80">{hotel.descripcion}</p>
            </section>
          )}

          <section className="flex flex-col gap-4">
            <h2 className="text-secondary text-xl font-bold">Habitaciones</h2>
            {conFechas ? (
              <p className="text-secondary/70 text-sm">
                {formatFechaCorta(params.checkIn!)} – {formatFechaCorta(params.checkOut!)} ·{' '}
                {formatNoches(hotel.noches!)} · {formatHuespedes(params.huespedes)}
              </p>
            ) : (
              <>
                {avisoFechas && (
                  <p role="alert" className="text-alert text-sm font-semibold">
                    {avisoFechas}
                  </p>
                )}
                <ElegirFechas params={params} onBuscar={(q) => setSearchParams(q)} />
              </>
            )}
            {hotel.habitaciones.map((h) => (
              <HabitacionCard key={h.id} habitacion={h} noches={hotel.noches} />
            ))}
          </section>
        </div>

        <aside className="flex flex-col gap-6">
          <section className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <h2 className="text-secondary mb-4 text-lg font-bold">Servicios</h2>
            <ul className="grid grid-cols-2 gap-3">
              {hotel.servicios.map((s) => (
                <li key={s} className="text-secondary/80 flex items-center gap-2 text-sm">
                  <span className="material-symbols-outlined text-[20px]">
                    {SERVICIO_INFO[s].icon}
                  </span>
                  {SERVICIO_INFO[s].label}
                </li>
              ))}
              {hotel.allInclusive && (
                <li className="flex items-center gap-2 text-sm font-semibold text-[#00A3E0]">
                  <span className="material-symbols-outlined text-[20px]">all_inclusive</span>
                  All inclusive
                </li>
              )}
            </ul>
          </section>

          <section className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <h2 className="text-secondary mb-1 text-lg font-bold">Política de cancelación</h2>
            <p className="text-secondary/60 mb-4 text-xs">
              La define el hotel. Se cuenta hasta el check-in ({hotel.horaCheckIn.slice(0, 5)} h,
              hora local).
            </p>
            <PoliticaCancelacion tramos={hotel.politicaCancelacion} />
          </section>
        </aside>
      </div>
    </SectionContainer>
  );
};
