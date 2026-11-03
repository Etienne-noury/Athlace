/**
 * Sécurise un lien externe avant de l'afficher dans un href.
 * N'accepte que http(s) ; un domaine sans protocole ("monclub.fr") est complété en https.
 * Renvoie null si le lien est vide ou dangereux (ex. "javascript:...").
 */
export function safeExternalUrl(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const value = raw.trim();
  if (!value) return null;
  const hasScheme = /^[a-z][a-z0-9+.-]*:/i.test(value);
  const candidate = hasScheme ? value : `https://${value.replace(/^\/+/, '')}`;
  try {
    const url = new URL(candidate);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : null;
  } catch {
    return null;
  }
}
