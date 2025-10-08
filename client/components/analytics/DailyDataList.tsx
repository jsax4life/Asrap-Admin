import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface DailyDataItem {
  label: string;
  value: number;
}

interface DailyDataListProps {
  data: DailyDataItem[];
  className?: string;
  filterDropdown?: ReactNode;
}

export const DailyDataList = ({ data, className, filterDropdown }: DailyDataListProps) => {
  return (
    <div className={cn(
      'bg-asra-gray-1 rounded-lg border border-asra-gray-5 p-4',
      className
    )}>
      {filterDropdown}
      <div className="space-y-3">
        {data.map((item, index) => (
          <div
            key={index}
            className={cn(
              'flex justify-between items-center py-2 px-3 rounded',
              index % 2 === 0 ? 'bg-asra-gray-2' : 'bg-transparent'
            )}
          >
            <span className="text-asra-gray-6 text-sm">{item.label}</span>
            <span className="text-white text-sm font-semibold">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
