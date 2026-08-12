# Emails de confirmation Athlace

Objectif : que les emails d'inscription et de réinitialisation partent bien, depuis votre propre domaine `athlace.fr`, et que personne ne reste bloqué à l'étape « vérifiez votre email ».

## Ce qui se passe aujourd'hui

Aucun domaine d'envoi n'est configuré pour le projet. Tant que ce n'est pas fait, les emails d'authentification passent par l'expéditeur générique de la plateforme : ils sont souvent classés en spam ou bloqués par les messageries (Gmail, Outlook, Free…), ce qui correspond au symptôme « l'email n'arrive jamais ».

## Étape 1 — Configurer le domaine d'envoi (action de votre côté)

Vous ouvrez l'assistant de configuration email et choisissez un sous-domaine d'envoi sur `athlace.fr` (par ex. `notify.athlace.fr`). L'assistant affiche les enregistrements DNS à ajouter chez votre registrar. La propagation DNS peut prendre jusqu'à 72 h, mais la suite peut être préparée sans attendre.

## Étape 2 — Infrastructure et modèles d'emails (de mon côté)

- Mise en place de l'infrastructure d'envoi (file d'attente, journal d'envoi, gestion des rebonds et désinscriptions).
- Création des 6 modèles d'emails d'authentification : confirmation d'inscription, réinitialisation de mot de passe, lien magique, invitation, changement d'email, ré-authentification.
- Habillage aux couleurs Athlace : palette Navy `#262E47` / Blue `#415CAF` / Lime `#D5DC3C`, typographies Outfit et Space Grotesk, textes en français avec le ton du site.
- Déploiement de la fonction d'envoi. Les emails partiront automatiquement dès la vérification DNS.

## Étape 3 — Améliorations côté application

- **Renvoyer l'email de confirmation** : sur la page de connexion, si la connexion échoue avec « email non confirmé », affichage d'un bouton « Renvoyer l'email de confirmation ». Même bouton sur l'écran de succès de l'inscription.
- **Message d'attente plus clair** après inscription : rappel de vérifier le dossier spam et affichage de l'adresse utilisée.
- **Page de confirmation** : traitement propre du retour depuis l'email (lien expiré ou déjà utilisé → message explicite et lien pour en redemander un).

## Débloquer votre compte de test tout de suite

Deux options, à choisir après la mise en place :

1. Une fois les emails opérationnels, utiliser le bouton « Renvoyer l'email de confirmation ».
2. Si vous voulez tester sans attendre le DNS, je peux activer temporairement la confirmation automatique des inscriptions (connexion immédiate, sans email). À désactiver une fois les emails validés — dites-le moi si vous souhaitez cette option.

## Détails techniques

- Domaine d'envoi via la configuration email managée (délégation NS), pas de service tiers ni de clé API.
- `email_domain--setup_email_infra` puis `scaffold_auth_email_templates`, modèles React Email dans `supabase/functions/_shared/email-templates/`, hook `auth-email-hook` déployé.
- Côté front : `supabase.auth.resend({ type: 'signup', email })` dans `src/lib/auth.tsx`, exposé depuis `src/pages/Login.tsx` et `src/pages/Register.tsx`.
- Nouvelle route `/compte/confirmation/` pour gérer les retours de lien invalide/expiré.
