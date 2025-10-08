import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnalyticsMetricCardProps {
  label: string;
  value: string;
  trend: 'up' | 'down';
  className?: string;
}

export const AnalyticsMetricCard = ({ 
  label, 
  value, 
  trend, 
  className 
}: AnalyticsMetricCardProps) => {
  return (
    <div className={cn(
      'bg-asra-gray-1 rounded-lg p-4 border border-asra-gray-5',
      className
    )}>
      <div className="space-y-3">
        {/* Value */}
        <div className="text-white text-2xl font-bold">
          {value}
        </div>
        
        {/* Label */}
        <div className="text-asra-gray-6 text-sm">
          {label}
        </div>
        
        {/* Mini Chart */}
        <div className="flex items-end justify-between h-8">
          <div className="flex items-end gap-1">
            {[
              'h-2', 'h-3', 'h-4', 'h-2', 'h-5', 'h-3', 'h-4'
            ].map((height, i) => (
              <div
                key={i}
                className={cn(
                  'w-1 bg-asra-red rounded-sm',
                  height
                )}
              />
            ))}
          </div>
          
          {/* Trend Icon */}
          <div className={cn(
            'flex items-center',
            trend === 'up' ? 'text-green-500' : 'text-red-500'
          )}>
            {trend === 'up' ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
