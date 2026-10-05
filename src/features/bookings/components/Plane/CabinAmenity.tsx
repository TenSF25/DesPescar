import type { MetadataAmenity } from '../../bookings.types';

interface CabinAmenityProps {
  type: string;
  metadata?: MetadataAmenity;
}

export const CabinAmenity = ({ type, metadata }: CabinAmenityProps) => {
  if (type === 'class_divider') {
    return (
      <div className="separator-text my-2 flex w-full flex-col items-center">
        <div className="separator flex w-full flex-row items-center">
          <hr className="flex-1 border-gray-300" />
          <div className="flex shrink-0 items-center justify-center gap-2 rounded-lg bg-gray-50 px-4 py-2">
            <h5 className="font-semibold text-gray-700">{metadata?.title}</h5>
            {metadata?.priceTag && (
              <h5 className="text-[16px] font-bold text-black">${metadata.priceTag}</h5>
            )}
          </div>
          <hr className="flex-1 border-gray-300" />
        </div>
        {metadata?.subtitle && (
          <div className="-my-1">
            <h6 className="text-[13px] text-[#636680]">{metadata.subtitle}</h6>
          </div>
        )}
      </div>
    );
  }

  if (type === 'columns') {
    return (
      <div className="flex w-full items-center justify-between px-0 font-bold text-gray-400 sm:px-2">
        {/* Aquí puedes mapear dinámicamente o dejarlo fijo si tu avión siempre es 3-3 */}
        <div className="w-10 text-center sm:w-12">A</div>
        <div className="w-10 text-center sm:w-12">B</div>
        <div className="w-10 text-center sm:w-12">C</div>
        <div className="w-10 text-center sm:w-12"></div> {/* Pasillo */}
        <div className="w-10 text-center sm:w-12">D</div>
        <div className="w-10 text-center sm:w-12">E</div>
        <div className="w-10 text-center sm:w-12">F</div>
      </div>
    );
  }

  if (type === 'services') {
    return (
      <div className="flex w-full flex-row justify-between px-2">
        <div className="flex w-full justify-center rounded-lg border-2 border-dashed border-gray-300 px-3 py-2 text-center">
          <span className="material-symbols-outlined text-[28px] text-gray-400">
            {metadata?.icons?.[0] || 'wc'}
          </span>
        </div>
        <div className="min-w-10 sm:min-w-12"></div> {/* Espacio pasillo */}
        <div className="flex w-full justify-center rounded-lg border-2 border-dashed border-gray-300 px-3 py-2 text-center">
          <span className="material-symbols-outlined text-[28px] text-gray-400">
            {metadata?.icons?.[1] || 'coffee'}
          </span>
        </div>
      </div>
    );
  }

  if (type === 'emergency') {
    return (
      <div className="flex w-full flex-row items-center px-2">
        <hr className="w-full border-2 border-red-200" />
        <div className="mx-2 flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
          <span className="material-symbols-outlined text-2xl text-red-400">directions_run</span>
        </div>
        <hr className="w-full border-2 border-red-200" />
      </div>
    );
  }

  return null;
};
