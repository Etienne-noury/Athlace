/** Questionnaire « Mon club » : forme du brouillon (club_submissions.payload) et calculs. */

export interface VenueDraft { name: string; address: string; is_main: boolean }
export interface ScheduleDraft { day: string; start_time: string; end_time: string; category: string; level: string; venue: string }
export interface PriceDraft { label: string; amount: string; period: 'saison' | 'mois' | 'trimestre' | 'séance'; includes_license: boolean }

export interface ClubPayload {
  // Étape 1
  club_id?: string | null;
  new_club?: { name: string; discipline: string; city: string } | null;
  role?: string;
  affiliation_number?: string;
  // Étape 2
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
}

/** Champs pris en compte dans la jauge « Fiche complète ». */
export const COMPLETION_FIELDS: (keyof ClubPayload)[] = [
  'role', 'affiliation_number',
  'logo', 'color_1', 'color_2', 'photos', 'video_url', 'description', 'creation_date',
  'sub_disciplines', 'audiences', 'age_categories', 'practice_level', 'league',
  'beginners_ok', 'min_age', 'max_age', 'required_level', 'health_certificate', 'other_conditions',
  'venues', 'schedules',
  'prices', 'trial', 'registration_start', 'registration_end', 'season_start', 'waitlist', 'installments',
  'aids', 'documents', 'registration_url',
  'coaches_certified', 'labels', 'ambiance', 'amenities', 'pmr', 'events', 'volunteers',
  'email', 'phone', 'website', 'instagram_url', 'facebook_url', 'tiktok_url', 'youtube_url', 'linkedin_url',
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

export function step1Valid(p: ClubPayload): boolean {
  const clubOk = !!p.club_id || (!!p.new_club?.name.trim() && !!p.new_club.discipline && !!p.new_club.city.trim());
  return clubOk && !!p.role && !!p.affiliation_number?.trim();
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
