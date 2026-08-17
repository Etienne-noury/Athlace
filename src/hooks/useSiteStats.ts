import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SiteStats {
  clubs: number;
  federations: number;
  cities: number;
  regions: number;
  disciplines: number;
}

const EMPTY: SiteStats = { clubs: 0, federations: 0, cities: 0, regions: 0, disciplines: 0 };

function toNumber(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export async function fetchSiteStats(): Promise<SiteStats> {
  const { data, error } = await supabase.rpc('site_stats');
  if (error) throw error;
  const raw = (data ?? {}) as Record<string, unknown>;
  return {
    clubs: toNumber(raw.clubs),
    federations: toNumber(raw.federations),
    cities: toNumber(raw.cities),
    regions: toNumber(raw.regions),
    disciplines: toNumber(raw.disciplines),
  };
}

/** Chiffres du site (clubs, fédérations, villes...) lus en direct depuis la base. */
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
