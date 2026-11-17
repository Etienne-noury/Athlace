import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

/** Vrai si l'utilisateur connecté a le rôle admin (les clubs non publiés lui sont visibles). */
export function useIsAdmin() {
  const { user } = useAuth();
  const query = useQuery({
    queryKey: ['is-admin', user?.id ?? null],
    enabled: Boolean(user),
    staleTime: 10 * 60 * 1000,
    queryFn: async () => {
      const { data } = await supabase.from('user_roles').select('role').eq('user_id', user!.id).eq('role', 'admin').maybeSingle();
      return Boolean(data);
    },
  });
  return Boolean(user) && query.data === true;
}
