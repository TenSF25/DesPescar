import type { HTMLAttributes } from 'react';
import { cn } from '../../../../utils/cn';

interface SeparatorInterface extends HTMLAttributes<HTMLDivElement> {
  sector: string;
  colorBorder?: string;
  colorText?: string;
}

export const SeparatorClass = ({ sector, colorBorder, colorText }: SeparatorInterface) => {
  return (
    <div className="separator-text flex w-full flex-col items-center">
      <div className="separator flex w-full flex-row items-center">
        <hr className={cn(`flex-1 border`, colorBorder)} />
        <div className="flex shrink-0 items-center justify-center gap-2 rounded-lg p-3">
          <h5 className={cn(`font-semibold`, colorText)}>{sector}</h5>
          <h5 className="text-[16px] font-bold text-black">$30.697</h5>
        </div>
        <hr className={cn(`flex-1 border`, colorBorder)} />
      </div>

      <div className="text -my-3">
        <h6 className="text-[14px] text-[#636680]">Bajás primero del avión</h6>
      </div>
    </div>
  );
};
