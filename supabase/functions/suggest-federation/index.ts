import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

// Mapping activités DATA ES → sport ARBORESCENCE → sigle FF
const ACTIVITES_MAP: { pattern: RegExp; sport: string; sigle: string }[] = [
  { pattern: /football am[eé]ricain|flag/i, sport: 'Football américain', sigle: 'FFFA' },
  { pattern: /football en salle|futsal/i, sport: 'Football', sigle: 'FFF' },
  { pattern: /football|foot\b/i, sport: 'Football', sigle: 'FFF' },
  { pattern: /rugby [àa] xiii/i, sport: 'Rugby à XIII', sigle: 'FFR13' },
  { pattern: /rugby/i, sport: 'Rugby', sigle: 'FFR' },
  { pattern: /basket[-\s]?ball|basket\b/i, sport: 'Basketball', sigle: 'FFBB' },
  { pattern: /handball|mini[\s-]?hand/i, sport: 'Handball', sigle: 'FFHB' },
  { pattern: /volley[-\s]?ball|beach[\s-]?volley/i, sport: 'Volley', sigle: 'FFVB' },
  { pattern: /hockey sur glace|ringuette/i, sport: 'Hockey sur glace', sigle: 'FFHG' },
  { pattern: /hockey sur gazon|hockey en salle/i, sport: 'Hockey (sur gazon)', sigle: 'FFH' },
  { pattern: /baseball|softball/i, sport: 'Baseball, softball', sigle: 'FFBS' },
  { pattern: /pelote basque/i, sport: 'Pelote basque', sigle: 'FFPB' },
  { pattern: /padel|beach tennis|courte paume|pickleball/i, sport: 'Tennis', sigle: 'FFT' },
  { pattern: /tennis de table|ping[\s-]?pong/i, sport: 'Tennis de table', sigle: 'FFTT' },
  { pattern: /tennis(?! de table)/i, sport: 'Tennis', sigle: 'FFT' },
  { pattern: /badminton|jeu de volant/i, sport: 'Badminton', sigle: 'FFBAD' },
  { pattern: /squash|racquetball/i, sport: 'Squash', sigle: 'FFSQUASH' },
  { pattern: /natation|water[\s-]?polo|plongeon|nage synchronis/i, sport: 'Natation', sigle: 'FFN' },
  { pattern: /plonge|apn[ée]e|sous[\s-]?marin/i, sport: 'Études et sports sous-marins', sigle: 'FFESSM' },
  { pattern: /triathlon|duathlon|aquathlon/i, sport: 'Triathlon', sigle: 'FFTRI' },
  { pattern: /voile|d[ée]riveur|planche [àa] voile/i, sport: 'Voile', sigle: 'FFVOILE' },
  { pattern: /aviron/i, sport: 'Aviron', sigle: 'FFAVIRON' },
  { pattern: /cano[eë]|kayak|pagaie|raft|stand up paddle/i, sport: 'Canoë-kayak', sigle: 'FFCK' },
  { pattern: /ski nautique|wakeboard/i, sport: 'Ski nautique et wakeboard', sigle: 'FFSNW' },
  { pattern: /surf|bodyboard|bodysurf/i, sport: 'Surf', sigle: 'FFSURF' },
  { pattern: /sauvetage|secourisme/i, sport: 'Sauvetage et secourisme', sigle: 'FFSS' },
  { pattern: /judo|jujitsu|ju[\s-]?jitsu|ta[iï]so/i, sport: 'Judo-jujitsu et disciplines associées', sigle: 'FFJDA' },
  { pattern: /karat[eé]|kobudo|nihon/i, sport: 'Karaté et disciplines associées', sigle: 'FFKDA' },
  { pattern: /kick[\s-]?boxing|muay[\s-]?tha[iï]/i, sport: 'Kick boxing, muay thaï et disciplines associées', sigle: 'FFKMDA' },
  { pattern: /boxe fran[cç]aise|savate/i, sport: 'Savate, boxe française et disciplines associées', sigle: 'FFSBFDA' },
  { pattern: /boxe am[eé]ricaine|boxe anglaise/i, sport: 'Boxe américaine et disciplines associées', sigle: 'FFBABA' },
  { pattern: /boxe\b/i, sport: 'Boxe et disciplines associées', sigle: 'FFB' },
  { pattern: /taekwondo|taekwon[\s-]?do/i, sport: 'Taekwondo et disciplines associées', sigle: 'FFTDA' },
  { pattern: /a[iï]kido|a[iï]kibudo|kinomichi/i, sport: 'Aïkido, aïkibudo, kinomichi et disciplines associées', sigle: 'FFAAA' },
  { pattern: /wushu|kung[\s-]?fu|arts martiaux chinois/i, sport: 'Arts énergétiques et arts martiaux chinois', sigle: 'FAEMC' },
  { pattern: /escrime|[eé]p[eé]e|fleuret|sabre/i, sport: 'Escrime', sigle: 'FFE' },
  { pattern: /lutte|gr[eé]co[\s-]?romaine|wrestling/i, sport: 'Lutte', sigle: 'FFL' },
  { pattern: /pentathlon/i, sport: 'Pentathlon moderne', sigle: 'FFPM' },
  { pattern: /athl[eé]tisme|sprint|marathon|cross\b|lancers|sauts/i, sport: 'Athlétisme', sigle: 'FFA' },
  { pattern: /escalade|grimpe|bloc\b|SAE/i, sport: 'Montagne et escalade', sigle: 'FFME' },
  { pattern: /alpinisme|montagne/i, sport: 'Clubs alpins et de montagne', sigle: 'FFCAM' },
  { pattern: /sp[eé]l[eé]o/i, sport: 'Spéléologie', sigle: 'FFS' },
  { pattern: /[eé]quitation|cheval|cavalier|dressage|saut d.obstacle/i, sport: 'Équitation', sigle: 'FFE' },
  { pattern: /cyclisme|vtt|bmx|piste cyclable/i, sport: 'Cyclisme', sigle: 'FFC' },
  { pattern: /cyclotourisme|v[eé]lo tourisme/i, sport: 'Cyclotourisme', sigle: 'FFVELO' },
  { pattern: /danse classique|danse contemporaine|danse jazz|danse urbaine|hip[\s-]?hop|breaking/i, sport: 'Danse', sigle: 'FFDANSE' },
  { pattern: /danse\b/i, sport: 'Danse', sigle: 'FFDANSE' },
  { pattern: /gymnastique artistique|gymnastique rythmique|trampoline|tumbling|parkour/i, sport: 'Gymnastique', sigle: 'FFGYM' },
  { pattern: /gym\b/i, sport: 'Gymnastique', sigle: 'FFGYM' },
  { pattern: /halt[eé]rophilie|musculation|powerlifting|culturisme/i, sport: 'Haltérophilie, musculation', sigle: 'FFHM' },
  { pattern: /golf/i, sport: 'Golf', sigle: 'FFGOLF' },
  { pattern: /tir [àa] l.arc|arch[eé]rie/i, sport: "Tir à l'arc", sigle: 'FFTA' },
  { pattern: /ball[\s-]?trap|skeet|fosse/i, sport: 'Ball-trap', sigle: 'FFBT' },
  { pattern: /tir sportif|tir [àa] la carabine|tir au pistolet/i, sport: 'Tir', sigle: 'FFTIR' },
  { pattern: /p[eé]tanque|jeu proven[cç]al|boules/i, sport: 'Pétanque et jeu provençal', sigle: 'FFPJP' },
  { pattern: /sport boules|boule lyonnaise/i, sport: 'Sport boules', sigle: 'FFSB' },
  { pattern: /ski alpin|ski nordique|snowboard|biathlon|ski de fond/i, sport: 'Ski', sigle: 'FFS' },
  { pattern: /patinage artistique|danse sur glace|patinage de vitesse|curling|bobsleigh|luge/i, sport: 'Sports de glace', sigle: 'FFSG' },
  { pattern: /roller|skateboard|skate\b|trottinette/i, sport: 'Roller et skateboard', sigle: 'FFRS' },
  { pattern: /p[eê]che sous[\s-]?marine|apn[eé]e/i, sport: 'Pêche sportive en apnée', sigle: 'FFPSA' },
  { pattern: /p[eê]che\b/i, sport: 'Pêches sportives', sigle: 'FFPS' },
  { pattern: /billard|snooker|carambole/i, sport: 'Billard', sigle: 'FFB' },
  { pattern: /bowling|quilles/i, sport: 'Bowling et sports de quilles', sigle: 'FFBSQ' },
  { pattern: /[eé]checs/i, sport: 'Échecs', sigle: 'FFE' },
  { pattern: /twirling|b[âa]ton/i, sport: 'Twirling bâton', sigle: 'FFDTB' },
  { pattern: /handisport|fauteuil roulant|c[eé]cifoot|boccia/i, sport: 'Handisport', sigle: 'FFH' },
  { pattern: /sport adapt[eé]/i, sport: 'Sport adapté', sigle: 'FFSA' },
  { pattern: /tra[iî]neau|pulka|cani[\s-]?cross/i, sport: 'Sports de traîneau/ski-VTT joëring/canicross', sigle: 'FFST' },
  { pattern: /cynophile|agility|ob[eé]issance canine/i, sport: 'Sports et loisirs canins', sigle: 'FFSLC' },
  { pattern: /frisbee|ultimate|disc golf/i, sport: 'Flying disc', sigle: 'FFDF' },
  { pattern: /course d.orientation/i, sport: "Course d'orientation", sigle: 'FFCO' },
  { pattern: /randonn[eé]e p[eé]destre|marche nordique/i, sport: 'Randonnée pédestre', sigle: 'FFRP' },
  { pattern: /parapente|deltaplane|vol libre/i, sport: 'Vol libre', sigle: 'FFVL' },
  { pattern: /parachutisme|chute libre/i, sport: 'Parachutisme', sigle: 'FFP' },
  { pattern: /planeur|vol [àa] voile|ulm|param[oe]teur/i, sport: 'Planeur ultraléger motorisé', sigle: 'FFPLUM' },
  { pattern: /a[eé]romod[eé]lisme|drone/i, sport: 'Aéromodélisme', sigle: 'FFAM' },
  { pattern: /montgolfi[eè]re|ballon [àa] gaz/i, sport: 'Aérostation', sigle: 'FFAERO' },
  { pattern: /vol [àa] moteur|voltige a[eé]rienne|a[eé]ronautique/i, sport: 'Aéronautique', sigle: 'FFA' },
  { pattern: /motocyclisme|motocross|enduro|trial\b|motoball/i, sport: 'Motocyclisme', sigle: 'FFM' },
  { pattern: /karting|rallye|circuit/i, sport: 'Sport automobile', sigle: 'FFSA' },
  { pattern: /char [àa] voile/i, sport: 'Char à voile', sigle: 'FFCV' },
  { pattern: /joute nautique/i, sport: 'Joute et sauvetage nautique', sigle: 'FFJSN' },
  { pattern: /ballon au poing/i, sport: 'Ballon au poing', sigle: 'FFBAP' },
  { pattern: /tambourin/i, sport: 'Jeu de balle au tambourin', sigle: 'FFJBT' },
  { pattern: /force athl[eé]tique|strongman|d[eé]velopp[eé] couch[eé]/i, sport: 'Force', sigle: 'FFFORCE' },
];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: clubs, error } = await supabase
      .from('clubs_enriched')
      .select('id, address, postal_code, description, city')
      .eq('federation_code', 'RNA')
      .is('discipline', null)
      .limit(200);

    if (error) throw error;

    const rows = clubs ?? [];
    if (rows.length === 0) {
      return new Response(JSON.stringify({ updated: 0, skipped: 0, processed: 0 }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fédérations disponibles (sigle -> existe)
    const { data: feds, error: fedErr } = await supabase
      .from('federations_sportives')
      .select('id, nom, sigle');
    if (fedErr) throw fedErr;
    const fedBySigle = new Map<string, { nom: string }>();
    for (const f of feds ?? []) {
      if (f.sigle) fedBySigle.set(f.sigle.toUpperCase(), { nom: f.nom });
    }

    // Cache des activités DATA ES par code postal
    const activitesByCp = new Map<string, string>();
    const getActivites = async (cp: string | null): Promise<string> => {
      if (!cp) return '';
      const cached = activitesByCp.get(cp);
      if (cached !== undefined) return cached;
      const { data: equipements } = await supabase
        .from('equipements_sportifs')
        .select('activites, adresse')
        .eq('postal_code', cp)
        .not('activites', 'is', null)
        .limit(20);
      const joined = (equipements ?? []).map((e) => e.activites).join(' ');
      activitesByCp.set(cp, joined);
      return joined;
    };

    let updated = 0;
    let skipped = 0;

    for (const club of rows) {
      const allActivites = await getActivites(club.postal_code);

      let match = allActivites
        ? ACTIVITES_MAP.find((m) => m.pattern.test(allActivites))
        : undefined;

      if (!match && club.description) {
        match = ACTIVITES_MAP.find((m) => m.pattern.test(club.description as string));
      }

      const fed = match ? fedBySigle.get(match.sigle.toUpperCase()) : undefined;
      if (!match || !fed) {
        skipped++;
        continue;
      }

      const { error: upErr } = await supabase
        .from('clubs_enriched')
        .update({ discipline: match.sport, federation_code: match.sigle })
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
