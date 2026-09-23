const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const MODEL = 'gemini-3.8-flash';

const itinerarySchema = {
  type: 'OBJECT',
  properties: {
    title: { type: 'STRING' },
    destination: { type: 'STRING' },
    summary: { type: 'STRING' },
    days: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          day: { type: 'INTEGER' },
          date: { type: 'STRING' },
          activities: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: {
                id: { type: 'STRING' },
                name: { type: 'STRING' },
                description: { type: 'STRING' },
                location: { type: 'STRING' },
                startTime: { type: 'STRING' },
                durationMinutes: { type: 'INTEGER' },
                latitude: { type: 'NUMBER' },
                longitude: { type: 'NUMBER' },
              },
              required: ['id', 'name', 'description', 'location', 'startTime', 'durationMinutes'],
            },
          },
        },
        required: ['day', 'date', 'activities'],
      },
    },
  },
  required: ['title', 'destination', 'summary', 'days'],
};

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json();
    const destination = String(body.destination || '').trim();
    const travelers = Number(body.travelers || 1);
    const budget = String(body.budget || 'moderate');
    const interests = Array.isArray(body.interests) ? body.interests : [];
    const startDate = String(body.startDate || '');
    const endDate = String(body.endDate || '');

    if (!destination || !interests.length) {
      return new Response(JSON.stringify({ error: 'Destination and at least one interest are required.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'GEMINI_API_KEY is not configured on the server.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const prompt = `Create a practical travel itinerary for:
Destination: ${destination}
Travelers: ${travelers}
Budget: ${budget}
Interests: ${interests.join(', ')}
Start date: ${startDate || 'not specified'}
End date: ${endDate || 'not specified'}

Rules:
- Produce 3 days unless dates clearly specify a different trip length.
- Keep activities geographically sensible and avoid impossible travel times.
- Do not invent precise opening hours, prices, ratings, phone numbers, or coordinates.
- Use place names as suggestions; a separate Places API step will verify them later.
- Give realistic start times and durations.
- Return only the requested JSON structure.`;

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.4,
            responseMimeType: 'application/json',
            responseSchema: itinerarySchema,
          },
        }),
      },
    );

    if (!geminiResponse.ok) {
      const details = await geminiResponse.text();
      return new Response(JSON.stringify({ error: 'Gemini request failed.', details }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const result = await geminiResponse.json();
    const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('Gemini returned no itinerary content.');
    }

    const itinerary = JSON.parse(text);

    return new Response(JSON.stringify(itinerary), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unexpected server error.' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});
