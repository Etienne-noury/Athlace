import { supabase } from '@/integrations/supabase/client';

export interface FederationSportive {
  id: string;
  nom: string;
  sigle: string | null;
  categorie: string;
  site_web: string;
  is_paralympique: boolean;
}

export const FEDERATION_CATEGORIES: string[] = [
  'Sports collectifs',
  'Sports de raquette',
  'Sports aquatiques',
  'Arts martiaux & combat',
  'Sports nature & montagne',
  "Sports d'hiver & glisse",
  'Fitness, danse & force',
  'Sports mécaniques & aériens',
  'Sports de précision',
  'Sports traditionnels & régionaux',
  'Pêche',
  'Paralympiques',
];

export function slugifyFederation(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function fetchFederationsSportives(): Promise<FederationSportive[]> {
  const { data, error } = await supabase
    .from('federations_sportives')
    .select('id, nom, sigle, categorie, site_web, is_paralympique')
    .order('nom', { ascending: true });

  if (error) throw error;
  return (data ?? []) as FederationSportive[];
}

export async function fetchFederationsByCategorie(): Promise<Record<string, FederationSportive[]>> {
  const federations = await fetchFederationsSportives();
  const grouped: Record<string, FederationSportive[]> = {};

  for (const categorie of FEDERATION_CATEGORIES) grouped[categorie] = [];
  for (const fed of federations) {
    if (!grouped[fed.categorie]) grouped[fed.categorie] = [];
    grouped[fed.categorie].push(fed);
  }
  return grouped;
}
