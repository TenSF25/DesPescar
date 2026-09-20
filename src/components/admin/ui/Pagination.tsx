import { cn } from '../../../utils/cn';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
  itemLabel?: string;
}

const getPageList = (current: number, total: number): (number | 'ellipsis')[] => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | 'ellipsis')[] = [1];
  if (current > 3) pages.push('ellipsis');

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push('ellipsis');
  pages.push(total);

  return pages;
};

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  itemLabel = 'resultados',
}: PaginationProps) => {
  const pages = getPageList(currentPage, totalPages);

  const rangeStart = itemsPerPage ? (currentPage - 1) * itemsPerPage + 1 : undefined;
  const rangeEnd =
    itemsPerPage && totalItems ? Math.min(currentPage * itemsPerPage, totalItems) : undefined;

  return (
    <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
      {totalItems !== undefined && rangeStart !== undefined && rangeEnd !== undefined && (
        <span className="text-sm text-[#44474E]">
          Mostrando {rangeStart}-{rangeEnd} de {totalItems} {itemLabel}
        </span>
      )}
      <div className="ml-auto flex items-center gap-1">
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-[#44474E] hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span className="material-symbols-outlined text-[18px]">chevron_left</span>
        </button>

        {pages.map((page, idx) =>
          page === 'ellipsis' ? (
            <span key={`ellipsis-${idx}`} className="px-2 text-[#44474E]">
              …
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={cn(
                'flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-sm font-semibold text-[#44474E] hover:bg-black/5',
                page === currentPage && 'bg-secondary text-white hover:bg-secondary',
              )}
            >
              {page}
            </button>
          ),
        )}

        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-[#44474E] hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span className="material-symbols-outlined text-[18px]">chevron_right</span>
        </button>
      </div>
    </div>
  );
};
