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

  const { data: clubs, error } = await supabase
    .from('clubs_enriched')
    .select('id, address, postal_code, city')
    .is('latitude', null)
    .limit(200);

  if (error) {
    return new Response(JSON.stringify({ error: error.message, geocoded: 0, failed: 0, remaining: 0 }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const results = await Promise.all(
    (clubs ?? []).map(async (club) => {
      const q = [club.address, club.postal_code, club.city].filter(Boolean).join(' ').trim();
      if (!q) {
        await supabase.from('clubs_enriched').update({ latitude: 0, longitude: 0 }).eq('id', club.id);
        return 'failed';
      }
      try {
        const res = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(q)}&limit=1`);
        const json = await res.json();
        const feature = json.features?.[0];
        if (feature) {
          const [lng, lat] = feature.geometry.coordinates;
          await supabase.from('clubs_enriched').update({ latitude: lat, longitude: lng }).eq('id', club.id);
          return 'ok';
        } else {
          await supabase.from('clubs_enriched').update({ latitude: 0, longitude: 0 }).eq('id', club.id);
          return 'failed';
        }
      } catch {
        await supabase.from('clubs_enriched').update({ latitude: 0, longitude: 0 }).eq('id', club.id);
        return 'failed';
      }
    })
  );

  const geocoded = results.filter((r) => r === 'ok').length;
  const failed = results.filter((r) => r === 'failed').length;

  return new Response(
    JSON.stringify({ geocoded, failed, remaining: clubs?.length || 0 }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
});
