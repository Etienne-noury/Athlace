// Auth: caller must be authenticated and hold the 'admin' role (see _shared/require-admin.ts).
//
// Stratégie d'import (v2) :
// Au lieu de filtrer par mots-clés libres dans le titre/objet (imprécis, beaucoup
// de faux négatifs/positifs), on utilise la nomenclature officielle WALDEC :
//   - objet_social1 ou objet_social2 commence par "011" (famille "Sports")
//   - position == "A" (association active)
//   - date_disso == "0001-01-01" (non dissoute)
// Le code WALDEC (011XXX) est résolu vers une fédération précise (sigle +
// discipline) via `waldec-map.ts`, avec désambiguïsation par mots-clés pour
// les codes partagés par plusieurs fédérations (ex: 011010 = Aviron ou
// Canoë-kayak). Si le code est générique (011000) ou non reconnu, le club
// est importé quand même avec federation_code = 'N/A' et discipline = 'N/A'
// (jamais ignoré : tout 011XXX actif reste dans la base).
import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { unzipSync, strFromU8 } from 'npm:fflate@0.8.2';
import { requireAdmin } from "../_shared/require-admin.ts";
import { resolveWaldec, WALDEC_NON_CLUB_CODES } from "../_shared/waldec-map.ts";

const RNA_URL = 'https://www.data.gouv.fr/api/1/datasets/r/afdf9540-fdc0-4a87-9f69-8e5de6b18a51';
const SOURCE_URL = 'https://www.data.gouv.fr/fr/datasets/repertoire-national-des-associations/';
const NOT_DISSOLVED = '0001-01-01';
const NA = { sigle: 'N/A', discipline: 'N/A' };

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

/** Code WALDEC "011XXX" à partir d'objet_social1/2, ou null si association non sportive. */
function extractWaldecSport(objetSocial1: string, objetSocial2: string): string | null {
  for (const code of [objetSocial1, objetSocial2]) {
    const trimmed = (code || '').trim();
    if (trimmed.startsWith('011') && trimmed.length >= 6) return trimmed.slice(0, 6);
  }
  return null;
}

/** JJ/MM/AAAA -> AAAA-MM-JJ. Retourne la valeur telle quelle si déjà au bon format ou vide. */
function normalizeDate(raw: string): string | null {
  const v = (raw || '').trim();
  if (!v) return null;
  if (/^\d{4}-\d{2}-\d{2}/.test(v)) return v.slice(0, 10);
  const m = v.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (m) return `${m[3]}-${m[2]}-${m[1]}`;
  return v;
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
    const iObjetSocial1 = idx('objet_social1');
    const iObjetSocial2 = idx('objet_social2');
    const iPosition = idx('position');
    const iDateDisso = idx('date_disso');
    const iDateCreat = idx('date_creat');
    const iNum = idx('adrs_numvoie');
    const iTyp = idx('adrs_typevoie');
    const iLib = idx('adrs_libvoie');
    const iComplement = idx('adrs_complement');
    const iDistrib = idx('adrs_distrib');
    const iCp = idx('adrs_codepostal');
    const iVille = idx('adrs_libcommune');
    const iWeb = idx('siteweb');

    for (const [name, i] of [
      ['objet_social1', iObjetSocial1], ['position', iPosition], ['date_disso', iDateDisso],
    ] as const) {
      if (i === -1) throw new Error(`Colonne CSV attendue introuvable: ${name}`);
    }

    let imported = 0;
    let notActive = 0;
    let notSport = 0;
    let mappedPrecise = 0;
    let mappedNA = 0;
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

      if (cols[iPosition] !== 'A' || cols[iDateDisso] !== NOT_DISSOLVED) {
        notActive++;
        continue;
      }

      const waldecCode = extractWaldecSport(cols[iObjetSocial1], cols[iObjetSocial2] || '');
      if (!waldecCode || WALDEC_NON_CLUB_CODES.has(waldecCode)) {
        notSport++;
        continue;
      }

      const titre = cols[iTitre] || '';
      const objet = cols[iObjet] || '';
      const resolved = resolveWaldec(waldecCode, titre, objet) ?? NA;
      if (resolved.sigle === 'N/A') mappedNA++; else mappedPrecise++;

      const address = [cols[iNum], cols[iTyp], cols[iLib]].filter(Boolean).join(' ').trim() || null;

      batch.push({
        federation_code: resolved.sigle,
        external_id: cols[iId] || null,
        name: titre,
        description: objet || null,
        discipline: resolved.discipline,
        address,
        complement: iComplement >= 0 ? (cols[iComplement] || null) : null,
        distrib: iDistrib >= 0 ? (cols[iDistrib] || null) : null,
        postal_code: cols[iCp] || null,
        city: cols[iVille] || null,
        date_creation: iDateCreat >= 0 ? normalizeDate(cols[iDateCreat]) : null,
        website: cols[iWeb] || null,
        source_url: SOURCE_URL,
      });

      if (batch.length >= 500) await flush();
    }
    await flush();

    const nextOffset = end < lines.length ? end - 1 : null;
    return new Response(
      JSON.stringify({
        imported, notActive, notSport, mappedPrecise, mappedNA, errors, nextOffset,
        totalLines: lines.length - 1,
      }),
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
