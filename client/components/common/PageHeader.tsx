import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

export const PageHeader = ({ title, description, children, className }: PageHeaderProps) => {
  return (
    <div className={cn('mb-8', className)}>
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-white text-2xl lg:text-[32px] font-bold leading-9 mb-2">
            {title}
          </h1>
          {description && (
            <p className="text-asra-gray-6 text-sm lg:text-base">
              {description}
            </p>
          )}
        </div>
        {children && (
          <div className="flex items-center gap-3">
            {children}
          </div>
        )}
      </div>
      <div className="w-full h-px bg-asra-gray-7 mt-6 lg:mt-8"></div>
    </div>
  );
};
