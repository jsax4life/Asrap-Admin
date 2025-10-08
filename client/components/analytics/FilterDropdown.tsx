import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  icon?: string;
  className?: string;
  placeholder?: string;
}

export const FilterDropdown = ({
  value,
  onChange,
  options,
  icon,
  className,
  placeholder = 'Select option'
}: FilterDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-4 py-2 bg-asra-gray-1 border border-asra-gray-5',
          'rounded-lg text-white text-sm font-medium hover:bg-asra-gray-2',
          'transition-colors duration-200 min-w-[120px] justify-between'
        )}
      >
        <div className="flex items-center gap-2">
          {icon && (
            <div className="w-6 h-6 bg-asra-gray-2 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">{icon}</span>
            </div>
          )}
          <span>{value || placeholder}</span>
        </div>
        <ChevronDown className={cn(
          'w-4 h-4 transition-transform duration-200',
          isOpen && 'rotate-180'
        )} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-asra-gray-1 border border-asra-gray-5 rounded-lg shadow-lg z-50">
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                className={cn(
                  'w-full px-4 py-2 text-left text-sm text-white hover:bg-asra-gray-2',
                  'transition-colors duration-200',
                  value === option && 'bg-asra-gray-2 text-asra-red'
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
