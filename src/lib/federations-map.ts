// Mapping discipline → fédération + générateurs d'URL d'annuaire officiel.
// Permet de proposer aux utilisateurs un lien direct vers l'annuaire
// fédéral pour trouver l'exhaustivité des clubs d'une discipline.

export interface FederationSource {
  code: string;
  name: string;
  sport: string;
  icon: string;
  type: 'api' | 'opendata' | 'annuaire';
  /** URL principale de la fédération (page d'accueil annuaire). */
  url: string;
  /** Construit l'URL de recherche d'annuaire, optionnellement filtrée par ville/CP. */
  buildSearchUrl: (query?: { city?: string; postalCode?: string }) => string;
}

export const federationSources: Record<string, FederationSource> = {
  FFF: {
    code: 'FFF',
    name: 'Fédération Française de Football',
    sport: 'Football',
    icon: '⚽',
    type: 'api',
    url: 'https://api.fff.fr',
    buildSearchUrl: ({ city, postalCode } = {}) =>
      `https://www.fff.fr/recherche-club.html?q=${encodeURIComponent(postalCode || city || '')}`,
  },
  FFT: {
    code: 'FFT',
    name: 'Fédération Française de Tennis',
    sport: 'Tennis',
    icon: '🎾',
    type: 'annuaire',
    url: 'https://tenup.fft.fr',
    buildSearchUrl: ({ city, postalCode } = {}) =>
      `https://tenup.fft.fr/recherche/clubs?q=${encodeURIComponent(postalCode || city || '')}`,
  },
  FFR: {
    code: 'FFR',
    name: 'Fédération Française de Rugby',
    sport: 'Rugby',
    icon: '🏉',
    type: 'annuaire',
    url: 'https://www.ffr.fr/ffr/le-rugby/trouver-un-club',
    buildSearchUrl: ({ city, postalCode } = {}) =>
      `https://www.ffr.fr/ffr/le-rugby/trouver-un-club?search=${encodeURIComponent(postalCode || city || '')}`,
  },
  FFVL: {
    code: 'FFVL',
    name: 'Fédération Française de Vol Libre',
    sport: 'Vol libre',
    icon: '🪂',
    type: 'opendata',
    url: 'https://data.ffvl.fr',
    buildSearchUrl: () => 'https://federation.ffvl.fr/pages/structures',
  },
  FFN: {
    code: 'FFN',
    name: 'Fédération Française de Natation',
    sport: 'Natation',
    icon: '🏊',
    type: 'annuaire',
    url: 'https://www.ffnatation.fr',
    buildSearchUrl: ({ city, postalCode } = {}) =>
      `https://www.ffnatation.fr/clubs?q=${encodeURIComponent(postalCode || city || '')}`,
  },
  FFBaD: {
    code: 'FFBaD',
    name: 'Fédération Française de Badminton',
    sport: 'Badminton',
    icon: '🏸',
    type: 'api',
    url: 'https://www.ffbad.org',
    buildSearchUrl: ({ city, postalCode } = {}) =>
      `https://www.ffbad.org/pratiquer/trouver-un-club?q=${encodeURIComponent(postalCode || city || '')}`,
  },
};

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

export function getFederationForDiscipline(disciplineId?: string): FederationSource | null {
  if (!disciplineId) return null;
  const code = DISCIPLINE_TO_FEDERATION[disciplineId];
  return code ? federationSources[code] : null;
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

