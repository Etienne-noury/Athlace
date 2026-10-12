import { supabase } from '@/integrations/supabase/client';
import { rowToClub, type EnrichedClub, type EnrichedClubRow } from '@/lib/api/enriched-clubs';

export interface CityHit {
  name: string;
  postcode: string;
  context: string;
  lat: number;
  lng: number;
}

const API = 'https://api-adresse.data.gouv.fr/search/';

export const normalizeText = (s: string) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[-'’]/g, ' ').replace(/\s+/g, ' ').trim();

/** Suggestions de communes (autocomplétion). */
export async function suggestCities(q: string, limit = 5): Promise<CityHit[]> {
  const query = q.trim();
  if (query.length < 2) return [];
  try {
    const res = await fetch(`${API}?q=${encodeURIComponent(query)}&type=municipality&autocomplete=1&limit=${limit}`);
    if (!res.ok) return [];
    const json = await res.json();
    return (json.features ?? []).map((f: { geometry: { coordinates: [number, number] }; properties: Record<string, string> }) => ({
      name: f.properties.name,
      postcode: f.properties.postcode,
      context: f.properties.context,
      lng: f.geometry.coordinates[0],
      lat: f.geometry.coordinates[1],
    }));
  } catch {
    return [];
  }
}

/** Résout une saisie en commune seulement si elle correspond exactement (nom ou code postal). */
export async function resolveCity(q: string): Promise<CityHit | null> {
  const query = q.trim();
  if (query.length < 2) return null;
  const hits = await suggestCities(query, 5);
  const nq = normalizeText(query);
  return (
    hits.find((h) => normalizeText(h.name) === nq || h.postcode === query) ?? null
  );
}

export const NEAR_RADII = [20, 50, 100];

export async function fetchClubsNear(params: {
  lat: number;
  lng: number;
  disciplines?: string[];
  sub?: string | null;
  region?: string;
  limit?: number;
  offset?: number;
  /** Rayon imposé (pages suivantes). */
  radiusKm?: number;
}): Promise<{ clubs: (EnrichedClub & { distanceKm: number })[]; total: number; radiusKm: number }> {
  // Élargit le rayon jusqu'à trouver au moins un club.
  const radii = params.radiusKm ? [params.radiusKm] : NEAR_RADII;
  for (const radius of radii) {
    const { data, error } = await supabase.rpc('clubs_near', {
      p_lat: params.lat,
      p_lng: params.lng,
      p_radius_km: radius,
      p_disciplines: params.disciplines?.length ? params.disciplines : null,
      p_sub: params.sub ?? null,
      p_region: params.region && params.region !== 'all' ? params.region : null,
      p_limit: params.limit ?? 100,
      p_offset: params.offset ?? 0,
    });
    if (error) {
      console.error('[clubs_near]', error.message);
      return { clubs: [], total: 0, radiusKm: radius };
    }
    const rows = data ?? [];
    if (rows.length > 0 || radius === radii[radii.length - 1]) {
      return {
        clubs: rows.map((r) => ({ ...rowToClub(r.club as unknown as EnrichedClubRow), distanceKm: r.distance_km })),
        total: Number(rows[0]?.total ?? 0),
        radiusKm: radius,
      };
    }
  }
  return { clubs: [], total: 0, radiusKm: NEAR_RADII[NEAR_RADII.length - 1] };
}
