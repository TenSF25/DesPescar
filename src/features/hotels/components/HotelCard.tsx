import { Link } from 'react-router-dom';
import { formatCurrency } from '../../../utils/formatCurrency';
import type { HotelCardProps } from '../hotels.types';

interface Props extends HotelCardProps {
  queryParams?: string;
}

export const HotelCard = ({
  id,
  nombre,
  ciudad,
  pais,
  estrellas,
  precioPorNoche,
  imageUrl,
  queryParams,
}: Props) => {
  const destino = queryParams ? `/hotels/${id}?${queryParams}` : `/hotels/${id}`;

  return (
    <div className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-black/17 bg-white shadow-[4px_4px_30px_-4px_rgba(0,0,0,0.25)] transition-all duration-400 hover:-translate-y-3">
      <div className="relative h-54">
        <img
          src={imageUrl}
          className="absolute inset-0 h-54 w-full object-cover transition-transform duration-600 ease-out group-hover:scale-110"
          alt={nombre}
        />
      </div>
      <div className="flex flex-col gap-2 p-6">
        <div className="flex items-center justify-between">
          <h4 className="text-neutral flex items-center gap-1 text-[14px]">
            <span className="material-symbols-outlined text-primary text-[18px]!">
              location_on
            </span>
            {ciudad}, {pais}
          </h4>
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={`material-symbols-outlined text-[18px]! ${
                  i < estrellas ? 'text-primary' : 'text-black/20'
                }`}
              >
                star
              </span>
            ))}
          </div>
        </div>

        <h2 className="text-secondary text-xl font-semibold">{nombre}</h2>

        <div className="mt-2 flex items-center justify-between">
          <div>
            <p className="text-neutral text-[12px]">Precio por noche</p>
            <h3 className="text-secondary text-2xl font-medium">
              {formatCurrency(precioPorNoche)}
            </h3>
          </div>
          <Link
            to={destino}
            className="bg-primary rounded-xl px-5 py-2.5 text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
          >
            Ver detalles
          </Link>
        </div>
      </div>
    </div>
  );
};
