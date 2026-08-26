// Auth: caller must be authenticated and hold the 'admin' role (see _shared/require-admin.ts).
import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { unzipSync, strFromU8 } from 'npm:fflate@0.8.2';
import { requireAdmin } from "../_shared/require-admin.ts";

const RNA_URL = 'https://www.data.gouv.fr/api/1/datasets/r/afdf9540-fdc0-4a87-9f69-8e5de6b18a51';
const SOURCE_URL = 'https://www.data.gouv.fr/fr/datasets/repertoire-national-des-associations/';

const KEYWORDS = [
  'sport', 'club', 'football', 'tennis', 'basket', 'natation', 'rugby', 'judo',
  'handball', 'volley', 'athletisme', 'cyclisme', 'golf', 'boxe', 'karate',
  'yoga', 'danse', 'equitation', 'escalade', 'petanque', 'badminton', 'gym',
  'gymnastique', 'running', 'triathlon', 'ski', 'hockey', 'padel', 'squash',
  'surf', 'kayak', 'fitness', 'musculation', 'tir', 'voile', 'aviron',
];

function normalize(s: string): string {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function matchesSport(objet: string, titre: string): boolean {
  const hay = normalize(`${objet} ${titre}`);
  return KEYWORDS.some((kw) => hay.includes(kw));
}

function parseCSVLine(line: string, sep = ';'): string[] {
  const out: string[] = [];
  let cur = '';
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQ) {
      if (c === '"') {
        if (line[i + 1] === '"') { cur += '"'; i++; } else { inQ = false; }
      } else cur += c;
    } else {
      if (c === '"') inQ = true;
      else if (c === sep) { out.push(cur); cur = ''; }
      else cur += c;
    }
  }
  out.push(cur);
  return out;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const authError = await requireAdmin(req, corsHeaders);
    if (authError) return authError;

    const url = new URL(req.url);
    const offset = parseInt(url.searchParams.get('offset') || '0', 10);
    const limit = parseInt(url.searchParams.get('limit') || '50000', 10);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    console.log(`[import-rna] downloading ZIP (offset=${offset}, limit=${limit})...`);
    const resp = await fetch(RNA_URL);
    if (!resp.ok) throw new Error(`Download failed: ${resp.status}`);
    const buf = new Uint8Array(await resp.arrayBuffer());
    console.log(`[import-rna] zip size: ${buf.length} bytes`);

    const files = unzipSync(buf);
    const csvName = Object.keys(files).find((n) => n.toLowerCase().endsWith('.csv'));
    if (!csvName) throw new Error('No CSV file in ZIP');
    const csvText = strFromU8(files[csvName]);
    console.log(`[import-rna] csv: ${csvName}, ${csvText.length} chars`);

    const lines = csvText.split(/\r?\n/);
    const header = parseCSVLine(lines[0]);
    const idx = (n: string) => header.indexOf(n);
    const iId = idx('id');
    const iTitre = idx('titre');
    const iObjet = idx('objet');
    const iNum = idx('adrs_numvoie');
    const iTyp = idx('adrs_typevoie');
    const iLib = idx('adrs_libvoie');
    const iCp = idx('adrs_codepostal');
    const iVille = idx('adrs_libcommune');
    const iWeb = idx('siteweb');

    let imported = 0;
    let skipped = 0;
    const errors: string[] = [];
    const batch: Record<string, string | number | null>[] = [];
    const end = Math.min(lines.length, offset + 1 + limit);

    const flush = async () => {
      if (!batch.length) return;
      const { error } = await supabase
        .from('clubs_enriched')
        .upsert(batch, { onConflict: 'federation_code,external_id' });
      if (error) { errors.push(error.message); } else { imported += batch.length; }
      batch.length = 0;
    };

    for (let i = Math.max(1, offset + 1); i < end; i++) {
      const line = lines[i];
      if (!line) continue;
      const cols = parseCSVLine(line);
      const objet = cols[iObjet] || '';
      const titre = cols[iTitre] || '';
      if (!matchesSport(objet, titre)) { skipped++; continue; }

      const raw: Record<string, string> = {};
      for (let h = 0; h < header.length; h++) raw[header[h]] = cols[h] || '';

      const address = [cols[iNum], cols[iTyp], cols[iLib]].filter(Boolean).join(' ').trim() || null;

      batch.push({
        federation_code: 'RNA',
        external_id: cols[iId],
        name: titre,
        discipline: null,
        address,
        postal_code: cols[iCp] || null,
        city: cols[iVille] || null,
        website: cols[iWeb] || null,
        source_url: SOURCE_URL,
      });

      if (batch.length >= 500) await flush();
    }
    await flush();

    const nextOffset = end < lines.length ? end - 1 : null;
    return new Response(
      JSON.stringify({ imported, skipped, errors, nextOffset, totalLines: lines.length - 1 }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (e) {
    console.error('[import-rna] error:', e);
    return new Response(
      JSON.stringify({ error: (e as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
