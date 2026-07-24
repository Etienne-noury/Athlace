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
  limit?: number;
  latMin?: number;
  latMax?: number;
  lngMin?: number;
  lngMax?: number;
}

export async function fetchEnrichedClubs(params: FetchEnrichedParams = {}): Promise<Club[]> {
  const { q, discipline, limit = 30, latMin, latMax, lngMin, lngMax } = params;
  // Use the public view that excludes sensitive columns (phone, email, raw).
  let query = supabase.from('clubs_enriched_public').select('*').limit(limit);

  if (discipline && discipline !== 'all') {
    query = query.eq('discipline', discipline);
  }
  if (q && q.trim()) {
    const safe = q.trim();
    query = query.or(`name.ilike.%${safe}%,city.ilike.%${safe}%,postal_code.ilike.%${safe}%`);
  }
  if (latMin !== undefined) query = query.gte('latitude', latMin);
  if (latMax !== undefined) query = query.lte('latitude', latMax);
  if (lngMin !== undefined) query = query.gte('longitude', lngMin);
  if (lngMax !== undefined) query = query.lte('longitude', lngMax);


  const { data, error } = await query;
  if (error) {
    console.error('[fetchEnrichedClubs]', error.message);
    return [];
  }
  return (data as EnrichedClubRow[]).map(rowToClub);
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
