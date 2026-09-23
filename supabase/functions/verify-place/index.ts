const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

type Place = {
  id: string;
  name?: string;
  formattedAddress?: string;
  location?: { latitude?: number; longitude?: number };
  rating?: number;
  userRatingCount?: number;
  types?: string[];
  websiteUri?: string;
  googleMapsUri?: string;
};

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  try {
    const { query, destination } = await request.json();
    if (!query || !destination) {
      return new Response(JSON.stringify({ error: 'query and destination are required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const apiKey = Deno.env.get('GOOGLE_MAPS_API_KEY');
    if (!apiKey) throw new Error('GOOGLE_MAPS_API_KEY is not configured.');

    const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.types,places.websiteUri,places.googleMapsUri',
      },
      body: JSON.stringify({
        textQuery: `${query} in ${destination}`,
        maxResultCount: 5,
      }),
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'Places search failed.', details: await response.text() }), { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const data = await response.json();
    const places = (data.places || []) as Place[];

    return new Response(JSON.stringify({
      places: places.map((place) => ({
        placeId: place.id,
        name: place.name,
        address: place.formattedAddress,
        latitude: place.location?.latitude,
        longitude: place.location?.longitude,
        rating: place.rating,
        userRatingCount: place.userRatingCount,
        types: place.types,
        websiteUri: place.websiteUri,
        googleMapsUri: place.googleMapsUri,
      })),
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unexpected error.' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});