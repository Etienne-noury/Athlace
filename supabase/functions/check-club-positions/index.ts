// Auth: caller must be authenticated and hold the 'admin' role (see _shared/require-admin.ts).
import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { requireAdmin } from "../_shared/require-admin.ts";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

async function findMunicipality(city: string | null, postcode: string | null) {
  const q = (city ?? '').trim() || (postcode ?? '').trim();
  if (!q) return null;
  let url = `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(q)}&type=municipality&limit=1`;
  if (postcode) url += `&postcode=${encodeURIComponent(postcode)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`api-adresse ${res.status}`);
  const data = await res.json();
  const c = data?.features?.[0]?.geometry?.coordinates;
  if (!c || c.length !== 2) return null;
  return { lng: Number(c[0]), lat: Number(c[1]) };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const authError = await requireAdmin(req, corsHeaders);
  if (authError) return authError;

  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

  const { data: clubs, error } = await supabase
    .from('clubs')
    .select('id, postal_code, city, latitude, longitude')
    .not('latitude', 'is', null)
    .not('longitude', 'is', null)
    .is('position_checked_at', null)
    .limit(50);
  if (error) return json({ error: error.message, checked: 0, reset: 0, not_found: 0, remaining: 0 }, 500);

  let checked = 0, reset = 0, not_found = 0;
  const list = clubs ?? [];
  for (let i = 0; i < list.length; i++) {
    const club = list[i];
    const now = new Date().toISOString();
    try {
      const muni = await findMunicipality(club.city, club.postal_code);
      if (!muni) {
        not_found++;
        await supabase.from('clubs').update({ position_checked_at: now }).eq('id', club.id);
      } else {
        const threshold = (club.postal_code ?? '').startsWith('973') ? 120 : 30;
        const d = haversineKm(club.latitude!, club.longitude!, muni.lat, muni.lng);
        if (d > threshold) {
          reset++;
          await supabase.from('clubs')
            .update({ latitude: null, longitude: null, geocode_failed: false, position_checked_at: now })
            .eq('id', club.id);
        } else {
          await supabase.from('clubs').update({ position_checked_at: now }).eq('id', club.id);
        }
      }
      checked++;
    } catch (e) {
      console.error('check failed', club.id, (e as Error).message);
    }
    if (i < list.length - 1) await sleep(100);
  }

  const { count } = await supabase
    .from('clubs')
    .select('id', { count: 'exact', head: true })
    .not('latitude', 'is', null)
    .not('longitude', 'is', null)
    .is('position_checked_at', null);

  return json({ checked, reset, not_found, remaining: count ?? 0 });
});
