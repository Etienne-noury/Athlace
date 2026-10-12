import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SiteStats {
  clubs: number;
  federations_covered: number;
  federations_total: number;
  cities: number;
  schedules: number;
  venues: number;
  clubs_with_schedules: number;
  last_update: string | null;
}

const EMPTY: SiteStats = {
  clubs: 0, federations_covered: 0, federations_total: 0, cities: 0,
  schedules: 0, venues: 0, clubs_with_schedules: 0, last_update: null,
};

function toNumber(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export async function fetchSiteStats(): Promise<SiteStats> {
  const { data, error } = await supabase.rpc('home_stats');
  if (error) throw error;
  const raw = (data ?? {}) as Record<string, unknown>;
  return {
    clubs: toNumber(raw.clubs),
    federations_covered: toNumber(raw.federations_covered),
    federations_total: toNumber(raw.federations_total),
    cities: toNumber(raw.cities),
    schedules: toNumber(raw.schedules),
    venues: toNumber(raw.venues),
    clubs_with_schedules: toNumber(raw.clubs_with_schedules),
    last_update: typeof raw.last_update === 'string' ? raw.last_update : null,
  };
}

/** Chiffres réels de la landing, lus en direct depuis la base (RPC home_stats). */
export function useSiteStats() {
  const query = useQuery({
    queryKey: ['site-stats'],
    queryFn: fetchSiteStats,
    staleTime: 1000 * 60 * 60,
  });

  return {
    stats: query.data ?? EMPTY,
    isLoading: query.isLoading,
    isReady: !!query.data,
  };
}
