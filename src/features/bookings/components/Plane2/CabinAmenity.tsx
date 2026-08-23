import { cn } from '../../../../utils/cn';

interface CabinAmenity {
  type: 'class' | 'columns' | 'services' | 'emergency' | string;

  classInfo?: {
    name: string;
    price: string;
    color: string;
    description: string;
  };

  servicesInfo?: {
    left: 'wc' | 'coffee' | string;
    right: 'wc' | 'coffee' | string;
  };
}

export const CabinAmenity = ({ type, classInfo, servicesInfo }: CabinAmenity) => {
  if (type === 'class') {
    return (
      <div className="separator-text flex w-full flex-col items-center">
        <div className="separator flex w-full flex-row items-center">
          <hr className={cn(`flex-1 border`)} />
          <div className="flex shrink-0 items-center justify-center gap-2 rounded-lg p-3">
            <h5 className={cn(`font-semibold`)}>{classInfo?.name}</h5>
            <h5 className="text-[16px] font-bold text-black">${classInfo?.price}</h5>
          </div>
          <hr className={cn(`flex-1 border`)} />
        </div>

        <div className="text -my-3">
          <h6 className="text-[14px] text-[#636680]">{classInfo?.description}</h6>
        </div>
      </div>
    );
  }
  if (type === 'columns') {
    return (
      <div className="rows flex flex-row justify-between">
        <div className="flex max-h-16 w-full items-center justify-between text-center font-medium text-[#636680]">
          <div className="w-16 p-5">
            <h4>A</h4>
          </div>
          <div className="w-16 p-5">
            <h4>B</h4>
          </div>
          <div className="w-16 p-5">
            <h4>C</h4>
          </div>
          <div className="w-16 p-5"></div>
          <div className="w-16 p-5">
            <h4>D</h4>
          </div>
          <div className="w-16 p-5">
            <h4>E</h4>
          </div>
          <div className="w-16 p-5">
            <h4>F</h4>
          </div>
        </div>
      </div>
    );
  }
  if (type === 'services') {
    return (
      <div className="service flex flex-row justify-between">
        <div className="service w-full rounded-lg border border-dashed border-[#b7b8c2] px-3 py-2 text-center">
          <span className="material-symbols-outlined text-[32px]! text-[#b7b8c2]">
            {servicesInfo?.left}
          </span>
        </div>
        <div className="min-w-16"></div>
        <div className="service w-full rounded-lg border border-dashed border-[#b7b8c2] px-3 py-2 text-center">
          <span className="material-symbols-outlined text-[32px]! text-[#b7b8c2]">
            {servicesInfo?.right}
          </span>
        </div>
      </div>
    );
  }
  if (type === 'emergency') {
    return (
      <div className="separator flex flex-row items-center">
        <hr className="w-full border-2 border-[#b7b8c2]" />
        <div className="flex max-h-10 max-w-10 items-center justify-center rounded-lg bg-[#b7b8c2] p-3">
          <span className="material-symbols-outlined text-3xl! text-white">directions_walk</span>
        </div>
        <hr className="w-full border-2 border-[#b7b8c2]" />
      </div>
    );
  }
};
