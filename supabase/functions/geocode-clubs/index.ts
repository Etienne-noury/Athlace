// Auth: caller must be authenticated and hold the 'admin' role (see _shared/require-admin.ts).
import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { requireAdmin } from "../_shared/require-admin.ts";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function searchAddress(q: string, postcode?: string | null) {
  let url = `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(q)}&limit=1`;
  if (postcode) url += `&postcode=${encodeURIComponent(postcode)}`;
  const res = await fetch(url);
  const json = await res.json();
  const feature = json?.features?.[0];
  if (!feature) return null;
  const coords = feature.geometry?.coordinates;
  if (!coords || coords.length !== 2) return null;
  return { lng: coords[0], lat: coords[1], score: feature.properties?.score ?? 0 };
}

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
    .from('clubs')
    .select('id, address, postal_code, city')
    .is('latitude', null)
    .eq('geocode_failed', false)
    .limit(50);

  if (error) {
    return new Response(JSON.stringify({ error: error.message, geocoded, failed, remaining: 0 }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  for (const club of clubs ?? []) {
    try {
      let coords: { lat: number; lng: number } | null = null;

      // Essai 1 : adresse complète
      const q1 = [club.address, club.postal_code, club.city].filter(Boolean).join(' ').trim();
      if (q1) {
        const hit = await searchAddress(q1, club.postal_code);
        if (hit && hit.score >= 0.5) coords = { lat: hit.lat, lng: hit.lng };
        await sleep(100);
      }

      // Essai 2 : centre de la commune
      if (!coords) {
        const q2 = [club.postal_code, club.city].filter(Boolean).join(' ').trim();
        if (q2) {
          const hit = await searchAddress(q2, club.postal_code);
          if (hit) coords = { lat: hit.lat, lng: hit.lng };
          await sleep(100);
        }
      }

      if (coords) {
        const { error: upErr } = await supabase
          .from('clubs')
          .update({ latitude: coords.lat, longitude: coords.lng })
          .eq('id', club.id);
        if (upErr) failed++;
        else geocoded++;
      } else {
        const { error: upErr } = await supabase
          .from('clubs')
          .update({ geocode_failed: true })
          .eq('id', club.id);
        if (upErr) console.error('update failed for', club.id, upErr.message);
        failed++;
      }
    } catch {
      await supabase.from('clubs').update({ geocode_failed: true }).eq('id', club.id);
      failed++;
    }
  }

  const { count } = await supabase
    .from('clubs')
    .select('id', { count: 'exact', head: true })
    .is('latitude', null)
    .eq('geocode_failed', false);

  return new Response(
    JSON.stringify({ geocoded, failed, remaining: count ?? 0 }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
});
