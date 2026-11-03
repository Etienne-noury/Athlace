// Edge function: get-google-places
// Fetches Google Places (New) info for a football club using the Google Maps connector gateway.
// Returns gracefully nulled fields if the connector isn't configured or the place isn't found.

import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const GATEWAY_URL = 'https://connector-gateway.lovable.dev/google_maps';

interface PlacesResult {
  rating: number | null;
  user_ratings_total: number | null;
  formatted_phone_number: string | null;
  website: string | null;
  opening_hours: string[] | null;
  place_id: string | null;
}

const EMPTY: PlacesResult = {
  rating: null,
  user_ratings_total: null,
  formatted_phone_number: null,
  website: null,
  opening_hours: null,
  place_id: null,
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { clubNom, ville } = await req.json().catch(() => ({}));
    // Validation stricte : fonction appelable par tout visiteur, chaque appel est facturé par Google.
    const isValidText = (v: unknown, max: number) => typeof v === 'string' && v.trim().length > 0 && v.length <= max;
    if (!isValidText(clubNom, 150) || (ville != null && ville !== '' && !isValidText(ville, 100))) {
      return new Response(JSON.stringify({ error: 'clubNom is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const lovableKey = Deno.env.get('LOVABLE_API_KEY');
    const gmapsKey = Deno.env.get('GOOGLE_MAPS_API_KEY');

    if (!lovableKey || !gmapsKey) {
      // Connector not configured — return empty gracefully
      return new Response(JSON.stringify(EMPTY), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const textQuery = `${clubNom}${ville ? ' ' + ville : ''} football club`.slice(0, 200);

    const searchRes = await fetch(`${GATEWAY_URL}/places/v1/places:searchText`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${lovableKey}`,
        'X-Connection-Api-Key': gmapsKey,
        'Content-Type': 'application/json',
        'X-Goog-FieldMask':
          'places.id,places.displayName,places.rating,places.userRatingCount,places.nationalPhoneNumber,places.websiteUri,places.regularOpeningHours',
      },
      body: JSON.stringify({ textQuery, maxResultCount: 1, languageCode: 'fr' }),
    });

    if (!searchRes.ok) {
      console.error('Places searchText failed', searchRes.status, await searchRes.text());
      return new Response(JSON.stringify(EMPTY), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await searchRes.json();
    const place = data?.places?.[0];
    if (!place) {
      return new Response(JSON.stringify(EMPTY), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const result: PlacesResult = {
      rating: place.rating ?? null,
      user_ratings_total: place.userRatingCount ?? null,
      formatted_phone_number: place.nationalPhoneNumber ?? null,
      website: place.websiteUri ?? null,
      opening_hours: place.regularOpeningHours?.weekdayDescriptions ?? null,
      place_id: place.id ?? null,
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('get-google-places error', err);
    return new Response(JSON.stringify(EMPTY), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
