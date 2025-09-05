import { useState, useCallback, useRef, useEffect } from 'react';
import { Search, X, Loader2, MapPin, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AutocompleteDropdown } from './AutocompleteDropdown';
import { SearchResult } from './SearchResult';

export interface CityData {
  city: string;
  country: {
    name: string;
    code: string;
  };
}

export interface SearchResponse {
  city: string;
  country: {
    name: string;
    code: string;
  };
  alternatives?: CityData[];
}

export interface AutocompleteOption {
  city: string;
  country: string;
  description: string;
}

export const CitySearch = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SearchResponse | null>(null);
  const [autocompleteOptions, setAutocompleteOptions] = useState<AutocompleteOption[]>([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Debounced autocomplete
  useEffect(() => {
    if (query.length < 2) {
      setAutocompleteOptions([]);
      setShowAutocomplete(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        const { data, error } = await supabase.functions.invoke('autocomplete-cities', {
          body: { q: query }
        });
        
        if (error) {
          console.error('Autocomplete error:', error);
          return;
        }
        
        setAutocompleteOptions(data || []);
        setShowAutocomplete((data || []).length > 0);
      } catch (err) {
        console.error('Autocomplete error:', err);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSearch = useCallback(async (searchQuery?: string) => {
    const searchTerm = searchQuery || query.trim();
    if (!searchTerm || searchTerm.length < 2) {
      toast({
        title: "Invalid input",
        description: "Please enter at least 2 characters",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setShowAutocomplete(false);

    try {
      const { data, error } = await supabase.functions.invoke('resolve-city', {
        body: { city: searchTerm }
      });
      
      if (error) {
        throw new Error(error.message || 'Failed to resolve city');
      }
      
      if (!data) {
        throw new Error('No data received from server');
      }

      setResult(data);
      toast({
        title: "City found!",
        description: `${data.city}, ${data.country.name}`,
      });
    } catch (err) {
      setError('Failed to find city. Please try again.');
      toast({
        title: "Search failed",
        description: "Failed to find city. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [query, toast]);

  const handleClear = () => {
    setQuery('');
    setResult(null);
    setError(null);
    setShowAutocomplete(false);
    inputRef.current?.focus();
  };

  const handleAutocompleteSelect = (option: AutocompleteOption) => {
    setQuery(option.description);
    setShowAutocomplete(false);
    handleSearch(option.city);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowAutocomplete(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <Card className="relative overflow-visible">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Globe className="h-5 w-5 text-primary" />
            City → Country Finder
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter any city name to find its country and get the normalized location
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                ref={inputRef}
                type="text"
                placeholder="Type a city (e.g., Paris, São Paulo, Tokyo)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setShowAutocomplete(autocompleteOptions.length > 0)}
                className="pl-10 pr-20 h-12 text-base"
                autoComplete="off"
                disabled={isLoading}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {query && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleClear}
                    className="h-8 w-8 rounded-full p-0 hover:bg-muted"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Clear input</span>
                  </Button>
                )}
                <Button
                  onClick={() => handleSearch()}
                  disabled={isLoading || !query.trim()}
                  size="sm"
                  className="h-8 px-3"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <MapPin className="h-4 w-4" />
                  )}
                  <span className="sr-only">Search</span>
                </Button>
              </div>
            </div>

            <AutocompleteDropdown
              options={autocompleteOptions}
              isVisible={showAutocomplete}
              onSelect={handleAutocompleteSelect}
              onClose={() => setShowAutocomplete(false)}
            />
          </div>

          {error && (
            <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {result && <SearchResult result={result} />}

      <div className="text-center text-xs text-muted-foreground">
        <p>Powered by Google Maps Platform • Data usage subject to Google's terms</p>
      </div>
    </div>
  );
};