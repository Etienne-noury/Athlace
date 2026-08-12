# Débloquer les inscriptions Athlace

Objectif immédiat : plus personne ne reste bloqué à l'étape « vérifiez votre email ». La confirmation par email sera réactivée plus tard, avec une adresse no-reply sur `athlace.fr`.

## Ce qui se passe aujourd'hui

Aucun domaine d'envoi n'est configuré pour le projet. Les emails d'authentification passent donc par l'expéditeur générique de la plateforme : souvent classés en spam ou bloqués par les messageries (Gmail, Outlook, Free…), ce qui correspond au symptôme « l'email n'arrive jamais ».

## Étape 1 — Activer la confirmation automatique (maintenant)

- Activation de la confirmation automatique des inscriptions : le compte est actif immédiatement, sans email à valider.
- Après création du compte, l'utilisateur est directement connecté et redirigé vers son profil (plus d'écran « vérifiez votre email »).
- Adaptation des textes d'inscription et du message d'erreur « email non confirmé », devenu inutile.

## Étape 2 — Plus tard : emails no-reply sur athlace.fr

À faire quand vous serez prêt (pas dans cette étape) :

- Configuration du sous-domaine d'envoi (ex. `notify.athlace.fr`) et des enregistrements DNS chez votre registrar.
- Modèles d'emails d'authentification aux couleurs Athlace (Navy `#262E47`, Blue `#415CAF`, Lime `#D5DC3C`, Outfit / Space Grotesk), en français.
- Réactivation de la vérification d'email + bouton « Renvoyer l'email de confirmation » sur la connexion.

Point d'attention : la réinitialisation de mot de passe repose sur un email. Tant que l'envoi n'est pas configuré, ce parcours restera peu fiable — la page existe et fonctionnera dès que les emails partiront.

## Détails techniques

- Configuration d'authentification : `auto_confirm_email: true` (signups toujours ouverts, pas de connexion anonyme).
- `src/pages/Register.tsx` : suppression de l'écran « vérifiez votre email », redirection vers `/compte/profil/` dès que la session est créée.
- `src/lib/auth.tsx` : `authErrorMessage` — retrait du cas « email not confirmed » désormais sans objet ; `emailRedirectTo` conservé pour la future réactivation.
