# Espace "Mon compte" — authentification 100% fonctionnelle

Objectif : rendre le parcours de compte complet et fiable, de l'inscription à la déconnexion, avec profil enregistré en base et photo de profil.

## Ce qui sera livré

### 1. Authentification complète
- Inscription email/mot de passe avec redirection d'email correcte (l'utilisateur revient bien sur le site après avoir cliqué dans l'email de confirmation).
- Connexion email/mot de passe, messages d'erreur en français clair (identifiants invalides, email non confirmé, compte déjà existant).
- Connexion Google (déjà activée côté backend) depuis Connexion et Inscription.
- Mot de passe oublié : nouvelle page `/compte/mot-de-passe-oublie/` (envoi du lien) et `/compte/nouveau-mot-de-passe/` (saisie du nouveau mot de passe).
- Déconnexion depuis le profil et depuis le menu de l'en-tête.
- Validation des champs (email valide, mot de passe ≥ 8 caractères, confirmation identique).

### 2. Sessions et routes protégées
- Session persistée et rafraîchie automatiquement ; l'en-tête affiche l'état connecté/déconnecté.
- Un composant de protection redirige les pages `/compte/*` vers la connexion si non connecté, puis renvoie vers la page demandée après connexion (plus d'écran vide ou de flash de contenu).
- Après connexion sociale, retour sur le site puis redirection vers la page prévue une fois la session prête.

### 3. Profil réel en base
- Création automatique d'une fiche profil à l'inscription (nom, ville, téléphone, avatar).
- Page Profil : lecture et enregistrement des informations en base, avec retours visuels (toast succès/erreur).
- Changement de mot de passe depuis le profil.
- Suppression du compte (demande de confirmation) — supprime les données personnelles associées.

### 4. Photo de profil
- Espace de stockage dédié aux avatars, chaque utilisateur ne peut modifier que le sien.
- Upload depuis la page Profil, aperçu immédiat, initiales par défaut si aucune photo.

### 5. Cohérence de l'espace membre
- En-tête : menu utilisateur (Profil, Mes clubs, Notifications, Déconnexion) quand connecté, boutons Connexion/Inscription sinon.
- Page `/compte/` : tableau de bord cohérent avec les pages réellement disponibles.
- Pages "Mon club" et "Fidélité" restent en placeholder (hors périmètre, comme convenu).

## Détails techniques

- Base de données : ajout d'un trigger `handle_new_user` sur les nouveaux comptes pour insérer la ligne `profiles` (avec `full_name` / `avatar_url` issus des métadonnées Google) ; ajout d'une politique d'insertion sur `profiles` ; création du bucket public `avatars` avec politiques d'écriture limitées au dossier `auth.uid()`.
- `src/lib/auth.ts` : refonte en contexte React (`AuthProvider` + `useAuth`) exposant `user`, `session`, `profile`, `loading` ; ordre correct `onAuthStateChange` puis `getSession` ; helpers `resetPassword`, `updatePassword`, `signOut`, `deleteAccount`.
- `src/components/auth/RequireAuth.tsx` : garde de route avec état de chargement et mémorisation de la destination.
- `src/App.tsx` : `AuthProvider` autour du routeur, nouvelles routes mot de passe, protection des routes `/compte/*` (hors connexion/inscription).
- Pages modifiées : `Login.tsx`, `Register.tsx`, `Profile.tsx`, `Compte.tsx`, `Notifications.tsx` (préférences en lecture seule), `Header.tsx`.
- Mapping des erreurs Supabase vers des messages français dans un utilitaire partagé.
- `emailRedirectTo` et `redirectTo` construits sur `window.location.origin`.
