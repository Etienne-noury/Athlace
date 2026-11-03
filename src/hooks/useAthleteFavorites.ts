import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';

export function useAthleteFavorites() {
  const { user } = useAuth();
  const client = useQueryClient();
  const cities = useQuery({ queryKey: ['favorite-cities', user?.id], enabled: !!user, queryFn: async () => {
    if (!user) return [];
    const { data, error } = await supabase.from('favorite_cities').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  } });
  const sports = useQuery({ queryKey: ['favorite-sports', user?.id], enabled: !!user, queryFn: async () => {
    if (!user) return [];
    const { data, error } = await supabase.from('favorite_sports').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  } });
  const clubs = useQuery({ queryKey: ['favorites-count', user?.id], enabled: !!user, queryFn: async () => {
    if (!user) return 0;
    const { count, error } = await supabase.from('favorites').select('id', { count: 'exact', head: true }).eq('user_id', user.id);
    if (error) throw error;
    return count ?? 0;
  } });
  return { cities, sports, clubs, refresh: async () => {
    await Promise.all(['favorite-cities', 'favorite-sports', 'favorites-count'].map((key) => client.invalidateQueries({ queryKey: [key, user?.id] })));
  }, loading: cities.isLoading || sports.isLoading || clubs.isLoading, error: cities.error || sports.error || clubs.error,
    total: (clubs.data ?? 0) + (cities.data?.length ?? 0) + (sports.data?.length ?? 0) };
}