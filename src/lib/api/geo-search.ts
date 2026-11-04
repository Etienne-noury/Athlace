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

/** Rayons essayés en mode automatique, du plus serré au plus large. */
export const NEAR_RADII = [2, 5, 10, 20, 50, 100];
/** En mode automatique, on garde le premier rayon qui contient au moins ce nombre de clubs :
 *  serré en ville (Paris, Lyon…), plus large à la campagne. */
export const NEAR_MIN_CLUBS = 40;

export async function fetchClubsNear(params: {
  lat: number;
  lng: number;
  disciplines?: string[];
  sub?: string | null;
  region?: string;
  limit?: number;
  offset?: number;
  /** Rayon imposé (curseur ou pages suivantes). Sinon : rayon automatique selon la densité de clubs. */
  radiusKm?: number;
}): Promise<{ clubs: (EnrichedClub & { distanceKm: number })[]; total: number; radiusKm: number }> {
  const call = (radius: number, limit: number, offset: number) =>
    supabase.rpc('clubs_near', {
      p_lat: params.lat,
      p_lng: params.lng,
      p_radius_km: radius,
      p_disciplines: params.disciplines?.length ? params.disciplines : null,
      p_sub: params.sub ?? null,
      p_region: params.region && params.region !== 'all' ? params.region : null,
      p_limit: limit,
      p_offset: offset,
    });

  let radius = params.radiusKm;
  if (!radius) {
    // Les clubs arrivent triés par distance : la distance du Nième club donne le plus petit
    // rayon qui en contient assez (serré en ville, large à la campagne).
    const maxRadius = NEAR_RADII[NEAR_RADII.length - 1];
    const { data, error } = await call(maxRadius, NEAR_MIN_CLUBS, 0);
    if (error) {
      console.error('[clubs_near]', error.message);
      return { clubs: [], total: 0, radiusKm: maxRadius };
    }
    const rows = data ?? [];
    const nth = rows.length >= NEAR_MIN_CLUBS ? rows[NEAR_MIN_CLUBS - 1].distance_km : Infinity;
    radius = NEAR_RADII.find((r) => r >= nth) ?? maxRadius;
  }

  const { data, error } = await call(radius, params.limit ?? 100, params.offset ?? 0);
  if (error) {
    console.error('[clubs_near]', error.message);
    return { clubs: [], total: 0, radiusKm: radius };
  }
  const rows = data ?? [];
  return {
    clubs: rows.map((r) => ({ ...rowToClub(r.club as unknown as EnrichedClubRow), distanceKm: r.distance_km })),
    total: Number(rows[0]?.total ?? 0),
    radiusKm: radius,
  };
}
