import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { parisToday } from '@/lib/events';

export function useEvents(sport = 'all', city = '') {
  const today = parisToday();
  return useQuery({
    queryKey: ['events', 'public', today, sport, city.trim()],
    queryFn: async () => {
      let query = supabase.from('events').select('*').or(`end_date.gte.${today},and(end_date.is.null,start_date.gte.${today})`).order('start_date').order('title');
      if (sport !== 'all') query = query.eq('sport_id', sport);
      if (city.trim()) query = query.ilike('city', `%${city.trim().replace(/[\\%_]/g, '\\$&')}%`);
      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },
  });
}
export function useEvent(slug: string | undefined) {
  const today = parisToday();
  return useQuery({
    queryKey: ['events', 'detail', today, slug],
    enabled: !!slug,
    queryFn: async () => {
      if (!slug) return null;
      const { data, error } = await supabase.from('events').select('*').eq('slug', slug).or(`end_date.gte.${today},and(end_date.is.null,start_date.gte.${today})`).maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}