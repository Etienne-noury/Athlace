import { ARBORESCENCE, slugifyDiscipline, type SportNode } from '@/data/disciplines';
import { findSportForSigle, type FederationSportive } from '@/lib/federations-officielles';
import { supabase } from '@/integrations/supabase/client';

export interface FederationClubStats {
  federation_code: string;
  discipline: string;
  clubs: number;
  subs: string[];
}

export async function fetchFederationClubStats(): Promise<FederationClubStats[]> {
  const { data, error } = await supabase.rpc('federation_club_stats');
  if (error) throw error;
  return (data ?? []).map((row) => ({ ...row, clubs: Number(row.clubs) }));
}

export function getFederationSports(sigle: string | null): SportNode[] {
  return ARBORESCENCE.flatMap((family) => family.sports.filter((sport) =>
    sport.feds.some((code) => code.toUpperCase() === sigle?.toUpperCase()),
  ));
}

// Existing imports sometimes use a legacy code. Require both that code and
// the sport's exact discipline to disambiguate FFP (polo vs parachutisme).
const LEGACY_CODES: Record<string, string[]> = {
  FFRP: ['FFRANDO'], 'FFB-BIL': ['FFB-BILLARD'], FFVV: ['FFVP'],
  'FFP-PARA': ['FFP'], FFP: ['FFPOLO'],
};

export function getFederationStats(sigle: string | null, rows: FederationClubStats[]) {
  const code = sigle?.toUpperCase() ?? '';
  const sports = getFederationSports(sigle);
  const relevant = rows.filter((row) => row.federation_code.toUpperCase() === code ||
    ((LEGACY_CODES[code] ?? []).includes(row.federation_code.toUpperCase()) &&
      sports.some((sport) => sport.match.includes(row.discipline))));
  const disciplines = sports.flatMap((sport) => {
    const names = new Set(relevant.filter((row) => sport.match.includes(row.discipline)).flatMap((row) => row.subs));
    const excluded = new Set([...(sport.offers ?? []), ...(sport.handi ?? [])]);
    const sportId = slugifyDiscipline(sport.name);
    return [...names].filter((name) => !excluded.has(name)).sort((a, b) => a.localeCompare(b, 'fr'))
      .map((name) => ({ name, sportId, id: `${sportId}--${slugifyDiscipline(name)}` }));
  });
  return { count: relevant.reduce((sum, row) => sum + row.clubs, 0), disciplines };
}

export function findFederationBySlug(federations: FederationSportive[], slug?: string) {
  return federations.find((federation) => federation.sigle?.toLowerCase() === slug);
}

export function federationClubUrl(sportId: string, subId?: string) {
  const params = new URLSearchParams({ discipline: sportId });
  if (subId) params.set('sous-discipline', subId);
  return `/clubs/?${params.toString()}`;
}

export { findSportForSigle };