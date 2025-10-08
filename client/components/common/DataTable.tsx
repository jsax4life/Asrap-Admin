import { ReactNode } from 'react';
import { TableColumn, SortConfig } from '@/types';
import { cn } from '@/lib/utils';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface DataTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  sortConfig?: SortConfig;
  onSort?: (key: string) => void;
  className?: string;
  emptyMessage?: string;
}

export function DataTable<T>({
  data,
  columns,
  sortConfig,
  onSort,
  className,
  emptyMessage = 'No data available',
}: DataTableProps<T>) {
  const handleSort = (key: string) => {
    if (onSort) {
      onSort(key);
    }
  };

  const getSortIcon = (columnKey: string) => {
    if (!sortConfig || sortConfig.key !== columnKey) {
      return null;
    }
    
    return sortConfig.direction === 'asc' ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  if (data.length === 0) {
    return (
      <div className="rounded-lg bg-asra-gray-1 border border-asra-gray-5 p-8 text-center">
        <p className="text-asra-gray-6">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn('rounded-lg bg-asra-gray-1 border border-asra-gray-5 overflow-hidden', className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-asra-gray-5">
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={cn(
                    'text-white text-xs font-bold tracking-[0.24px] leading-4 px-4 lg:px-6 py-3',
                    column.sortable && 'cursor-pointer hover:bg-asra-gray-2 select-none',
                    'text-left'
                  )}
                  onClick={() => column.sortable && handleSort(String(column.key))}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && getSortIcon(String(column.key))}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={index}
                className={cn(
                  'border-b border-asra-gray-5',
                  index % 2 === 0 ? 'bg-asra-gray-1' : 'bg-transparent'
                )}
              >
                {columns.map((column) => (
                  <td key={String(column.key)} className="px-4 lg:px-6 py-3 lg:py-4">
                    {column.render
                      ? column.render(item[column.key], item)
                      : String(item[column.key] || '-')
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
