/**
 * Accès au questionnaire club sans création de compte, ouvert ponctuellement (webinaire fédérations du
 * 18 décembre 2026 : clubs ambassadeurs). Le visiteur reçoit une session anonyme Supabase, donc les règles
 * d'accès (RLS) restent celles d'un compte connecté. Pour fermer l'accès, avancer la date.
 */
export const OPEN_CLUB_FORM_UNTIL = '2027-01-31';

export const isClubFormOpen = (now = new Date()) => now <= new Date(`${OPEN_CLUB_FORM_UNTIL}T23:59:59+01:00`);

/** Lien « Compléter ma fiche » : sans compte pendant l'ouverture, sinon l'espace connecté. */
export function clubFormPath(clubId?: string) {
  const base = isClubFormOpen() ? '/fiche-club/' : '/compte/mon-club/';
  return clubId ? `${base}?club=${clubId}` : base;
}
