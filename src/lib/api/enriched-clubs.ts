// Clubs enrichis depuis les annuaires fédéraux (Firecrawl + DB Lovable Cloud).
// Complète l'API gouvernementale equipements-sportifs en apportant l'affiliation
// fédérale officielle et le site web public du club. Les contacts directs
// (téléphone, email) ne sont volontairement pas exposés par la vue publique
// `clubs_enriched_public` pour des raisons de confidentialité (RGPD).

import { supabase } from '@/integrations/supabase/client';
import type { Club } from '@/data/clubs';
import { disciplines } from '@/data/disciplines';

export interface EnrichedClubRow {
  id: string;
  federation_code: string;
  name: string;
  discipline: string | null;
  address: string | null;
  postal_code: string | null;
  city: string | null;
  region: string | null;
  latitude: number | null;
  longitude: number | null;
  website: string | null;
  source_url: string;
  description: string | null;
}

function rowToClub(r: EnrichedClubRow): Club {
  const d = disciplines.find((x) => x.id === r.discipline);
  return {
    id: `fed:${r.id}`,
    name: r.name,
    discipline: r.discipline ?? 'multisport',
    disciplineName: d?.name ?? r.discipline ?? 'Multisport',
    address: r.address ?? '',
    city: r.city ?? '',
    postalCode: r.postal_code ?? '',
    region: r.region ?? '',
    phone: '',
    email: '',
    level: 'loisir',
    licensePrice: { adult: 0, child: 0 },
    coordinates: { lat: r.latitude ?? 0, lng: r.longitude ?? 0 },
    rating: 0,
    reviewCount: 0,
    description: r.description || null,
    amenities: [],
  };
}

export interface FetchEnrichedParams {
  q?: string;
  discipline?: string;
  region?: string;
  department?: string;
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
  clubs: Club[];
  total: number;
}

export async function fetchEnrichedClubs(params: FetchEnrichedParams = {}): Promise<FetchEnrichedResult> {
  const {
    q,
    discipline,
    region,
    department,
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
    .from('clubs_enriched_public')
    .select('*', { count: 'exact' })
    .limit(limit);
  if (typeof offset === 'number') {
    query = query.range(offset, offset + limit - 1);
  }

  const disciplineList = (disciplines_ ?? []).filter((d) => d && d !== 'all');
  if (disciplineList.length > 0) {
    // Sport parent sélectionné : on accepte le sport ET toutes ses sous-disciplines.
    const escaped = disciplineList.map((d) => d.replace(/[,()]/g, ' '));
    query = query.or(escaped.map((d) => `discipline.ilike.${d}`).join(','));
  } else if (discipline && discipline !== 'all') {
    query = query.ilike('discipline', discipline);
  }
  if (region && region !== 'all') {
    query = query.ilike('region', `%${region}%`);
  }
  if (department && department !== 'all') {
    query = query.ilike('postal_code', `${department}%`);
  }
  if (city && city !== 'all') {
    query = query.ilike('city', `%${city}%`);
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



export async function fetchEnrichedClubById(id: string): Promise<Club | null> {
  const cleanId = id.startsWith('fed:') ? id.slice(4) : id;
  const { data, error } = await supabase
    .from('clubs_enriched_public')
    .select('*')
    .eq('id', cleanId)
    .single();
  if (error || !data) return null;
  return rowToClub(data as EnrichedClubRow);
}
