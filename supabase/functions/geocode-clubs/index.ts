import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  let geocoded = 0;
  let failed = 0;

  try {
    const { data: clubs, error } = await supabase
      .from('clubs_enriched')
      .select('id, address, postal_code, city')
      .is('latitude', null)
      .not('address', 'is', null)
      .limit(50);

    if (error) throw error;

    for (const club of clubs ?? []) {
      const q = [club.address, club.postal_code, club.city]
        .filter(Boolean)
        .join(' ')
        .trim();
      if (!q) {
        failed++;
        continue;
      }
      try {
        const url = `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(q)}&limit=1`;
        const res = await fetch(url);
        const json = await res.json();
        const feat = json?.features?.[0];
        const coords = feat?.geometry?.coordinates;
        if (coords && coords.length === 2) {
          const [lng, lat] = coords;
          const { error: upErr } = await supabase
            .from('clubs_enriched')
            .update({ latitude: lat, longitude: lng })
            .eq('id', club.id);
          if (upErr) {
            failed++;
          } else {
            geocoded++;
          }
        } else {
          failed++;
        }
      } catch (_e) {
        failed++;
      }
      await new Promise((r) => setTimeout(r, 100));
    }

    return new Response(JSON.stringify({ geocoded, failed }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: (e as Error).message, geocoded, failed }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
