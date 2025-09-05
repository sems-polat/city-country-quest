import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CityData {
  city: string;
  country: {
    name: string;
    code: string;
  };
}

interface SearchResponse {
  city: string;
  country: {
    name: string;
    code: string;
  };
  alternatives?: CityData[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const city = url.searchParams.get('city');

    if (!city || city.trim().length < 2) {
      return new Response(
        JSON.stringify({ error: 'City parameter is required and must be at least 2 characters' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const googleMapsApiKey = Deno.env.get('GOOGLE_MAPS_API_KEY');
    if (!googleMapsApiKey) {
      console.error('GOOGLE_MAPS_API_KEY not found');
      return new Response(
        JSON.stringify({ error: 'API configuration error' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // First try with locality type restriction
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(city)}&types=locality&key=${googleMapsApiKey}`;
    
    console.log('Calling Google Geocoding API for city:', city);
    const response = await fetch(geocodeUrl);
    const data = await response.json();

    console.log('Google API response:', JSON.stringify(data, null, 2));

    if (data.status !== 'OK' || !data.results || data.results.length === 0) {
      // Fallback: try without type restriction
      const fallbackUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(city)}&key=${googleMapsApiKey}`;
      const fallbackResponse = await fetch(fallbackUrl);
      const fallbackData = await fallbackResponse.json();
      
      if (fallbackData.status !== 'OK' || !fallbackData.results || fallbackData.results.length === 0) {
        return new Response(
          JSON.stringify({ error: `No results found for "${city}"` }),
          { 
            status: 404, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
      
      data.results = fallbackData.results;
    }

    const results: CityData[] = [];
    
    for (const result of data.results.slice(0, 5)) { // Limit to 5 results
      const components = result.address_components;
      
      // Find city name
      let cityName = '';
      const cityComponent = components.find((comp: any) => 
        comp.types.includes('locality') || 
        comp.types.includes('postal_town') ||
        comp.types.includes('administrative_area_level_2') ||
        comp.types.includes('administrative_area_level_1')
      );
      
      if (cityComponent) {
        cityName = cityComponent.long_name;
      }
      
      // Find country
      const countryComponent = components.find((comp: any) => comp.types.includes('country'));
      
      if (cityName && countryComponent) {
        results.push({
          city: cityName,
          country: {
            name: countryComponent.long_name,
            code: countryComponent.short_name
          }
        });
      }
    }

    if (results.length === 0) {
      return new Response(
        JSON.stringify({ error: `No valid city found for "${city}"` }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const response_data: SearchResponse = {
      city: results[0].city,
      country: results[0].country,
      alternatives: results.length > 1 ? results.slice(1) : undefined
    };

    return new Response(JSON.stringify(response_data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in resolve-city function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});