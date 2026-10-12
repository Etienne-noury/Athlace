import { supabase } from '@/integrations/supabase/client';
import { ARBORESCENCE, slugifyDiscipline } from '@/data/disciplines';

export interface FederationSportive {
  id: string;
  nom: string;
  sigle: string | null;
  site_web: string;
  is_paralympique: boolean;
}

export function slugifyFederation(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function fetchFederationsSportives(): Promise<FederationSportive[]> {
  const { data, error } = await supabase
    .from('federations_sportives')
    .select('id, nom, sigle, site_web, is_paralympique')
    .order('nom', { ascending: true });

  if (error) throw error;
  return (data ?? []) as FederationSportive[];
}

export interface SportFederationGroup<T> {
  sportName: string;
  sportSlug: string;
  sportIcon: string;
  federations: T[];
}

export interface CategoryFederationGroup<T> {
  id: string;
  name: string;
  icon: string;
  sports: SportFederationGroup<T>[];
}

export const UNCLASSIFIED_ID = 'a-classer';

const norm = (s: string | null | undefined) => (s ?? '').trim().toUpperCase();

/** Sigle → { catégorie, sport } d'après ARBORESCENCE (seule source des catégories). */
export function findSportForSigle(sigle: string | null | undefined) {
  const key = norm(sigle);
  if (!key) return undefined;
  for (const cat of ARBORESCENCE) {
    for (const sport of cat.sports) {
      if (sport.feds.some((f) => norm(f) === key)) return { category: cat, sport };
    }
  }
  return undefined;
}

/**
 * Regroupe des fédérations selon ARBORESCENCE (ordre des catégories et des sports conservé).
 * Les sigles introuvables vont dans un groupe « À classer » (warning console).
 */
export function groupFederationsByArborescence<T>(
  items: T[],
  getSigle: (item: T) => string | null | undefined,
): CategoryFederationGroup<T>[] {
  const bySigle = new Map<string, T[]>();
  for (const it of items) {
    const k = norm(getSigle(it));
    if (!bySigle.has(k)) bySigle.set(k, []);
    bySigle.get(k)!.push(it);
  }
  const used = new Set<string>();
  const groups: CategoryFederationGroup<T>[] = [];
  for (const cat of ARBORESCENCE) {
    const sports: SportFederationGroup<T>[] = [];
    for (const sport of cat.sports) {
      const feds = sport.feds.flatMap((f) => {
        const k = norm(f);
        if (used.has(k)) return [];
        const list = bySigle.get(k);
        if (!list) return [];
        used.add(k);
        return list;
      });
      if (feds.length) {
        sports.push({ sportName: sport.name, sportSlug: slugifyDiscipline(sport.name), sportIcon: sport.icon, federations: feds });
      }
    }
    if (sports.length) groups.push({ id: cat.id, name: cat.name, icon: cat.icon, sports });
  }
  const leftovers = [...bySigle.entries()].filter(([k]) => !used.has(k)).flatMap(([, v]) => v);
  if (leftovers.length) {
    console.warn(
      '[fédérations] Sigles absents de ARBORESCENCE (groupe « À classer ») :',
      leftovers.map((f) => getSigle(f) ?? '(sans sigle)'),
    );
    groups.push({
      id: UNCLASSIFIED_ID,
      name: 'À classer',
      icon: '🏅',
      sports: [{ sportName: 'À classer', sportSlug: '', sportIcon: '🏅', federations: leftovers }],
    });
  }
  return groups;
}

export async function fetchFederationsByCategorie(): Promise<CategoryFederationGroup<FederationSportive>[]> {
  const federations = await fetchFederationsSportives();
  return groupFederationsByArborescence(federations, (f) => f.sigle);
}
