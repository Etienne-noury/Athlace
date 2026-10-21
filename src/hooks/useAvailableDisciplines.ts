import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ARBORESCENCE, slugifyDiscipline } from '@/data/disciplines';

export interface Row {
  discipline: string;
  clubs: number;
  subs: Record<string, number> | null;
}

export interface SportAvailability {
  available: boolean;
  count: number;
  /** sous-discipline (nom exact) → nombre de clubs */
  subs: Record<string, number>;
  subList: { name: string; count: number }[];
}

export async function fetchAvailableDisciplines(): Promise<Row[]> {
  const { data, error } = await supabase.rpc('available_disciplines');
  if (error) throw error;
  return Array.isArray(data) ? (data as unknown as Row[]) : [];
}

/** Calcule la disponibilité à partir des lignes renvoyées par available_disciplines(). */
export function computeDisciplineAvailability(rows: Row[]) {
  const byDisc = new Map<string, Row>();
  for (const r of rows) byDisc.set(r.discipline, r);

  const sports: Record<string, SportAvailability> = {};
  const categories: Record<string, boolean> = {};
  let availableSportCount = 0;
  for (const cat of ARBORESCENCE) {
    let catOk = false;
    for (const sport of cat.sports) {
      let count = 0;
      const subTotals: Record<string, number> = {};
      const excluded = new Set([...(sport.offers ?? []), ...(sport.handi ?? [])]);
      for (const m of sport.match) {
        const row = byDisc.get(m);
        if (!row) continue;
        count += Number(row.clubs) || 0;
        for (const [name, total] of Object.entries(row.subs ?? {})) {
          const n = Number(total) || 0;
          if (n > 0 && !excluded.has(name)) subTotals[name] = (subTotals[name] ?? 0) + n;
        }
      }
      const subList = Object.entries(subTotals)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'fr'));
      sports[slugifyDiscipline(sport.name)] = { available: count > 0, count, subs: subTotals, subList };
      if (count > 0) {
        catOk = true;
        availableSportCount += 1;
      }
    }
    categories[cat.id] = catOk;
  }
  return { sports, categories, availableSportCount };
}

/** Disponibilité des sports, sous-disciplines et catégories selon les clubs réellement en base. */
export function useAvailableDisciplines() {
  const query = useQuery({
    queryKey: ['available-disciplines'],
    queryFn: fetchAvailableDisciplines,
    staleTime: 1000 * 60 * 60,
  });

  const value = useMemo(
    () => computeDisciplineAvailability(query.data ?? []),
    [query.data],
  );

  const isReady = !!query.data;
  const getSport = (sportId?: string | null): SportAvailability =>
    (sportId && value.sports[sportId]) || { available: false, count: 0, subs: {}, subList: [] };

  return {
    sports: value.sports,
    getSport,
    isReady,
    isLoading: query.isLoading,
    /** Tant que les données ne sont pas chargées, tout est considéré disponible pour éviter le clignotement. */
    isSportAvailable: (sportId?: string | null) => !isReady || getSport(sportId).available,
    sportCount: (sportId?: string | null) => getSport(sportId).count,
    isSubAvailable: (sportId: string, subName: string) =>
      !isReady || (getSport(sportId).subs[subName] ?? 0) > 0,
    isCategoryAvailable: (catId: string) => !isReady || !!value.categories[catId],
    /** Nombre de sports ayant au moins un club en base. */
    availableSportCount: value.availableSportCount,
  };
}

export function formatClubCount(n: number) {
  return n.toLocaleString('fr-FR');
}
