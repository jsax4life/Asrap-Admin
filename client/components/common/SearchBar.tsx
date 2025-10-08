import { Search, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onClear?: () => void;
  className?: string;
  disabled?: boolean;
}

export const SearchBar = ({
  placeholder = 'Search...',
  value = '',
  onChange,
  onClear,
  className,
  disabled = false,
}: SearchBarProps) => {
  const [internalValue, setInternalValue] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    onChange?.(newValue);
  };

  const handleClear = () => {
    setInternalValue('');
    onChange?.('');
    onClear?.();
  };

  const currentValue = value !== undefined ? value : internalValue;

  return (
    <div className={cn(
      'flex items-center gap-4 bg-asra-gray-7/16 rounded-lg px-4 lg:px-8 py-3 lg:py-4',
      className
    )}>
      <Search className="w-5 h-5 lg:w-6 lg:h-6 text-asra-gray-7 flex-shrink-0" />
      <input
        type="text"
        placeholder={placeholder}
        value={currentValue}
        onChange={handleChange}
        disabled={disabled}
        className="bg-transparent text-asra-gray-7 text-sm outline-none flex-1 placeholder:text-asra-gray-7 disabled:opacity-50"
      />
      {currentValue && (
        <button
          onClick={handleClear}
          className="text-asra-gray-7 hover:text-white transition-colors"
          disabled={disabled}
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
