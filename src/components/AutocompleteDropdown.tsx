import { useEffect, useRef } from 'react';
import { MapPin, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';

export interface AutocompleteOption {
  city: string;
  country: string;
  description: string;
}

interface AutocompleteDropdownProps {
  options: AutocompleteOption[];
  isVisible: boolean;
  onSelect: (option: AutocompleteOption) => void;
  onClose: () => void;
}

export const AutocompleteDropdown = ({
  options,
  isVisible,
  onSelect,
  onClose
}: AutocompleteDropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, onClose]);

  if (!isVisible || options.length === 0) {
    return null;
  }

  return (
    <Card 
      ref={dropdownRef}
      className="absolute top-full left-0 right-0 mt-1 z-50 bg-card border shadow-lg max-h-60 overflow-y-auto"
    >
      <div className="py-1">
        {options.map((option, index) => (
          <button
            key={`${option.city}-${option.country}-${index}`}
            onClick={() => onSelect(option)}
            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted transition-colors focus:bg-muted focus:outline-none"
          >
            <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-foreground truncate">
                {option.city}
              </div>
              <div className="text-sm text-muted-foreground truncate">
                {option.country}
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          </button>
        ))}
      </div>
    </Card>
  );
};