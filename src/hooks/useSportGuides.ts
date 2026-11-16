import { useQuery } from '@tanstack/react-query';

/** Fiches sport (≈300 Ko de texte) chargées à la demande, une seule fois par session. */
export function useSportGuides() {
  return useQuery({ queryKey: ['sport-guides'], queryFn: () => import('@/data/sport-guides'), staleTime: Infinity });
}
