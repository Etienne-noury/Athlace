/** Questionnaire « Mon club » : forme du brouillon (club_submissions.payload) et calculs. */

export interface VenueDraft { name: string; address: string; is_main: boolean }
export interface ScheduleDraft { day: string; start_time: string; end_time: string; category: string; level: string; venue: string }
export interface PriceDraft { label: string; amount: string; period: 'saison' | 'mois' | 'trimestre' | 'séance'; includes_license: boolean }
export interface TeamSlot { day: string; start_time: string; end_time: string; venue: string }
export type TeamLevel = '' | 'loisir' | 'competition' | 'les_deux';
export type TeamRegistration = '' | 'ouvertes' | 'liste_attente' | 'complet';
/** Une équipe ou un groupe : sa pratique, ses lieux, ses créneaux et ses tarifs. */
export interface TeamDraft {
  id: string;
  name: string;
  sub_discipline: string;
  /** Hommes, Femmes ou Mixte. */
  gender: string;
  /** Catégories officielles du sport (U11, Minimes…) ou « Tous âges ». */
  categories: string[];
  audiences: string[];
  beginners_ok: boolean | null;
  min_age: string;
  max_age: string;
  level: TeamLevel;
  division: string;
  venues: string[];
  slots: TeamSlot[];
  prices: PriceDraft[];
  registration: TeamRegistration;
  /** Nombre d'encadrants (« 0 » à « 10+ ») et leur statut (bénévole, diplômé). */
  coaches_count: string;
  coach_types: string[];
  /** Diplômes fédéraux des encadrants diplômés (initiateur, moniteur…), quand la fédération en a. */
  coach_titles?: string[];
}
export interface SocialLink { network: string; url: string }

/**
 * Brouillon du questionnaire (5 pages : Votre club et contact, Identité et description, Équipes et groupes,
 * Spécificités du sport, Récapitulatif). Les équipes (teams) sont aussi « aplaties » dans les anciens champs
 * (schedules, prices, sub_disciplines…) par flattenTeams, que lit la validation admin côté base.
 */
export interface ClubPayload {
  // Page 1 · Votre club (+ contact, plus bas)
  club_id?: string | null;
  new_club?: { name: string; discipline: string; city: string } | null;
  // Page 5 · Récapitulatif
  role?: string;
  affiliation_number?: string;
  // Page 3 · Équipes et groupes
  teams?: TeamDraft[];
  aids_other?: string;
  documents_list?: string[];
  // Page 1 · réseaux sociaux (repliés par défaut)
  socials?: SocialLink[];
  // Page 2 · conditions spécifiques et médias
  has_specific_conditions?: boolean | null;
  specific_conditions?: string[];
  video_urls?: string[];
  // Page 4 · Spécificités du sport
  labels_list?: string[];
  equipment_provided?: string[];
  equipment_to_buy?: string[];
  prerequisite?: string;
  sport_notes?: string;
  // Page 2 · Identité et description
  logo?: string;
  color_1?: string;
  color_2?: string;
  photos?: string[];
  video_url?: string;
  description?: string;
  creation_date?: string;
  // Étape 3
  sub_disciplines?: string[];
  sub_other?: string;
  audiences?: string[];
  age_categories?: string[];
  practice_level?: string;
  league?: string;
  beginners_ok?: boolean | null;
  min_age?: string;
  max_age?: string;
  required_level?: string;
  health_certificate?: boolean | null;
  other_conditions?: string;
  // Étape 4
  venues?: VenueDraft[];
  schedules?: ScheduleDraft[];
  // Étape 5
  prices?: PriceDraft[];
  trial?: boolean | null;
  trial_sessions?: string;
  registration_start?: string;
  registration_end?: string;
  season_start?: string;
  waitlist?: boolean | null;
  installments?: boolean | null;
  aids?: string[];
  documents?: string;
  registration_url?: string;
  // Étape 6
  coaches_certified?: string;
  labels?: string;
  ambiance?: number | null;
  amenities?: string[];
  pmr?: boolean | null;
  events?: string;
  volunteers?: boolean | null;
  // Étape 7
  sport_answers?: Record<string, unknown>;
  // Étape 8
  email?: string;
  phone?: string;
  website?: string;
  instagram_url?: string;
  facebook_url?: string;
  tiktok_url?: string;
  youtube_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  /** Liens sans colonne dédiée (Strava, Autre). */
  other_links?: SocialLink[];
}

/** Champs pris en compte dans la jauge « Fiche complète ». */
export const COMPLETION_FIELDS: (keyof ClubPayload)[] = [
  'email', 'phone', 'website', 'socials',
  'logo', 'description', 'creation_date', 'venues', 'health_certificate', 'has_specific_conditions', 'amenities', 'pmr', 'photos', 'video_urls',
  'teams', 'trial', 'registration_start', 'registration_end', 'season_start', 'installments', 'aids', 'documents_list', 'registration_url',
  'labels_list', 'equipment_provided', 'equipment_to_buy', 'prerequisite',
  'role', 'affiliation_number',
];

export function isFilled(v: unknown): boolean {
  if (v === null || v === undefined) return false;
  if (typeof v === 'string') return v.trim() !== '';
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === 'object') return Object.values(v as Record<string, unknown>).some(isFilled);
  return true; // boolean, number
}

/** Pourcentage de champs remplis : champs fixes + club identifié + chaque question du sport. */
export function completionPercent(p: ClubPayload, sportQuestionKeys: string[] = []): number {
  let total = COMPLETION_FIELDS.length + 1 + sportQuestionKeys.length;
  let filled = COMPLETION_FIELDS.filter((k) => isFilled(p[k])).length;
  if (p.club_id || isFilled(p.new_club)) filled++;
  for (const k of sportQuestionKeys) if (isFilled(p.sport_answers?.[k])) filled++;
  if (total === 0) total = 1;
  return Math.round((filled / total) * 100);
}

/** Le club est identifié : à partir de là, chaque saisie est enregistrée au fil de l'eau. */
export function clubIdentified(p: ClubPayload): boolean {
  return !!p.club_id || (!!p.new_club?.name.trim() && !!p.new_club.discipline && !!p.new_club.city.trim());
}

/** @deprecated garde l'ancien nom : seule l'identification du club conditionne désormais la page 1. */
export const step1Valid = clubIdentified;

/** Champs obligatoires pour envoyer la fiche (club, contact, description, lieu, équipe avec créneau, rôle). */
export function missingRequired(p: ClubPayload): { page: number; label: string }[] {
  const out: { page: number; label: string }[] = [];
  if (!clubIdentified(p)) out.push({ page: 1, label: 'Votre club' });
  if (!isFilled(p.email) && !isFilled(p.phone)) out.push({ page: 1, label: 'Un email ou un téléphone de contact' });
  if (!isFilled(p.description)) out.push({ page: 2, label: 'La description du club' });
  if (!(p.venues ?? []).some((v) => isFilled(v.name) || isFilled(v.address))) out.push({ page: 2, label: 'Au moins un lieu de pratique' });
  const teams = p.teams ?? [];
  if (!teams.some((t) => t.slots.some((sl) => sl.day && sl.start_time))) out.push({ page: 3, label: 'Au moins une équipe ou un groupe avec un créneau' });
  if (!p.role) out.push({ page: 5, label: 'Votre rôle dans le club' });
  return out;
}

export const newTeam = (n = 1): TeamDraft => ({
  id: `t${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
  name: n > 1 ? `Groupe ${n}` : '',
  sub_discipline: '', gender: '', categories: [], audiences: [], beginners_ok: null, min_age: '', max_age: '',
  level: '', division: '', venues: [], slots: [], prices: [], registration: '', coaches_count: '', coach_types: [],
});

/** Complète une équipe d'un ancien brouillon avec les champs ajoutés depuis. */
export const normalizeTeam = (t: Partial<TeamDraft>): TeamDraft => ({ ...newTeam(), ...t, id: t.id ?? newTeam().id });

const SOCIAL_FIELDS: Record<string, keyof ClubPayload> = {
  Instagram: 'instagram_url', Facebook: 'facebook_url', TikTok: 'tiktok_url', YouTube: 'youtube_url', LinkedIn: 'linkedin_url',
  'X (Twitter)': 'twitter_url',
};

const teamLabel = (t: TeamDraft) => t.name.trim() || [t.sub_discipline, ...t.categories].filter(Boolean).join(' ') || 'Groupe';

/** Recopie les nouveaux champs (réseaux, conditions, médias, labels, pièces) dans les champs historiques. */
export function flattenPayload(p: ClubPayload): ClubPayload {
  const out: ClubPayload = { ...flattenTeams(p) };
  if (p.socials) {
    for (const f of Object.values(SOCIAL_FIELDS)) delete out[f];
    for (const sl of p.socials) {
      const f = SOCIAL_FIELDS[sl.network];
      if (f && sl.url.trim() && !out[f]) (out as Record<string, unknown>)[f] = sl.url.trim();
    }
    // Réseaux sans colonne dédiée (Strava, Autre) : gardés en liste pour la fiche publique.
    out.other_links = p.socials.filter((sl) => !SOCIAL_FIELDS[sl.network] && sl.url.trim()).map((sl) => ({ network: sl.network, url: sl.url.trim() }));
  }
  if (p.has_specific_conditions !== undefined) {
    out.other_conditions = p.has_specific_conditions ? (p.specific_conditions ?? []).map((c) => c.trim()).filter(Boolean).join(' ; ') : '';
  }
  if (p.video_urls) {
    out.video_urls = p.video_urls.map((v) => v.trim()).filter(Boolean);
    out.video_url = out.video_urls[0] ?? '';
  }
  if (p.documents_list) out.documents = p.documents_list.map((d) => d.trim()).filter(Boolean).join(' ; ');
  if (p.labels_list) out.labels = p.labels_list.join(', ');
  if (p.aids_other?.trim()) out.aids = [...(p.aids ?? []).filter((a) => a !== 'Autre'), p.aids_other.trim()];
  if (p.prerequisite) out.required_level = p.prerequisite;
  return out;
}

/** Recopie les équipes dans les champs historiques lus par la validation admin (créneaux, tarifs, pratique). */
export function flattenTeams(p: ClubPayload): ClubPayload {
  const teams = p.teams;
  if (!teams) return p;
  const ages = (k: 'min_age' | 'max_age') => teams.map((t) => Number(t[k])).filter((n) => Number.isFinite(n) && n > 0);
  const mins = ages('min_age');
  const maxs = ages('max_age');
  const coaches = teams.reduce((a, t) => a + (t.coach_types?.includes('Diplômé') ? parseInt(t.coaches_count, 10) || 0 : 0), 0);
  const uniq = (xs: string[]) => [...new Set(xs.map((x) => x.trim()).filter(Boolean))];
  const levels = uniq(teams.map((t) => t.level));
  return {
    ...p,
    schedules: teams.flatMap((t) => t.slots.map((sl) => ({
      day: sl.day, start_time: sl.start_time, end_time: sl.end_time,
      category: [t.name.trim(), t.gender, ...t.categories].filter(Boolean).join(' · '),
      level: t.level === 'competition' ? (t.division.trim() || 'Compétition') : t.level === 'loisir' ? 'Loisir' : t.division.trim(),
      venue: sl.venue || t.venues[0] || '',
    }))),
    prices: teams.flatMap((t) => t.prices.map((x) => ({ ...x, label: [teamLabel(t), x.label.trim()].filter(Boolean).join(' · ') }))),
    sub_disciplines: uniq([...(p.sub_disciplines ?? []), ...teams.map((t) => t.sub_discipline)]),
    age_categories: uniq(teams.flatMap((t) => t.categories)),
    audiences: uniq([...teams.flatMap((t) => t.audiences ?? []), ...teams.map((t) => (t.gender === 'Femmes' ? 'Féminines' : ''))]),
    beginners_ok: teams.some((t) => t.beginners_ok === true) ? true : teams.some((t) => t.beginners_ok === false) ? false : p.beginners_ok,
    min_age: mins.length ? String(Math.min(...mins)) : p.min_age,
    max_age: maxs.length ? String(Math.max(...maxs)) : p.max_age,
    coaches_certified: coaches ? String(coaches) : p.coaches_certified,
    practice_level: levels.length === 0 ? p.practice_level : levels.length === 1 ? levels[0] : 'les_deux',
    league: uniq(teams.map((t) => t.division)).join(', ') || p.league,
    waitlist: teams.some((t) => t.registration === 'liste_attente') ? true : teams.length ? false : p.waitlist,
  };
}

/** Construit une première équipe à partir des données fédération (créneaux, tarifs, sous-disciplines). */
export function teamsFromPrefill(p: ClubPayload): TeamDraft[] {
  if (p.teams?.length) return p.teams.map(normalizeTeam);
  const hasData = isFilled(p.schedules) || isFilled(p.prices) || isFilled(p.age_categories) || isFilled(p.league);
  if (!hasData) return [];
  const t = newTeam();
  t.categories = p.age_categories ?? [];
  t.division = p.league ?? '';
  t.level = (p.practice_level as TeamLevel) ?? '';
  t.slots = (p.schedules ?? []).map((sl) => ({ day: sl.day, start_time: sl.start_time, end_time: sl.end_time, venue: sl.venue }));
  t.venues = [...new Set(t.slots.map((sl) => sl.venue).filter(Boolean))];
  t.prices = p.prices ?? [];
  if ((p.sub_disciplines ?? []).length === 1) t.sub_discipline = p.sub_disciplines![0];
  t.audiences = p.audiences ?? [];
  t.min_age = p.min_age ?? '';
  t.max_age = p.max_age ?? '';
  return [t];
}

/** Convertit les anciens champs du brouillon (réseaux, vidéo, labels, pièces) vers la nouvelle forme. */
export function upgradePayload(p: ClubPayload): ClubPayload {
  const out: ClubPayload = { ...p, teams: teamsFromPrefill(p) };
  if (!out.socials) {
    out.socials = Object.entries(SOCIAL_FIELDS)
      .filter(([, f]) => typeof p[f] === 'string' && (p[f] as string).trim())
      .map(([network, f]) => ({ network, url: (p[f] as string).trim() }))
      .concat((p.other_links ?? []).filter((l) => l.url));
  }
  if (!out.video_urls && p.video_url) out.video_urls = [p.video_url];
  if (!out.labels_list && p.labels) out.labels_list = p.labels.split(',').map((x) => x.trim()).filter(Boolean);
  if (!out.documents_list && p.documents) out.documents_list = p.documents.split(/\n|;/).map((x) => x.trim()).filter(Boolean);
  if (out.has_specific_conditions === undefined && p.other_conditions) {
    out.has_specific_conditions = true;
    out.specific_conditions = p.other_conditions.split(/\n|;/).map((x) => x.trim()).filter(Boolean);
  }
  if (!out.prerequisite && p.required_level) out.prerequisite = p.required_level;
  return out;
}

type Row = Record<string, unknown>;
const s = (v: unknown) => (v === null || v === undefined ? undefined : String(v));
const arr = (v: unknown) => (Array.isArray(v) && v.length ? (v as string[]) : undefined);

/** Valeurs actuelles du club (données fédération) au format du brouillon. */
export function prefillFromClub(
  club: Row,
  contact: { email?: string | null; phone?: string | null } | null,
  venues: Row[],
  schedules: Row[],
  prices: Row[],
): ClubPayload {
  const colors = (s(club.colors) ?? '').split(/[,;\s]+/).filter((c) => /^#[0-9a-f]{6}$/i.test(c));
  const isDanse = club.discipline === 'Danse';
  const out: ClubPayload = {
    affiliation_number: s(club.affiliation_number),
    logo: s(club.logo_url),
    color_1: colors[0],
    color_2: colors[1],
    photos: arr(club.photo_urls)?.slice(0, 6),
    video_url: s(club.video_url),
    description: s(club.description)?.slice(0, 500),
    creation_date: s(club.creation_date)?.slice(0, 10),
    sub_disciplines: arr(isDanse ? club.dance_families : club.sub_disciplines),
    audiences: arr(club.audiences),
    age_categories: arr(club.age_categories),
    league: s(club.league),
    min_age: s(club.min_age),
    labels: arr(club.labels)?.join(', '),
    amenities: arr(club.amenities),
    registration_url: s(club.registration_url) ?? s(club.helloasso_url),
    email: contact?.email ?? undefined,
    phone: contact?.phone ?? undefined,
    website: s(club.website),
    instagram_url: s(club.instagram_url),
    facebook_url: s(club.facebook_url),
    tiktok_url: s(club.tiktok_url),
    youtube_url: s(club.youtube_url),
    linkedin_url: s(club.linkedin_url),
    twitter_url: s(club.twitter_url),
    // Champs remplis par un questionnaire déjà validé : on les retrouve pour la mise à jour suivante.
    teams: Array.isArray(club.teams) ? (club.teams as Partial<TeamDraft>[]).map(normalizeTeam) : undefined,
    equipment_provided: arr(club.equipment_provided),
    equipment_to_buy: arr(club.equipment_to_buy),
    sport_notes: s(club.sport_notes),
    video_urls: arr(club.video_urls),
    required_level: s(club.required_level),
  };
  if (venues.length) {
    out.venues = venues.map((v) => ({
      name: s(v.name) ?? '',
      address: [s(v.address), s(v.postal_code), s(v.city)].filter(Boolean).join(' '),
      is_main: !!v.is_main,
    }));
  }
  if (schedules.length) {
    out.schedules = schedules.map((x) => ({
      day: s(x.day) ?? '',
      start_time: (s(x.start_time) ?? '').slice(0, 5),
      end_time: (s(x.end_time) ?? '').slice(0, 5),
      category: s(x.category) ?? '',
      level: s(x.level) ?? '',
      venue: s(x.venue_name) ?? '',
    }));
  }
  if (prices.length) {
    out.prices = prices.map((x) => ({
      label: s(x.label) ?? '',
      amount: s(x.amount) ?? '',
      period: (s(x.period) as PriceDraft['period']) ?? 'saison',
      includes_license: x.includes_license !== false,
    }));
  }
  for (const k of Object.keys(out) as (keyof ClubPayload)[]) if (!isFilled(out[k])) delete out[k];
  return out;
}
