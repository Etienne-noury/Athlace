// Auth: caller must be authenticated and hold the 'admin' role (see _shared/require-admin.ts).
import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { requireAdmin } from "../_shared/require-admin.ts";

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const authError = await requireAdmin(req, corsHeaders);
  if (authError) return authError;

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  let geocoded = 0;
  let failed = 0;

  const { data: clubs, error } = await supabase
    .from('clubs_enriched')
    .select('id, address, postal_code, city')
    .is('latitude', null)
    .limit(50);

  if (error) {
    return new Response(JSON.stringify({ error: error.message, geocoded, failed, remaining: 0 }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  for (const club of clubs ?? []) {
    const q = [club.address, club.postal_code, club.city].filter(Boolean).join(' ').trim();
    if (!q) {
      await supabase.from('clubs_enriched').update({ latitude: 0, longitude: 0 }).eq('id', club.id);
      failed++;
      continue;
    }
    try {
      const url = `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(q)}&limit=1`;
      const res = await fetch(url);
      const json = await res.json();
      const coords = json?.features?.[0]?.geometry?.coordinates;
      if (coords && coords.length === 2) {
        const [lng, lat] = coords;
        const { error: upErr } = await supabase
          .from('clubs_enriched')
          .update({ latitude: lat, longitude: lng })
          .eq('id', club.id);
        if (upErr) failed++;
        else geocoded++;
      } else {
        await supabase.from('clubs_enriched').update({ latitude: 0, longitude: 0 }).eq('id', club.id);
        failed++;
      }
    } catch {
      await supabase.from('clubs_enriched').update({ latitude: 0, longitude: 0 }).eq('id', club.id);
      failed++;
    }
    await new Promise((r) => setTimeout(r, 100));
  }

  return new Response(
    JSON.stringify({ geocoded, failed, remaining: clubs?.length || 0 }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
});
