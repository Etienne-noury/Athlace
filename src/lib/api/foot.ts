// API combinant les 3 sources pour les clubs de football.
// Source 1 : data.sports.gouv.fr (public, sans clé)
// Source 2 : table Supabase clubs_foot (enrichissement)
// Source 3 : edge function get-google-places (à la demande)

import { supabase } from '@/integrations/supabase/client';

export interface FootClubRaw {
  /** data.sports.gouv.fr equipment ID */
  data_es_id: string;
  nom: string;
  adresse: string;
  code_postal: string;
  ville: string;
  lat: number | null;
  lng: number | null;
}

export interface FootClubEnrichment {
  niveau_ligue?: string | null;
  prix_adulte?: number | null;
  prix_enfant?: number | null;
  site_web?: string | null;
  telephone?: string | null;
  horaires?: unknown;
  google_rating?: number | null;
  google_nb_avis?: number | null;
}

export interface FootClub extends FootClubRaw, FootClubEnrichment {}

export interface GooglePlaces {
  rating: number | null;
  user_ratings_total: number | null;
  formatted_phone_number: string | null;
  website: string | null;
  opening_hours: string[] | null;
  place_id: string | null;
}

const SPORTS_GOUV_URL =
  'https://data.sports.gouv.fr/api/explore/v2.1/catalog/datasets/equipements-sportifs/records';

/** Source 1 : data.sports.gouv.fr — recherche par ville OU code postal. */
export async function fetchFootClubsByLocation(query: string): Promise<FootClubRaw[]> {
  const q = query.trim();
  if (!q) return [];

  const isPostalCode = /^\d{4,5}$/.test(q);
  const escaped = q.replace(/"/g, '');
  const locationClause = isPostalCode
    ? `inst_cp="${escaped}"`
    : `new_name="${escaped}"`;
  const where = `aps_name="Football" AND ${locationClause}`;

  const url = `${SPORTS_GOUV_URL}?where=${encodeURIComponent(where)}&limit=50`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`data.sports.gouv.fr ${res.status}`);
  const json = await res.json();
  const records = (json?.results ?? []) as Record<string, unknown>[];

  // Dédoublonne par equip_numero
  const seen = new Set<string>();
  const clubs: FootClubRaw[] = [];
  const str = (v: unknown, fallback = ''): string => (typeof v === 'string' && v ? v : fallback);
  const num = (v: unknown): number | null => (typeof v === 'number' ? v : null);
  for (const r of records) {
    const coords = (r.equip_coordonnees ?? r.coordonnees) as { lat?: unknown; lon?: unknown } | undefined;
    const id = str(r.equip_numero) || str(r.inst_numero);
    if (!id || seen.has(id)) continue;
    seen.add(id);
    clubs.push({
      data_es_id: id,
      nom: str(r.inst_nom) || str(r.equip_nom) || 'Club de football',
      adresse: str(r.inst_adresse),
      code_postal: str(r.inst_cp),
      ville: str(r.new_name),
      lat: num(coords?.lat),
      lng: num(coords?.lon),
    });
  }
  return clubs;
}

/** Source 2 supprimée : plus d'enrichissement en base pour le football. */
export async function enrichWithSupabase(clubs: FootClubRaw[]): Promise<FootClub[]> {
  return clubs;
}


/** Récupère un club enrichi par son ID data.sports.gouv.fr. */
export async function fetchFootClubById(dataEsId: string): Promise<FootClub | null> {
  const url = `${SPORTS_GOUV_URL}?where=${encodeURIComponent(`equip_numero="${dataEsId}"`)}&limit=1`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const json = await res.json();
  const r = json?.results?.[0];
  if (!r) return null;
  const raw: FootClubRaw = {
    data_es_id: dataEsId,
    nom: r.inst_nom ?? r.equip_nom ?? 'Club de football',
    adresse: r.inst_adresse ?? '',
    code_postal: r.inst_cp ?? '',
    ville: r.new_name ?? '',
    lat: r.equip_coordonnees?.lat ?? null,
    lng: r.equip_coordonnees?.lon ?? null,
  };
  const [enriched] = await enrichWithSupabase([raw]);
  return enriched ?? raw;
}

/** Source 3 : Google Places via edge function. */
export async function fetchGooglePlaces(clubNom: string, ville: string): Promise<GooglePlaces | null> {
  try {
    const { data, error } = await supabase.functions.invoke('get-google-places', {
      body: { clubNom, ville },
    });
    if (error) throw error;
    return data as GooglePlaces;
  } catch (err) {
    console.warn('fetchGooglePlaces failed', err);
    return null;
  }
}

export interface SuggestionPayload {
  data_es_id: string;
  nom?: string;
  ville?: string;
  prix_adulte?: number | null;
  prix_enfant?: number | null;
  niveau_ligue?: string | null;
  horaires_text?: string | null;
  telephone?: string | null;
  site_web?: string | null;
}

export async function submitSuggestion(payload: SuggestionPayload) {
  const { error } = await supabase.from('clubs_foot_suggestions').insert([payload]);
  if (error) throw error;
}
