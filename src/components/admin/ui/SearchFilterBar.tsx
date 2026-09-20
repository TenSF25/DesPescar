import type { ReactNode } from 'react';
import { cn } from '../../../utils/cn';

interface SearchFilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  /** Los <Select /> de filtros van acá */
  children?: ReactNode;
  onFilterClick?: () => void;
  className?: string;
}

export const SearchFilterBar = ({
  searchValue,
  onSearchChange,
  placeholder = 'Buscar...',
  children,
  onFilterClick,
  className,
}: SearchFilterBarProps) => {
  return (
    <div className={cn('flex flex-col gap-3 md:flex-row md:items-center', className)}>
      <div className="flex flex-1 items-center gap-2 rounded-xl border border-black/15 bg-white px-3 py-2.5">
        <span className="material-symbols-outlined text-[18px] text-[#44474E]">search</span>
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="w-full text-sm text-[#44474E] outline-none placeholder:text-[#44474E]/60"
        />
      </div>

      {children}

      {onFilterClick && (
        <button
          type="button"
          onClick={onFilterClick}
          className="bg-secondary flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-secondary/90"
        >
          <span className="material-symbols-outlined text-[18px]">filter_alt</span>
          Filtros
        </button>
      )}
    </div>
  );
};
