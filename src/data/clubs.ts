// Types et constantes des clubs.
// Les données proviennent désormais de l'API data.sports.gouv.fr
// (cf. src/lib/api/equipements.ts). Aucune donnée statique n'est exportée ici.

export interface Club {
  id: string;
  name: string;
  discipline: string;
  disciplineName: string;
  address: string;
  city: string;
  postalCode: string;
  region: string;
  phone: string;
  email: string;
  website?: string;
  logo?: string;
  level: 'loisir' | 'competition-regionale' | 'competition-nationale' | 'elite';
  licensePrice: {
    adult: number;
    child: number;
    senior?: number;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
  rating: number;
  reviewCount: number;
  description: string;
  schedule?: string[];
  amenities?: string[];
}

export const levels = {
  'loisir': { name: 'Loisir', color: 'bg-green-500', stars: 1 },
  'competition-regionale': { name: 'Compétition Régionale', color: 'bg-blue-500', stars: 2 },
  'competition-nationale': { name: 'Compétition Nationale', color: 'bg-orange-500', stars: 3 },
  'elite': { name: 'Élite', color: 'bg-accent', stars: 4 },
} as const;

export const regions = [
  'Île-de-France',
  'Auvergne-Rhône-Alpes',
  'Nouvelle-Aquitaine',
  'Occitanie',
  "Provence-Alpes-Côte d'Azur",
  'Hauts-de-France',
  'Grand Est',
  'Bretagne',
  'Pays de la Loire',
  'Normandie',
  'Bourgogne-Franche-Comté',
  'Centre-Val de Loire',
  'Corse',
  'Guadeloupe',
  'Martinique',
  'Guyane',
  'La Réunion',
  'Mayotte',
];
