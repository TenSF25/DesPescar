import { Link } from 'react-router';
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/formatCurrency';
import type { HotelResumen, HotelSearchParams } from '../../hotels.types';
import { buildHotelDetailUrl } from '../../hotelSearchParams';
import { Estrellas } from '../Estrellas';
import { ServiciosIcons } from '../ServiciosIcons';

interface Props {
  hotel: HotelResumen;
  params: HotelSearchParams;
}

export const HotelResultCard = ({ hotel, params }: Props) => {
  const sinLugar = hotel.disponible === false;
  return (
    <article
      className={cn(
        'flex w-full flex-col overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm transition-all hover:border-[#00A3E0]/30 hover:shadow-md md:flex-row',
        sinLugar && 'opacity-60',
      )}
    >
      <div className="h-48 w-full shrink-0 bg-[#F8FAFC] md:h-auto md:w-64">
        {hotel.imagenPrincipal ? (
          <img
            src={hotel.imagenPrincipal}
            alt={hotel.nombre}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="material-symbols-outlined text-secondary/30 text-5xl">apartment</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between gap-4 p-6 md:flex-row md:items-center">
        <div className="flex flex-col gap-2">
          <Estrellas cantidad={hotel.estrellas} />
          <h3 className="text-secondary text-xl font-bold">{hotel.nombre}</h3>
          <p className="text-secondary/60 flex items-center gap-1 text-sm">
            <span className="material-symbols-outlined text-[16px]">location_on</span>
            {hotel.ciudad}, {hotel.pais}
          </p>
          <ServiciosIcons servicios={hotel.servicios} />
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            {hotel.allInclusive && (
              <span className="rounded-full bg-[#00A3E0]/10 px-2 py-1 text-[#00A3E0]">
                All inclusive
              </span>
            )}
            {hotel.cantidadResenas > 0 ? (
              <span className="bg-secondary rounded-md px-2 py-1 text-white">
                {hotel.calificacionPromedio.toFixed(1)} · {hotel.cantidadResenas} reseñas
              </span>
            ) : (
              <span className="text-secondary/50">Sin reseñas todavía</span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-start gap-2 md:items-end md:text-right">
          {sinLugar ? (
            <p className="text-alert font-semibold">Sin disponibilidad para tus fechas</p>
          ) : hotel.precioTotalDesde !== null ? (
            <>
              <p className="text-secondary/50 text-[10px] font-bold tracking-wider uppercase">
                Total de la estadía
              </p>
              <p className="text-primary text-2xl font-bold">
                {formatCurrency(hotel.precioTotalDesde)}
              </p>
            </>
          ) : hotel.precioDesde !== null ? (
            <>
              <p className="text-secondary/50 text-[10px] font-bold tracking-wider uppercase">
                Desde
              </p>
              <p className="text-primary text-2xl font-bold">
                {formatCurrency(hotel.precioDesde)}
                <span className="text-secondary/50 text-sm font-medium"> /noche</span>
              </p>
            </>
          ) : null}
          <Link
            to={buildHotelDetailUrl(hotel.id, params)}
            className="bg-primary hover:bg-primary/90 rounded-[10px] px-6 py-2.5 font-bold text-white transition-all active:scale-95"
          >
            Ver hotel
          </Link>
        </div>
      </div>
    </article>
  );
};
