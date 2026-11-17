import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth';

/** À la connexion ou déconnexion, les données déjà chargées sont relues : un admin voit aussi les clubs non publiés. */
export function AuthQueryReset() {
  const { user, loading } = useAuth();
  const queryClient = useQueryClient();
  const previous = useRef<string | null | undefined>(undefined);
  useEffect(() => {
    if (loading) return;
    const current = user?.id ?? null;
    if (previous.current !== undefined && previous.current !== current) queryClient.resetQueries();
    previous.current = current;
  }, [user, loading, queryClient]);
  return null;
}
