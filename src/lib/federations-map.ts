// Mapping discipline → fédération + générateurs d'URL d'annuaire officiel.
// Permet de proposer aux utilisateurs un lien direct vers l'annuaire
// fédéral pour trouver l'exhaustivité des clubs d'une discipline.

export interface FederationSource {
  id: string;
  code: string | null;
  name: string;
  sport: string;
  icon: string;
  type: 'api' | 'opendata' | 'annuaire';
  /** URL principale de la fédération (page d'accueil annuaire). */
  url: string;
  /** Construit l'URL de recherche d'annuaire, optionnellement filtrée par ville/CP. */
  buildSearchUrl: (query?: { city?: string; postalCode?: string }) => string;
}

function iconForCategory(categorie: string): string {
  if (categorie.includes('collectif')) return '⚽';
  if (categorie.includes('raquette')) return '🎾';
  if (categorie.includes('aquatique')) return '🏊';
  if (categorie.includes('combat') || categorie.includes('martial')) return '🥋';
  if (categorie.includes('nature') || categorie.includes('montagne')) return '🏔️';
  if (categorie.includes('hiver') || categorie.includes('glisse')) return '🎿';
  if (categorie.includes('fitness') || categorie.includes('danse')) return '🏋️';
  if (categorie.includes('mécanique') || categorie.includes('aérien')) return '🏎️';
  if (categorie.includes('précision')) return '🎯';
  if (categorie.includes('traditionnel') || categorie.includes('régional')) return '🎪';
  if (categorie.includes('Pêche')) return '🎣';
  if (categorie.includes('Paralympique')) return '♿';
  return '🏅';
}

export async function fetchFederationSources(): Promise<FederationSource[]> {
  const { supabase } = await import('@/integrations/supabase/client');
  const { data, error } = await supabase
    .from('federations_sportives')
    .select('id, nom, sigle, categorie, site_web')
    .order('nom');
  if (error) throw error;
  return (data || []).map((f) => ({
    id: f.id,
    code: f.sigle,
    name: f.nom,
    sport: f.categorie,
    icon: iconForCategory(f.categorie),
    type: 'annuaire' as const,
    url: f.site_web,
    buildSearchUrl: ({ city, postalCode } = {}) =>
      `${f.site_web}?q=${encodeURIComponent(postalCode || city || '')}`,
  }));
}

/**
 * Associe une discipline (par id ou nom) à la fédération qui en tient l'annuaire officiel.
 * Plusieurs disciplines/sous-disciplines peuvent pointer vers la même fédération.
 */
const DISCIPLINE_TO_FEDERATION: Record<string, string> = {
  // Football
  football: 'FFF', 'football-11': 'FFF', 'football-7': 'FFF', 'football-5': 'FFF',
  futsal: 'FFF', 'beach-soccer': 'FFF', 'football-feminin': 'FFF',
  // Tennis
  tennis: 'FFT', 'tennis-simple': 'FFT', 'tennis-double': 'FFT',
  padel: 'FFT', 'beach-tennis': 'FFT',
  // Rugby
  rugby: 'FFR', 'rugby-15': 'FFR', 'rugby-7': 'FFR', 'rugby-13': 'FFR',
  'touch-rugby': 'FFR', 'beach-rugby': 'FFR', 'rugby-feminin': 'FFR',
  // Vol libre
  parapente: 'FFVL', 'deltaplane': 'FFVL', 'cerf-volant': 'FFVL', 'kite': 'FFVL',
  'vol-libre': 'FFVL',
  // Natation
  natation: 'FFN', 'natation-sportive': 'FFN', 'natation-synchronisee': 'FFN',
  'water-polo': 'FFN', 'plongeon': 'FFN', 'eau-libre': 'FFN',
  // Badminton
  badminton: 'FFBaD',
};

export function getFederationForDiscipline(
  disciplineId?: string,
  sources?: FederationSource[]
): FederationSource | null {
  if (!disciplineId || !sources) return null;
  const code = DISCIPLINE_TO_FEDERATION[disciplineId];
  if (!code) return null;
  return sources.find((s) => s.code?.toUpperCase() === code.toUpperCase()) || null;
}

/** Sigle officiel (table `federations_sportives`) associé à une discipline. */
export const DISCIPLINE_TO_SIGLE: Record<string, string> = DISCIPLINE_TO_FEDERATION;

/**
 * Variante asynchrone : récupère la fédération officielle depuis la table
 * `federations_sportives` (matching sur le sigle mappé, sinon sur le nom).
 */
export async function fetchFederationForDiscipline(disciplineId?: string, disciplineName?: string) {
  if (!disciplineId && !disciplineName) return null;
  const { supabase } = await import('@/integrations/supabase/client');
  const sigle = disciplineId ? DISCIPLINE_TO_SIGLE[disciplineId] : undefined;

  let query = supabase
    .from('federations_sportives')
    .select('id, nom, sigle, categorie, site_web, is_paralympique')
    .limit(1);

  query = sigle
    ? query.ilike('sigle', sigle)
    : query.ilike('nom', disciplineName || disciplineId || '');

  const { data, error } = await query.maybeSingle();
  if (error) return null;
  return data ?? null;
}
