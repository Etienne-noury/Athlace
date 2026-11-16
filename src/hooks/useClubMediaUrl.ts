import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Renvoie une URL affichable pour un média de club.
 * - URL "http..." : renvoyée telle quelle.
 * - Sinon : chemin du bucket privé "club-media", converti en URL signée valable 1 heure
 *   (null en attendant ou en cas d'erreur).
 */
export function useClubMediaUrl(value: string | null | undefined): string | null {
  const v = value?.trim() || null;
  const isHttp = !!v && v.startsWith('http');
  const [signed, setSigned] = useState<{ path: string; url: string | null } | null>(null);

  useEffect(() => {
    if (!v || isHttp) return;
    let cancelled = false;
    supabase.storage
      .from('club-media')
      .createSignedUrl(v, 3600)
      .then(({ data, error }) => {
        if (!cancelled) setSigned({ path: v, url: error ? null : data?.signedUrl ?? null });
      })
      .catch(() => {
        if (!cancelled) setSigned({ path: v, url: null });
      });
    return () => { cancelled = true; };
  }, [v, isHttp]);

  if (!v) return null;
  if (isHttp) return v;
  return signed?.path === v ? signed.url : null;
}
