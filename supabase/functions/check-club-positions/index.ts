// Auth: caller must be authenticated and hold the 'admin' role (see _shared/require-admin.ts).
import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { requireAdmin } from "../_shared/require-admin.ts";

const BATCH = 500;
const ID_CHUNK = 200;

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

const csvCell = (v: unknown) => {
  const s = v === null || v === undefined ? '' : String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cur = '';
  let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') {
        if (text[i + 1] === '"') { cur += '"'; i++; } else q = false;
      } else cur += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(cur); cur = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(cur); cur = '';
      if (row.length > 1 || row[0] !== '') rows.push(row);
      row = [];
    } else cur += c;
  }
  if (cur !== '' || row.length) { row.push(cur); rows.push(row); }
  return rows;
}

const chunks = <T,>(arr: T[], n: number) => {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
};

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
    .limit(BATCH);
  if (error) return json({ error: error.message, checked: 0, reset: 0, not_found: 0, remaining: 0 }, 500);

  const list = clubs ?? [];
  let reset = 0, not_found = 0;

  if (list.length > 0) {
    // 1 seul appel batch à l'API Adresse
    // L'API attend pour type= le nom d'une colonne du CSV (filtre par ligne)
    const csv = ['id,city,postal_code,type',
      ...list.map((c) => [c.id, c.city, c.postal_code, 'municipality'].map(csvCell).join(','))].join('\n');
    const form = new FormData();
    form.append('data', new Blob([csv], { type: 'text/csv' }), 'clubs.csv');
    form.append('columns', 'city');
    form.append('postcode', 'postal_code');
    form.append('type', 'type');

    const res = await fetch('https://api-adresse.data.gouv.fr/search/csv/', { method: 'POST', body: form });
    if (!res.ok) {
      const body = await res.text();
      console.error(`api-adresse csv [${res.status}]: ${body}`);
      return json({ error: `API Adresse ${res.status}: ${body.slice(0, 300)}`, checked: 0, reset: 0, not_found: 0, remaining: 0 }, 502);
    }
    const rows = parseCsv(await res.text());
    const header = rows.shift() ?? [];
    const iId = header.indexOf('id');
    const col = (a: string, b: string) => (header.indexOf(a) >= 0 ? header.indexOf(a) : header.indexOf(b));
    const iLat = col('result_latitude', 'latitude');
    const iLng = col('result_longitude', 'longitude');
    const muni = new Map<string, { lat: number; lng: number }>();
    for (const r of rows) {
      const lat = parseFloat(r[iLat]);
      const lng = parseFloat(r[iLng]);
      if (r[iId] && Number.isFinite(lat) && Number.isFinite(lng)) muni.set(r[iId], { lat, lng });
    }

    const resetIds: string[] = [];
    const keepIds: string[] = [];
    for (const club of list) {
      const m = muni.get(club.id);
      if (!m) { not_found++; keepIds.push(club.id); continue; }
      const threshold = (club.postal_code ?? '').startsWith('973') ? 120 : 30;
      const d = haversineKm(club.latitude!, club.longitude!, m.lat, m.lng);
      if (d > threshold) resetIds.push(club.id); else keepIds.push(club.id);
    }
    reset = resetIds.length;

    // Mises à jour par lots
    const now = new Date().toISOString();
    for (const ids of chunks(resetIds, ID_CHUNK)) {
      const { error: e } = await supabase.from('clubs')
        .update({ latitude: null, longitude: null, geocode_failed: false, position_checked_at: now })
        .in('id', ids);
      if (e) return json({ error: e.message, checked: 0, reset: 0, not_found: 0, remaining: 0 }, 500);
    }
    for (const ids of chunks(keepIds, ID_CHUNK)) {
      const { error: e } = await supabase.from('clubs')
        .update({ position_checked_at: now })
        .in('id', ids);
      if (e) return json({ error: e.message, checked: 0, reset: 0, not_found: 0, remaining: 0 }, 500);
    }
  }

  const { count } = await supabase
    .from('clubs')
    .select('id', { count: 'exact', head: true })
    .not('latitude', 'is', null)
    .not('longitude', 'is', null)
    .is('position_checked_at', null);

  return json({ checked: list.length, reset, not_found, remaining: count ?? 0 });
});
