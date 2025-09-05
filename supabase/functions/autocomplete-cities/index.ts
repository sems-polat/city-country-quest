import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AutocompleteOption {
  city: string;
  country: string;
  description: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const query = url.searchParams.get('q');

    if (!query || query.trim().length < 2) {
      return new Response(
        JSON.stringify([]),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const googleMapsApiKey = Deno.env.get('GOOGLE_MAPS_API_KEY');
    if (!googleMapsApiKey) {
      console.error('GOOGLE_MAPS_API_KEY not found');
      return new Response(
        JSON.stringify([]),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use Places API Autocomplete with type restriction for cities
    const autocompleteUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&types=(cities)&key=${googleMapsApiKey}`;
    
    console.log('Calling Google Places Autocomplete API for query:', query);
    const response = await fetch(autocompleteUrl);
    const data = await response.json();

    console.log('Google Autocomplete API response:', JSON.stringify(data, null, 2));

    if (data.status !== 'OK' || !data.predictions) {
      return new Response(
        JSON.stringify([]),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const options: AutocompleteOption[] = [];
    
    for (const prediction of data.predictions.slice(0, 5)) { // Limit to 5 suggestions
      const description = prediction.description;
      const structured = prediction.structured_formatting;
      
      // Extract city and country from the description
      const parts = description.split(', ');
      if (parts.length >= 2) {
        const city = structured?.main_text || parts[0];
        const country = parts[parts.length - 1]; // Last part is usually the country
        
        options.push({
          city: city,
          country: country,
          description: description
        });
      }
    }

    return new Response(JSON.stringify(options), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in autocomplete-cities function:', error);
    return new Response(
      JSON.stringify([]),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});