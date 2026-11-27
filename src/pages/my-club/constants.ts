// Constantes du formulaire « Mon club » : étapes, listes de choix et limites d'envoi des images.

import { type ClubPayload, type PriceDraft } from '@/lib/club-form';

/* ---------- Constantes ---------- */

export const STEPS = ['Votre club', 'Identité et description', 'Équipes et groupes', 'Spécificités du sport', 'Récapitulatif'];
export const ROLES = ['président', 'secrétaire', 'trésorier', 'entraîneur', 'autre'];
export const LEVELS = [
  { v: 'loisir', l: 'Loisir' }, { v: 'competition', l: 'Compétition' }, { v: 'les_deux', l: 'Les deux' },
] as const;
export const REGISTRATION = [
  { v: 'ouvertes', l: 'Inscriptions ouvertes' }, { v: 'liste_attente', l: "Liste d'attente" }, { v: 'complet', l: 'Complet' },
] as const;
export const CONTACT: [keyof ClubPayload, string, string][] = [
  ['email', 'Email', 'email'], ['phone', 'Téléphone', 'tel'], ['website', 'Site web', 'url'],
];
export const COACH_COUNTS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10+'];
export const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
export const PERIODS: PriceDraft['period'][] = ['saison', 'mois', 'trimestre', 'séance'];
export const AIDS = ["Pass'Sport", 'Chèques ANCV', 'Coupons sport', 'Aide mairie ou CAF', 'Autre'];
export const MEDIA_BUCKET = 'club-media';
// Mêmes limites que le bucket Supabase (voir drizzle/migrations/0038_security_hardening.sql).
export const MEDIA_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
export const MEDIA_MAX_BYTES = 5 * 1024 * 1024;

export type ClubRow = Record<string, unknown> & { id: string; name: string; city: string | null; discipline: string; federation_code: string };
