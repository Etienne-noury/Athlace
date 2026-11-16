// Fonction edge : delete-account
// Supprime le compte de l'utilisateur connecté et toutes ses données personnelles
// (droit à l'effacement, RGPD). L'utilisateur ne peut supprimer que son propre compte :
// son identité vient de sa session, jamais du corps de la requête.
//
// Si tu ajoutes une table contenant un user_id, ajoute-la à USER_TABLES ci-dessous.

import { createClient, type SupabaseClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

/** Tables de données personnelles : [table, colonne qui porte l'identifiant utilisateur]. */
const USER_TABLES: ReadonlyArray<readonly [string, string]> = [
  ['favorites', 'user_id'],
  ['favorite_cities', 'user_id'],
  ['favorite_sports', 'user_id'],
  ['alert_preferences', 'user_id'],
  ['club_submissions', 'user_id'],
  ['profiles', 'id'],
];

const respond = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

/** Vide le dossier de l'utilisateur dans un bucket, sauf les chemins listés dans `keep`. */
async function removeUserFiles(admin: SupabaseClient, bucket: string, userId: string, keep = new Set<string>()) {
  const { data: files, error } = await admin.storage.from(bucket).list(userId, { limit: 1000 });
  if (error) throw error;
  const paths = (files ?? []).map((f) => `${userId}/${f.name}`).filter((p) => !keep.has(p));
  if (paths.length === 0) return;
  const { error: removeError } = await admin.storage.from(bucket).remove(paths);
  if (removeError) throw removeError;
}

/**
 * Images déjà publiées sur une fiche club validée (logo, photos) : elles appartiennent
 * désormais à la fiche du club et restent en ligne après le départ de la personne.
 */
async function publishedClubMedia(admin: SupabaseClient, userId: string): Promise<Set<string>> {
  const prefix = `${userId}/`;
  const keep = new Set<string>();
  const { data: byLogo, error: logoError } = await admin.from('clubs').select('logo_url').like('logo_url', `${prefix}%`);
  if (logoError) throw logoError;
  for (const row of byLogo ?? []) if (row.logo_url) keep.add(row.logo_url);

  const { data: files, error: listError } = await admin.storage.from('club-media').list(userId, { limit: 1000 });
  if (listError) throw listError;
  const paths = (files ?? []).map((f) => `${prefix}${f.name}`);
  if (paths.length > 0) {
    const { data: byPhoto, error: photoError } = await admin.from('clubs').select('photo_urls').overlaps('photo_urls', paths);
    if (photoError) throw photoError;
    for (const row of byPhoto ?? []) for (const p of row.photo_urls ?? []) if (p.startsWith(prefix)) keep.add(p);
  }
  return keep;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return respond({ error: 'Non authentifié' }, 401);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // 1. Qui appelle ? (session vérifiée par Supabase Auth)
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userError } = await userClient.auth.getUser();
    if (userError || !userData.user) return respond({ error: 'Session invalide' }, 401);
    const userId = userData.user.id;

    const admin = createClient(supabaseUrl, serviceKey);

    // 2. Fichiers : avatar, puis images de fiche club non publiées
    await removeUserFiles(admin, 'avatars', userId);
    await removeUserFiles(admin, 'club-media', userId, await publishedClubMedia(admin, userId));

    // 3. Lignes en base. On s'arrête à la première erreur : mieux vaut un compte
    //    encore là (l'utilisateur peut réessayer) qu'un compte supprimé avec des restes.
    for (const [table, column] of USER_TABLES) {
      const { error } = await admin.from(table).delete().eq(column, userId);
      if (error) throw new Error(`Suppression ${table} : ${error.message}`);
    }

    // 4. Le compte lui-même (supprime aussi ses rôles par cascade)
    const { error: deleteError } = await admin.auth.admin.deleteUser(userId);
    if (deleteError) throw deleteError;

    return respond({ success: true });
  } catch (err) {
    console.error('delete-account error', err instanceof Error ? err.message : err);
    return respond({ error: 'La suppression du compte a échoué. Réessayez ou écrivez à contact@athlace.fr.' }, 500);
  }
});
