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
      for (const m of sport.match) {
        const row = byDisc.get(m);
        if (!row) continue;
        count += Number(row.clubs) || 0;
        for (const s of sport.subs) {
          const n = Number(row.subs?.[s]) || 0;
          if (n > 0) subTotals[s] = (subTotals[s] ?? 0) + n;
        }
      }
      sports[slugifyDiscipline(sport.name)] = { available: count > 0, count, subs: subTotals };
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
    (sportId && value.sports[sportId]) || { available: false, count: 0, subs: {} };

  return {
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
