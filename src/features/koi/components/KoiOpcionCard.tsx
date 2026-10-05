import { Estrellas } from '@/features/hotels/components/Estrellas';
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/formatCurrency';
import type { KoiOpcion } from '../koi.types';
import { botonesDeOpcion, type AccionKoi } from '../koiAcciones';
import {
  desgloseOpcion,
  fechaDe,
  resumenEstadia,
  textoExcedente,
  tramoVuelo,
} from '../koiFormat';

interface Props {
  opcion: KoiOpcion;
  /** Sin handler la card es solo informativa (no muestra botones). */
  onAccion?: (opcion: KoiOpcion, accion: AccionKoi) => void;
  /** Mientras se agrega algo al carrito los botones quedan deshabilitados. */
  ocupado?: boolean;
}

/**
 * Opción de KOI compacta, con la estética de vuelos (card blanca rounded-2xl, borde #E2E8F0,
 * precio en primary). Pensada para el ancho del chat: ~326 px a 390 px de pantalla.
 */
export const KoiOpcionCard = ({ opcion, onAccion, ocupado = false }: Props) => {
  const { vuelo, hotel } = opcion;
  return (
    <article className="w-full overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white text-left shadow-sm">
      {hotel && (
        <div className="flex gap-3 p-3">
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#F8FAFC]">
            {hotel.imagen ? (
              <img
                src={hotel.imagen}
                alt={hotel.hotelNombre}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="material-symbols-outlined text-secondary/30 flex h-full items-center justify-center text-3xl">
                apartment
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <Estrellas cantidad={hotel.estrellas} />
            <h4 className="text-secondary truncate text-sm font-bold">{hotel.hotelNombre}</h4>
            <p className="text-secondary/60 truncate text-xs">{hotel.ciudad}</p>
            <p className="text-secondary/80 text-xs">{resumenEstadia(hotel)}</p>
            <p className="text-secondary/60 text-xs">
              {fechaDe(hotel.checkIn)} → {fechaDe(hotel.checkOut)}
            </p>
          </div>
        </div>
      )}

      {vuelo && (
        <div className={cn('flex gap-2 px-3 py-2 text-xs', hotel && 'border-t border-[#E2E8F0]')}>
          <span className="material-symbols-outlined text-secondary/70 text-[18px]" aria-hidden="true">
            flight
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-secondary font-bold">{vuelo.aerolinea}</p>
            <p className="text-secondary/80">
              <span className="font-semibold">Ida</span> {vuelo.numeroIda} ·{' '}
              {tramoVuelo(vuelo.salidaIda, vuelo.llegadaIda)}
            </p>
            {vuelo.salidaVuelta && vuelo.llegadaVuelta && (
              <p className="text-secondary/80">
                <span className="font-semibold">Vuelta</span> {vuelo.numeroVuelta} ·{' '}
                {tramoVuelo(vuelo.salidaVuelta, vuelo.llegadaVuelta)}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="border-t border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2">
        <ul className="text-secondary/70 space-y-0.5 text-xs">
          {desgloseOpcion(opcion).map((linea) => (
            <li key={linea.etiqueta} className="flex justify-between gap-2">
              <span className="truncate">{linea.etiqueta}</span>
              <span className="shrink-0">{formatCurrency(linea.monto)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-1 flex items-baseline justify-between gap-2">
          <span className="text-secondary/50 text-[10px] font-bold tracking-wider uppercase">
            Total
          </span>
          <span className="text-primary text-lg font-bold">{formatCurrency(opcion.total)}</span>
        </div>
        {opcion.excedeEn !== undefined && opcion.excedeEn !== null && (
          <p className="text-alert mt-1 text-xs font-semibold">{textoExcedente(opcion.excedeEn)}</p>
        )}
        <p className="text-secondary/60 mt-1 text-[11px] leading-snug">{opcion.motivo}</p>
      </div>

      {onAccion && (
        <div className="flex flex-wrap gap-2 border-t border-[#E2E8F0] p-3">
          {botonesDeOpcion(opcion).map((boton) => (
            <button
              key={boton.accion}
              type="button"
              disabled={ocupado}
              onClick={() => onAccion(opcion, boton.accion)}
              className={cn(
                'min-h-9 rounded-[10px] px-3 text-xs font-bold transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-50',
                boton.principal
                  ? 'bg-primary hover:bg-primary/90 basis-full text-white'
                  : 'border-secondary/20 text-secondary hover:bg-secondary/5 flex-1 border bg-white',
              )}
            >
              {boton.etiqueta}
            </button>
          ))}
        </div>
      )}
    </article>
  );
};
