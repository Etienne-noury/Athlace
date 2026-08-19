import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const MAPPING: { keywords: string[]; sigle: string }[] = [
  { keywords: ['football américain', 'american football'], sigle: 'FFFA' },
  { keywords: ['rugby à xiii', 'rugby xiii'], sigle: 'FFR13' },
  { keywords: ['football', 'foot', 'futsal', 'soccer'], sigle: 'FFF' },
  { keywords: ['rugby', 'ovalie'], sigle: 'FFR' },
  { keywords: ['basketball', 'basket', 'basket-ball'], sigle: 'FFBB' },
  { keywords: ['handball', 'hand-ball'], sigle: 'FFHB' },
  { keywords: ['volley', 'volleyball', 'volley-ball'], sigle: 'FFVB' },
  { keywords: ['hockey sur glace', 'patinage hockey'], sigle: 'FFHG' },
  { keywords: ['hockey'], sigle: 'FFH' },
  { keywords: ['baseball', 'softball'], sigle: 'FFBS' },
  { keywords: ['pelote basque'], sigle: 'FFPB' },
  { keywords: ['tennis de table', 'ping-pong', 'ping pong'], sigle: 'FFTT' },
  { keywords: ['badminton'], sigle: 'FFBAD' },
  { keywords: ['squash'], sigle: 'FFSQUASH' },
  { keywords: ['padel'], sigle: 'FFT' },
  { keywords: ['tennis'], sigle: 'FFT' },
  { keywords: ['natation', 'nage', 'water-polo', 'water polo', 'plongeon'], sigle: 'FFN' },
  { keywords: ['plongée', 'sous-marin', 'apnée'], sigle: 'FFESSM' },
  { keywords: ['triathlon'], sigle: 'FFTRI' },
  { keywords: ['voile', 'voilier', 'régate'], sigle: 'FFVOILE' },
  { keywords: ['aviron'], sigle: 'FFAVIRON' },
  { keywords: ['canoë', 'kayak', 'pagaie', 'raft'], sigle: 'FFCK' },
  { keywords: ['ski nautique', 'wakeboard'], sigle: 'FFSNW' },
  { keywords: ['surf', 'bodyboard'], sigle: 'FFSURF' },
  { keywords: ['sauvetage', 'secourisme'], sigle: 'FFSS' },
  { keywords: ['judo', 'jujitsu', 'ju-jitsu'], sigle: 'FFJDA' },
  { keywords: ['karaté', 'karate', 'kobudo'], sigle: 'FFKDA' },
  { keywords: ['kick boxing', 'muay thai', 'muay thaï', 'kickboxing'], sigle: 'FFKMDA' },
  { keywords: ['boxe française', 'savate'], sigle: 'FFSBFDA' },
  { keywords: ['boxe américaine', 'boxe anglaise'], sigle: 'FFBABA' },
  { keywords: ['boxe'], sigle: 'FFB' },
  { keywords: ['taekwondo', 'taekwon-do'], sigle: 'FFTDA' },
  { keywords: ['aïkido', 'aikido', 'aïkibudo', 'kinomichi'], sigle: 'FFAAA' },
  { keywords: ['wushu', 'kung-fu', 'kung fu', 'arts martiaux chinois'], sigle: 'FAEMC' },
  { keywords: ['escrime', 'épée', 'fleuret', 'sabre'], sigle: 'FFE' },
  { keywords: ['lutte', 'gréco-romaine', 'wrestling'], sigle: 'FFL' },
  { keywords: ['pentathlon'], sigle: 'FFPM' },
  { keywords: ['athlétisme', 'athletisme', 'course à pied', 'sprint', 'marathon', 'cross'], sigle: 'FFA' },
  { keywords: ['escalade', 'grimpe', 'bloc'], sigle: 'FFME' },
  { keywords: ['montagne', 'alpinisme'], sigle: 'FFCAM' },
  { keywords: ['spéléologie', 'speleo'], sigle: 'FFS' },
  { keywords: ['équitation', 'equitation', 'cheval', 'cavalier', 'dressage'], sigle: 'FFE' },
  { keywords: ['cyclisme', 'vélo', 'velo', 'vtt'], sigle: 'FFC' },
  { keywords: ['cyclotourisme'], sigle: 'FFVELO' },
  { keywords: ['danse', 'dancing', 'chorégraphie'], sigle: 'FFDANSE' },
  { keywords: ['gymnastique', 'gym', 'trampoline', 'acrobatie'], sigle: 'FFGYM' },
  { keywords: ['haltérophilie', 'halterophilie', 'musculation', 'powerlifting'], sigle: 'FFHM' },
  { keywords: ['golf'], sigle: 'FFGOLF' },
  { keywords: ["tir à l'arc", 'archerie'], sigle: 'FFTA' },
  { keywords: ['ball-trap', 'ball trap', 'tir sportif'], sigle: 'FFTIR' },
  { keywords: ['pétanque', 'petanque', 'jeu provençal', 'boules'], sigle: 'FFPJP' },
  { keywords: ['sport boules', 'boule lyonnaise'], sigle: 'FFSB' },
  { keywords: ['ski', 'snowboard', 'biathlon', 'luge'], sigle: 'FFS' },
  { keywords: ['patinage', 'glace', 'curling'], sigle: 'FFSG' },
  { keywords: ['parachutisme', 'parachute', 'chute libre'], sigle: 'FFP' },
  { keywords: ['parapente', 'deltaplane', 'vol libre'], sigle: 'FFVL' },
  { keywords: ['planeur', 'vol à voile'], sigle: 'FFPLUM' },
  { keywords: ['aéromodélisme', 'drone'], sigle: 'FFAM' },
  { keywords: ['montgolfière', 'ballon', 'aérostation'], sigle: 'FFAERO' },
  { keywords: ['motocyclisme', 'moto', 'enduro', 'trial'], sigle: 'FFM' },
  { keywords: ['randonnée', 'marche nordique', 'trekking'], sigle: 'FFRP' },
  { keywords: ['roller', 'skateboard', 'skate'], sigle: 'FFRS' },
  { keywords: ['pêche'], sigle: 'FFPS' },
  { keywords: ['billard', 'snooker'], sigle: 'FFB' },
  { keywords: ['bowling', 'quilles'], sigle: 'FFBSQ' },
  { keywords: ['échecs', 'echecs'], sigle: 'FFE' },
  { keywords: ['twirling', 'bâton'], sigle: 'FFDTB' },
  { keywords: ['handisport'], sigle: 'FFH' },
  { keywords: ['sport adapté'], sigle: 'FFSA' },
  { keywords: ['traîneau', 'pulka', 'chiens de traîneau'], sigle: 'FFPULKA' },
  { keywords: ['canin', 'cynophile', 'chien'], sigle: 'FFSLC' },
  { keywords: ['frisbee', 'ultimate', 'flying disc'], sigle: 'FFDF' },
  { keywords: ["course d'orientation", 'orientation'], sigle: 'FFCO' },
  { keywords: ['automobile', 'karting', 'rallye'], sigle: 'FFSA' },
  { keywords: ['char à voile'], sigle: 'FFCV' },
  { keywords: ['joute nautique'], sigle: 'FFJSN' },
  { keywords: ['ballon au poing'], sigle: 'FFBAP' },
  { keywords: ['tambourin'], sigle: 'FFJBT' },
];

function matches(text: string, keyword: string): boolean {
  const normalized = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const kw = keyword.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const regex = new RegExp(`(^|[^a-z])${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-z]|$)`);
  return regex.test(normalized);
}

function matchSigle(description: string | null): string | null {
  if (!description) return null;
  for (const m of MAPPING) {
    if (m.keywords.some((k) => matches(description, k))) return m.sigle;
  }
  return null;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    let offset = 0;
    try {
      const body = await req.json();
      if (typeof body?.offset === 'number') offset = body.offset;
    } catch (_) { /* no body */ }

    const { data: clubs, error } = await supabase
      .from('clubs_enriched')
      .select('id, description')
      .is('discipline', null)
      .order('id')
      .range(offset, offset + 499);

    if (error) throw error;

    const rows = clubs ?? [];
    if (rows.length === 0) {
      return new Response(JSON.stringify({ updated: 0, skipped: 0, processed: 0 }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: feds, error: fedErr } = await supabase
      .from('federations_sportives')
      .select('id, nom, sigle');
    if (fedErr) throw fedErr;

    const fedBySigle = new Map<string, { nom: string }>();
    for (const f of feds ?? []) {
      if (f.sigle) fedBySigle.set(f.sigle.toUpperCase(), { nom: f.nom });
    }

    let updated = 0;
    let skipped = 0;

    for (const club of rows) {
      const sigle = matchSigle(club.description);
      const fed = sigle ? fedBySigle.get(sigle.toUpperCase()) : undefined;
      if (!sigle || !fed) {
        skipped++;
        continue;
      }
      const { error: upErr } = await supabase
        .from('clubs_enriched')
        .update({ discipline: fed.nom, federation_code: sigle })
        .eq('id', club.id);
      if (upErr) {
        console.error('update failed', club.id, upErr.message);
        skipped++;
      } else {
        updated++;
      }
    }

    return new Response(
      JSON.stringify({ updated, skipped, processed: rows.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (e) {
    console.error('[suggest-federation]', e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
