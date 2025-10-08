import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ChartDataPoint {
  day: string;
  value: number;
}

interface AnalyticsLineChartProps {
  data: ChartDataPoint[];
  className?: string;
}

export const AnalyticsLineChart = ({ data, className }: AnalyticsLineChartProps) => {
  const [hoveredPoint, setHoveredPoint] = useState<ChartDataPoint | null>(null);

  // Calculate chart dimensions and scaling
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;
  const chartHeight = 200;
  const chartWidth = 400;

  // Convert data to SVG coordinates
  const points = data.map((point, index) => {
    const x = (index / (data.length - 1)) * chartWidth;
    const y = chartHeight - ((point.value - minValue) / range) * chartHeight;
    return { x, y, ...point };
  });

  // Create path for the line
  const pathData = points.reduce((path, point, index) => {
    const command = index === 0 ? 'M' : 'L';
    return `${path} ${command} ${point.x} ${point.y}`;
  }, '');

  // Format value for display
  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toString();
  };

  return (
    <div className={cn('relative', className)}>
      {/* Chart Container */}
      <div className="relative w-full h-[200px]">
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="overflow-visible"
        >
          {/* Grid Lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
            <line
              key={ratio}
              x1="0"
              y1={chartHeight * ratio}
              x2={chartWidth}
              y2={chartHeight * ratio}
              stroke="rgba(116, 114, 114, 0.2)"
              strokeWidth="1"
            />
          ))}

          {/* Y-axis labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
            <text
              key={ratio}
              x="-10"
              y={chartHeight * ratio + 4}
              textAnchor="end"
              className="text-xs fill-asra-gray-6"
            >
              {formatValue(maxValue - (maxValue - minValue) * ratio)}
            </text>
          ))}

          {/* X-axis labels */}
          {points.map((point, index) => (
            <text
              key={index}
              x={point.x}
              y={chartHeight + 20}
              textAnchor="middle"
              className="text-xs fill-asra-gray-6"
            >
              {point.day}
            </text>
          ))}

          {/* Line */}
          <path
            d={pathData}
            fill="none"
            stroke="#C40505"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="#C40505"
              className="cursor-pointer hover:r-6 transition-all duration-200"
              onMouseEnter={() => setHoveredPoint(point)}
              onMouseLeave={() => setHoveredPoint(null)}
            />
          ))}
        </svg>
      </div>

      {/* Tooltip */}
      {hoveredPoint && (
        <div className="absolute bg-asra-gray-1 border border-asra-gray-5 rounded-lg p-3 shadow-lg z-10 pointer-events-none">
          <div className="text-white text-sm font-semibold">
            {hoveredPoint.day} {new Date().getFullYear()}
          </div>
          <div className="text-asra-gray-6 text-xs">
            {formatValue(hoveredPoint.value)}
          </div>
        </div>
      )}
    </div>
  );
};
