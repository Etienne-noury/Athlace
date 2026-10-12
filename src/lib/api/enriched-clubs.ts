// Clubs enrichis depuis les annuaires fédéraux (Firecrawl + DB Lovable Cloud).
// Complète l'API gouvernementale equipements-sportifs en apportant l'affiliation
// fédérale officielle et le site web public du club. Les contacts directs
// (téléphone, email) ne sont volontairement pas exposés par la vue publique
// `clubs_public` pour des raisons de confidentialité (RGPD).

import { supabase } from '@/integrations/supabase/client';
import type { Club } from '@/data/clubs';
import { ARBORESCENCE, slugifyDiscipline } from '@/data/disciplines';
import type { Tables } from '@/integrations/supabase/types';

export type ClubPublicRow = Tables<'clubs_public'>;

export interface EnrichedClubRow {
  id: string;
  federation_code: string;
  name: string;
  discipline: string | null;
  sub_disciplines: string[] | null;
  address: string | null;
  address_complement: string | null;
  postal_code: string | null;
  department_code: string | null;
  city: string | null;
  region: string | null;
  latitude: number | null;
  longitude: number | null;
  website: string | null;
  level: string | null;
  creation_date: string | null;
  source_url: string;
  description: string | null;
}

export type EnrichedClub = Club & {
  subDisciplines?: string[];
  levelLabel: string | null;
  /** Icône du sport (ARBORESCENCE) */
  icon: string;
  federationCode: string | null;
  departmentCode: string | null;
  logoUrl: string | null;
  /** Jusqu'à 3 badges réels : sous-disciplines (familles pour la Danse) puis labels */
  tags: string[];
  dateCreation?: string | null;
  /** Ligne complète de clubs_public (toutes colonnes). */
  row?: ClubPublicRow;
};

const SPORT_BY_MATCH = new Map(
  ARBORESCENCE.flatMap((c) => c.sports.flatMap((s) => s.match.map((m) => [m.toLowerCase(), s] as const))),
);

function rowToClub(r: EnrichedClubRow): EnrichedClub {
  const sport = r.discipline ? SPORT_BY_MATCH.get(r.discipline.toLowerCase()) : undefined;
  const full = r as unknown as ClubPublicRow;
  const subs = (sport?.name === 'Danse' ? full.dance_families : r.sub_disciplines) ?? [];
  const tags = Array.from(new Set([...subs, ...(full.labels ?? [])].filter(Boolean))).slice(0, 3);
  return {
    row: r as unknown as ClubPublicRow,
    subDisciplines: r.sub_disciplines ?? undefined,
    id: `fed:${r.id}`,
    name: r.name,
    discipline: sport ? slugifyDiscipline(sport.name) : r.discipline ?? 'multisport',
    disciplineName: sport?.name ?? r.discipline ?? 'Multisport',
    icon: sport?.icon ?? '🏆',
    federationCode: r.federation_code || null,
    departmentCode: r.department_code,
    logoUrl: full.logo_url ?? null,
    tags,
    address: r.address ?? '',
    city: r.city ?? '',
    postalCode: r.postal_code ?? '',
    region: r.region ?? '',
    phone: '',
    email: '',
    coordinates: { lat: r.latitude ?? 0, lng: r.longitude ?? 0 },
    description: r.description || null,
    amenities: [],
    website: r.website ?? undefined,
    levelLabel: r.level ?? null,
    dateCreation: r.creation_date,
  };
}

export interface FetchEnrichedParams {
  q?: string;
  /** Recherche géographique dédiée : ville ou code postal. */
  location?: string;
  discipline?: string;
  /** Liste de libellés de disciplines (sport + sous-disciplines) : match OU. */
  disciplines?: string[];
  /** Sous-discipline exacte : clubs.sub_disciplines (dance_families pour la Danse) doit la contenir. */
  subDiscipline?: string | null;
  region?: string;
  department?: string;
  postalPrefixes?: string[];
  city?: string;
  limit?: number;
  offset?: number;
  latMin?: number;
  latMax?: number;
  lngMin?: number;
  lngMax?: number;
  withCoordsOnly?: boolean;
}

export interface FetchEnrichedResult {
  clubs: EnrichedClub[];
  total: number;
}

export async function fetchEnrichedClubs(params: FetchEnrichedParams = {}): Promise<FetchEnrichedResult> {
  const {
    q,
    location,
    discipline,
    disciplines: disciplines_,
    subDiscipline,
    region,
    department,
    postalPrefixes,
    city,
    limit = 30,
    offset,
    latMin,
    latMax,
    lngMin,
    lngMax,
    withCoordsOnly = true,
  } = params;
  // Use the public view that excludes sensitive columns (phone, email, raw).
  let query = supabase
    .from('clubs_public')
    .select('*', { count: 'exact' })
    .limit(limit);
  if (typeof offset === 'number') {
    query = query.range(offset, offset + limit - 1);
  }

  const disciplineList = (disciplines_ ?? []).filter((d) => d && d !== 'all');
  if (disciplineList.length > 0) {
    // Sport sélectionné : clubs.discipline doit être l'une des valeurs `match` du sport.
    query = query.in('discipline', disciplineList);
  } else if (discipline && discipline !== 'all') {
    query = query.ilike('discipline', discipline);
  }
  if (subDiscipline) {
    const isDanse = disciplineList.length > 0 && disciplineList.every((d) => d === 'Danse');
    query = query.contains(isDanse ? 'dance_families' : 'sub_disciplines', [subDiscipline]);
  }
  if (region && region !== 'all') {
    query = query.ilike('region', `%${region}%`);
  }
  if (department && department !== 'all') {
    query = query.ilike('department_code', `${department}%`);
  }
  const prefixes = (postalPrefixes ?? []).filter(Boolean);
  if (prefixes.length > 0) {
    query = query.or(prefixes.map((prefix) => `postal_code.ilike.${prefix}%`).join(','));
  }
  if (city && city !== 'all') {
    query = query.ilike('city', `%${city}%`);
  }
  if (location && location.trim()) {
    const safeLocation = location.trim().replace(/[,()]/g, ' ');
    query = query.or(`city.ilike.%${safeLocation}%,postal_code.ilike.${safeLocation}%`);
  }
  if (q && q.trim()) {
    const safe = q.trim();
    query = query.or(`name.ilike.%${safe}%,city.ilike.%${safe}%,postal_code.ilike.%${safe}%`);
  }
  if (latMin !== undefined) query = query.gte('latitude', latMin);
  if (latMax !== undefined) query = query.lte('latitude', latMax);
  if (lngMin !== undefined) query = query.gte('longitude', lngMin);
  if (lngMax !== undefined) query = query.lte('longitude', lngMax);

  const { data, error, count } = await query;
  if (error) {
    console.error('[fetchEnrichedClubs]', error.message);
    return { clubs: [], total: 0 };
  }
  return {
    clubs: (data as EnrichedClubRow[]).map(rowToClub),
    total: count ?? 0,
  };
}



export async function fetchEnrichedClubById(id: string): Promise<EnrichedClub | null> {
  const cleanId = id.startsWith('fed:') ? id.slice(4) : id;
  const { data, error } = await supabase
    .from('clubs_public')
    .select('*')
    .eq('id', cleanId)
    .single();
  if (error || !data) return null;
  return rowToClub(data as EnrichedClubRow);
}
