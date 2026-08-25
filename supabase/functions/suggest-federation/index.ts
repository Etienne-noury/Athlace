import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ACTIVITES_MAP: { pattern: RegExp; sport: string; sigle: string }[] = [
  { pattern: /football en salle|futsal/i, sport: 'Football', sigle: 'FFF' },
  { pattern: /football|foot\b/i, sport: 'Football', sigle: 'FFF' },
  { pattern: /football am[eé]ricain|flag/i, sport: 'Football américain', sigle: 'FFFA' },
  { pattern: /rugby [àa] xiii/i, sport: 'Rugby à XIII', sigle: 'FFR13' },
  { pattern: /rugby/i, sport: 'Rugby', sigle: 'FFR' },
  { pattern: /basket[-\s]?ball|basket\b/i, sport: 'Basketball', sigle: 'FFBB' },
  { pattern: /handball|mini[\s-]?hand/i, sport: 'Handball', sigle: 'FFHB' },
  { pattern: /volley[-\s]?ball|beach[\s-]?volley/i, sport: 'Volley', sigle: 'FFVB' },
  { pattern: /hockey sur glace|ringuette/i, sport: 'Hockey sur glace', sigle: 'FFHG' },
  { pattern: /hockey/i, sport: 'Hockey (sur gazon)', sigle: 'FFH' },
  { pattern: /baseball|softball/i, sport: 'Baseball, softball', sigle: 'FFBS' },
  { pattern: /padel|beach tennis|pickleball/i, sport: 'Tennis', sigle: 'FFT' },
  { pattern: /tennis de table|ping[\s-]?pong/i, sport: 'Tennis de table', sigle: 'FFTT' },
  { pattern: /tennis(?! de table)/i, sport: 'Tennis', sigle: 'FFT' },
  { pattern: /badminton|jeu de volant/i, sport: 'Badminton', sigle: 'FFBAD' },
  { pattern: /squash/i, sport: 'Squash', sigle: 'FFSQUASH' },
  { pattern: /natation|water[\s-]?polo|plongeon/i, sport: 'Natation', sigle: 'FFN' },
  { pattern: /plonge|apn[ée]e|sous[\s-]?marin/i, sport: 'Études et sports sous-marins', sigle: 'FFESSM' },
  { pattern: /triathlon|duathlon|aquathlon/i, sport: 'Triathlon', sigle: 'FFTRI' },
  { pattern: /voile|d[eé]riveur|planche [àa] voile/i, sport: 'Voile', sigle: 'FFVOILE' },
  { pattern: /aviron/i, sport: 'Aviron', sigle: 'FFAVIRON' },
  { pattern: /cano[eë]|kayak|stand up paddle/i, sport: 'Canoë-kayak', sigle: 'FFCK' },
  { pattern: /ski nautique|wakeboard/i, sport: 'Ski nautique et wakeboard', sigle: 'FFSNW' },
  { pattern: /surf|bodyboard/i, sport: 'Surf', sigle: 'FFSURF' },
  { pattern: /sauvetage|secourisme/i, sport: 'Sauvetage et secourisme', sigle: 'FFSS' },
  { pattern: /judo|jujitsu|ta[iï]so/i, sport: 'Judo-jujitsu et disciplines associées', sigle: 'FFJDA' },
  { pattern: /karat[eé]|kobudo/i, sport: 'Karaté et disciplines associées', sigle: 'FFKDA' },
  { pattern: /kick[\s-]?boxing|muay[\s-]?tha[iï]/i, sport: 'Kick boxing, muay thaï et disciplines associées', sigle: 'FFKMDA' },
  { pattern: /boxe fran[cç]aise|savate/i, sport: 'Savate, boxe française et disciplines associées', sigle: 'FFSBFDA' },
  { pattern: /boxe am[eé]ricaine|boxe anglaise/i, sport: 'Boxe américaine et disciplines associées', sigle: 'FFBABA' },
  { pattern: /boxe\b/i, sport: 'Boxe et disciplines associées', sigle: 'FFB' },
  { pattern: /taekwondo/i, sport: 'Taekwondo et disciplines associées', sigle: 'FFTDA' },
  { pattern: /a[iï]kido|kinomichi/i, sport: 'Aïkido, aïkibudo, kinomichi et disciplines associées', sigle: 'FFAAA' },
  { pattern: /wushu|kung[\s-]?fu/i, sport: 'Arts énergétiques et arts martiaux chinois', sigle: 'FAEMC' },
  { pattern: /escrime|[eé]p[eé]e|fleuret/i, sport: 'Escrime', sigle: 'FFE' },
  { pattern: /lutte\b|wrestling/i, sport: 'Lutte', sigle: 'FFL' },
  { pattern: /athl[eé]tisme|sprint|marathon/i, sport: 'Athlétisme', sigle: 'FFA' },
  { pattern: /escalade|grimpe|bloc\b|SAE/i, sport: 'Montagne et escalade', sigle: 'FFME' },
  { pattern: /alpinisme/i, sport: 'Clubs alpins et de montagne', sigle: 'FFCAM' },
  { pattern: /[eé]quitation|cheval|cavalier|dressage/i, sport: 'Équitation', sigle: 'FFE' },
  { pattern: /cyclisme|vtt\b|bmx/i, sport: 'Cyclisme', sigle: 'FFC' },
  { pattern: /danse/i, sport: 'Danse', sigle: 'FFDANSE' },
  { pattern: /gymnastique|trampoline|tumbling|parkour/i, sport: 'Gymnastique', sigle: 'FFGYM' },
  { pattern: /halt[eé]rophilie|musculation|powerlifting/i, sport: 'Haltérophilie, musculation', sigle: 'FFHM' },
  { pattern: /golf/i, sport: 'Golf', sigle: 'FFGOLF' },
  { pattern: /tir [àa] l.arc/i, sport: "Tir à l'arc", sigle: 'FFTA' },
  { pattern: /ball[\s-]?trap|skeet/i, sport: 'Ball-trap', sigle: 'FFBT' },
  { pattern: /tir [àa] la carabine|tir au pistolet/i, sport: 'Tir', sigle: 'FFTIR' },
  { pattern: /p[eé]tanque|jeu proven[cç]al/i, sport: 'Pétanque et jeu provençal', sigle: 'FFPJP' },
  { pattern: /boule lyonnaise|sport boules/i, sport: 'Sport boules', sigle: 'FFSB' },
  { pattern: /ski\b/i, sport: 'Ski', sigle: 'FFS' },
  { pattern: /patinage|curling|bobsleigh|luge/i, sport: 'Sports de glace', sigle: 'FFSG' },
  { pattern: /roller|skateboard|trottinette/i, sport: 'Roller et skateboard', sigle: 'FFRS' },
  { pattern: /p[eê]che\b/i, sport: 'Pêches sportives', sigle: 'FFPS' },
  { pattern: /billard|snooker/i, sport: 'Billard', sigle: 'FFB' },
  { pattern: /bowling|quilles/i, sport: 'Bowling et sports de quilles', sigle: 'FFBSQ' },
  { pattern: /[eé]checs/i, sport: 'Échecs', sigle: 'FFE' },
  { pattern: /twirling/i, sport: 'Twirling bâton', sigle: 'FFDTB' },
  { pattern: /handisport|fauteuil roulant/i, sport: 'Handisport', sigle: 'FFH' },
  { pattern: /sport adapt[eé]/i, sport: 'Sport adapté', sigle: 'FFSA' },
  { pattern: /cani[\s-]?cross|canicross/i, sport: 'Sports de traîneau/ski-VTT joëring/canicross', sigle: 'FFST' },
  { pattern: /agility|ob[eé]issance canine/i, sport: 'Sports et loisirs canins', sigle: 'FFSLC' },
  { pattern: /frisbee|ultimate|disc golf/i, sport: 'Flying disc', sigle: 'FFDF' },
  { pattern: /course d.orientation/i, sport: "Course d'orientation", sigle: 'FFCO' },
  { pattern: /randonn[eé]e p[eé]destre|marche nordique/i, sport: 'Randonnée pédestre', sigle: 'FFRP' },
  { pattern: /parapente|deltaplane/i, sport: 'Vol libre', sigle: 'FFVL' },
  { pattern: /parachutisme|chute libre/i, sport: 'Parachutisme', sigle: 'FFP' },
  { pattern: /a[eé]romod[eé]lisme|drone/i, sport: 'Aéromodélisme', sigle: 'FFAM' },
  { pattern: /montgolfi[eè]re/i, sport: 'Aérostation', sigle: 'FFAERO' },
  { pattern: /motocross|enduro|trial\b/i, sport: 'Motocyclisme', sigle: 'FFM' },
  { pattern: /karting|rallye/i, sport: 'Sport automobile', sigle: 'FFSA' },
  { pattern: /pelote basque/i, sport: 'Pelote basque', sigle: 'FFPB' },
];

function normalize(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s]/g, ' ').trim();
}

function strictAddressMatch(addr1: string, addr2: string): boolean {
  const n1 = normalize(addr1);
  const n2 = normalize(addr2);
  // Extrait le numéro de rue et le nom de rue
  const getNumero = (s: string) => s.match(/^\d+/)?.[0] || '';
  const getRue = (s: string) => s.replace(/^\d+\s*/, '').trim();
  const num1 = getNumero(n1);
  const num2 = getNumero(n2);
  const rue1 = getRue(n1);
  const rue2 = getRue(n2);
  // Match strict : même numéro ET rue similaire (au moins 5 caractères en commun)
  if (num1 && num2 && num1 !== num2) return false;
  const words1 = rue1.split(' ').filter(w => w.length > 3);
  const words2 = rue2.split(' ').filter(w => w.length > 3);
  const commonWords = words1.filter(w => words2.includes(w));
  return commonWords.length >= 1;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  let updated = 0, skipped = 0;

  const { data: clubs } = await supabase
    .from('clubs_enriched')
    .select('id, address, postal_code, name, description')
    .eq('federation_code', 'RNA')
    .is('discipline', null)
    .limit(200);

  if (!clubs || clubs.length === 0) {
    return new Response(JSON.stringify({ updated: 0, skipped: 0 }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  for (const club of clubs) {
    if (!club.address || !club.postal_code) { skipped++; continue; }

    // Étape 1 : équipements DATA ES au même code postal
    const { data: equipements } = await supabase
      .from('equipements_sportifs')
      .select('activites, adresse, type_equipement, famille_equipement')
      .eq('postal_code', club.postal_code)
      .not('activites', 'is', null)
      .limit(50);

    if (!equipements || equipements.length === 0) { skipped++; continue; }

    // Étape 2 : match strict sur l'adresse
    const matchingEquipements = equipements.filter(e => 
      e.adresse && strictAddressMatch(club.address, e.adresse)
    );

    // Étape 3 : si match strict trouvé, utilise les activités
    const sourceEquipements = matchingEquipements.length > 0 ? matchingEquipements : [];
    
    if (sourceEquipements.length === 0) { skipped++; continue; }

    // Étape 4 : collecte les activités + type_equipement
    const activitesText = sourceEquipements
      .map(e => [e.activites, e.type_equipement, e.famille_equipement].filter(Boolean).join(' '))
      .join(' ');

    const equipementsList = sourceEquipements
      .map(e => e.type_equipement)
      .filter(Boolean)
      .filter((v, i, a) => a.indexOf(v) === i);

    // Étape 5 : double vérification avec description RNA
    const combinedText = `${activitesText} ${club.description || ''} ${club.name || ''}`;

    // Étape 6 : trouve la FF
    const match = ACTIVITES_MAP.find(m => m.pattern.test(combinedText));

    if (match) {
      await supabase
        .from('clubs_enriched')
        .update({
          discipline: match.sport,
          federation_code: match.sigle,
          equipements: equipementsList,
        })
        .eq('id', club.id);
      updated++;
    } else {
      // Pas de discipline trouvée mais on met quand même les équipements
      await supabase
        .from('clubs_enriched')
        .update({ equipements: equipementsList })
        .eq('id', club.id);
      skipped++;
    }
  }

  return new Response(JSON.stringify({ updated, skipped, total: clubs.length }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
});
