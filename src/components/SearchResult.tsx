import { useState } from 'react';
import { MapPin, Copy, Check, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

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

interface SearchResultProps {
  result: SearchResponse;
}

export const SearchResult = ({ result }: SearchResultProps) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const { toast } = useToast();

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
      toast({
        title: "Copied!",
        description: `${fieldName} copied to clipboard`,
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const CopyButton = ({ text, fieldName }: { text: string; fieldName: string }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => copyToClipboard(text, fieldName)}
      className="h-8 w-8 rounded-full p-0 hover:bg-muted"
    >
      {copiedField === fieldName ? (
        <Check className="h-4 w-4 text-success" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
      <span className="sr-only">Copy {fieldName}</span>
    </Button>
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5 text-success" />
            Location Found
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Main Result */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <div className="text-sm text-muted-foreground">City</div>
                <div className="text-lg font-semibold text-foreground">{result.city}</div>
              </div>
              <CopyButton text={result.city} fieldName="City" />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <div className="text-sm text-muted-foreground">Country</div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-foreground">
                    {result.country.name}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {result.country.code}
                  </Badge>
                </div>
              </div>
              <CopyButton 
                text={`${result.country.name} (${result.country.code})`} 
                fieldName="Country" 
              />
            </div>
          </div>

          {/* Full Location Copy */}
          <div className="pt-2 border-t">
            <Button
              variant="outline"
              onClick={() => copyToClipboard(
                `${result.city}, ${result.country.name} (${result.country.code})`,
                "Full location"
              )}
              className="w-full flex items-center gap-2"
            >
              {copiedField === "Full location" ? (
                <Check className="h-4 w-4 text-success" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              Copy Full Location
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alternatives */}
      {result.alternatives && result.alternatives.length > 0 && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Multiple Locations Found
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              We found multiple cities with this name. Here are the alternatives:
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {result.alternatives.map((alt, index) => (
                <div 
                  key={`${alt.city}-${alt.country.code}-${index}`}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card"
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="font-medium">{alt.city}</span>
                      <span className="text-muted-foreground ml-2">
                        {alt.country.name}
                      </span>
                      <Badge variant="outline" className="ml-2 text-xs">
                        {alt.country.code}
                      </Badge>
                    </div>
                  </div>
                  <CopyButton 
                    text={`${alt.city}, ${alt.country.name} (${alt.country.code})`} 
                    fieldName={`${alt.city}, ${alt.country.name}`}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};