import { useQuery } from '@tanstack/react-query';
import { fetchFederationsSportives } from '@/lib/federations-officielles';
import { fetchFederationClubStats } from '@/lib/federation-directory';

export function useFederationDirectory() {
  const federations = useQuery({ queryKey: ['federations-official-directory'], queryFn: fetchFederationsSportives });
  const stats = useQuery({ queryKey: ['federation-club-stats'], queryFn: fetchFederationClubStats });
  return {
    federations: federations.data ?? [], stats: stats.data ?? [],
    isLoading: federations.isLoading || stats.isLoading,
    isError: federations.isError || stats.isError,
    retry: () => { void federations.refetch(); void stats.refetch(); },
  };
}