import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { fetchFederationsSportives } from '@/lib/federations-officielles';
import { LEGACY_CODES } from '@/lib/federation-directory';

const hostOf = (url: string | null | undefined) => {
  try {
    return url ? new URL(url).hostname.toLowerCase().replace(/^www\./, '') : '';
  } catch {
    return '';
  }
};

/**
 * Fédérations qui ont donné leur accord écrit (federation_publication). Tant que ce n'est pas le cas, on peut
 * nommer la fédération mais jamais mettre de lien vers ses sites : officiel, annuaire ou sources des fiches sport.
 * Pendant le chargement, aucun lien fédéral n'est affiché.
 */
export function usePublishedFederations() {
  const published = useQuery({
    queryKey: ['published-federations'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('published_federations');
      if (error) throw error;
      return new Set(((data ?? []) as string[]).map((c) => c.toUpperCase()));
    },
    staleTime: 5 * 60 * 1000,
  });
  const federations = useQuery({ queryKey: ['federations-official-directory'], queryFn: fetchFederationsSportives, staleTime: 60 * 60 * 1000 });

  const isPublished = useCallback((sigle: string | null | undefined) => {
    const set = published.data;
    if (!set || !sigle) return false;
    const code = sigle.toUpperCase();
    return set.has(code) || (LEGACY_CODES[code] ?? []).some((c) => set.has(c.toUpperCase()));
  }, [published.data]);

  /** Faux si l'URL pointe vers le site d'une fédération pas encore autorisée (ou si on ne sait pas encore). */
  const canLink = useCallback((url: string | null | undefined) => {
    const host = hostOf(url);
    if (!host) return false;
    if (!federations.data || !published.data) return false;
    const fed = federations.data.find((f) => {
      const h = hostOf(f.site_web);
      return h && (host === h || host.endsWith(`.${h}`));
    });
    return fed ? isPublished(fed.sigle) : true;
  }, [federations.data, published.data, isPublished]);

  return { isPublished, canLink };
}
