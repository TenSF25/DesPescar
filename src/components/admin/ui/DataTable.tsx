import { useMemo, useState } from 'react';
import { cn } from '@/utils/cn';
import type { SortDirection, TableColumn } from '../admin.types';

interface DataTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor: (row: T) => string | number;
  emptyMessage?: string;
}

const compareValues = (a: unknown, b: unknown) => {
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a ?? '').localeCompare(String(b ?? ''), 'es', { numeric: true });
};

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = 'No hay datos para mostrar.',
}: DataTableProps<T>) {
  const [sort, setSort] = useState<{ key: string; direction: SortDirection } | null>(null);

  const rows = useMemo(() => {
    if (!sort) return data;
    const factor = sort.direction === 'asc' ? 1 : -1;
    return [...data].sort(
      (a, b) =>
        factor *
        compareValues(
          (a as Record<string, unknown>)[sort.key],
          (b as Record<string, unknown>)[sort.key],
        ),
    );
  }, [data, sort]);

  const handleSort = (key: string) => {
    setSort((prev) =>
      prev?.key === key
        ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' },
    );
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-black/10 bg-white">
      <table className="w-full min-w-max text-left text-sm">
        <thead>
          <tr className="border-b border-black/10">
            {columns.map((col) => (
              <th
                key={col.key}
                aria-sort={
                  sort?.key === col.key
                    ? sort.direction === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : undefined
                }
                className="px-5 py-3 text-xs font-semibold tracking-wide text-[#44474E] uppercase"
              >
                {col.sortable ? (
                  <button
                    type="button"
                    onClick={() => handleSort(col.key)}
                    className="hover:text-secondary flex cursor-pointer items-center gap-1 uppercase"
                  >
                    {col.header}
                    <span className="material-symbols-outlined text-[16px]">
                      {sort?.key === col.key
                        ? sort.direction === 'asc'
                          ? 'arrow_upward'
                          : 'arrow_downward'
                        : 'unfold_more'}
                    </span>
                  </button>
                ) : (
                  col.header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-5 py-8 text-center text-[#44474E]">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={keyExtractor(row)}
                className="border-b border-black/5 last:border-0 hover:bg-black/2"
              >
                {columns.map((col) => (
                  <td key={col.key} className={cn('px-5 py-4 text-[#1A2B4C]', col.className)}>
                    {col.render
                      ? col.render(row)
                      : String((row as Record<string, unknown>)[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
