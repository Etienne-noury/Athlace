// Client pour l'API Opendatasoft data.sports.gouv.fr
// Dataset: equipements-sportifs (~330k équipements en France)
import type { Club } from '@/data/clubs';
import { disciplines } from '@/data/disciplines';

const BASE_URL =
  'https://data.sports.gouv.fr/api/explore/v2.1/catalog/datasets/equipements-sportifs/records';

export interface ApiRecord {
  equip_numero: string;
  inst_numero?: string;
  inst_nom?: string | null;
  equip_nom?: string | null;
  equip_type_name?: string | null;
  inst_adresse?: string | null;
  inst_cp?: string | null;
  new_name?: string | null; // commune
  dep_nom?: string | null;
  reg_nom?: string | null;
  aps_name?: string[] | null;
  equip_coordonnees?: { lon: number; lat: number } | null;
  equip_sol?: string | null;
  equip_nature?: string | null;
  equip_eclair?: string | null;
  equip_douche?: string | null;
  equip_sanit?: string | null;
  equip_acces_handi_mobilite?: string | null;
  equip_ouv_public_bool?: string | null;
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

/** Map un record API vers la forme Club utilisée par l'UI. */
export function mapRecordToClub(r: ApiRecord): Club {
  const sports = r.aps_name ?? [];
  const mainSport = sports[0] ?? 'Multisport';
  const disciplineId =
    disciplines.find((d) => mainSport.toLowerCase().includes(d.name.toLowerCase()))?.id ??
    slugify(mainSport);

  const amenities: string[] = [];
  if (r.equip_sol) amenities.push(`Sol: ${r.equip_sol}`);
  if (r.equip_nature) amenities.push(r.equip_nature);
  if (r.equip_eclair === 'true') amenities.push('Éclairage');
  if (r.equip_douche === 'true') amenities.push('Douches');
  if (r.equip_sanit === 'true') amenities.push('Sanitaires');
  if (r.equip_acces_handi_mobilite === 'true') amenities.push('Accès PMR');
  if (r.equip_ouv_public_bool === 'true') amenities.push('Ouvert au public');

  return {
    id: r.equip_numero,
    name: r.inst_nom || r.equip_nom || 'Équipement sportif',
    discipline: disciplineId,
    disciplineName: mainSport,
    address: r.inst_adresse || '',
    city: r.new_name || '',
    postalCode: r.inst_cp || '',
    region: r.reg_nom || '',
    phone: '',
    email: '',
    coordinates: {
      lat: r.equip_coordonnees?.lat ?? 0,
      lng: r.equip_coordonnees?.lon ?? 0,
    },
    description:
      `${r.equip_type_name ?? 'Équipement sportif'}${
        sports.length ? ` — sports pratiqués : ${sports.join(', ')}.` : '.'
      }`,
    amenities,
  };
}

const SELECT_FIELDS = [
  'equip_numero',
  'inst_nom',
  'equip_nom',
  'equip_type_name',
  'inst_adresse',
  'inst_cp',
  'new_name',
  'dep_nom',
  'reg_nom',
  'aps_name',
  'equip_coordonnees',
  'equip_sol',
  'equip_nature',
  'equip_eclair',
  'equip_douche',
  'equip_sanit',
  'equip_acces_handi_mobilite',
  'equip_ouv_public_bool',
].join(',');

export interface FetchClubsParams {
  q?: string;
  discipline?: string; // discipline.id ou 'all'
  region?: string;
  limit?: number;
  withCoordsOnly?: boolean;
}

export async function fetchClubs(params: FetchClubsParams = {}): Promise<Club[]> {
  const { q, discipline, region, limit = 50, withCoordsOnly } = params;
  const where: string[] = [];

  if (q && q.trim()) {
    const safe = q.replace(/"/g, '\\"');
    where.push(`(search(inst_nom,"${safe}") OR search(new_name,"${safe}") OR inst_cp="${safe}")`);
  }
  if (discipline && discipline !== 'all') {
    const d = disciplines.find((x) => x.id === discipline);
    const term = d?.name ?? discipline;
    where.push(`search(aps_name,"${term.replace(/"/g, '\\"')}")`);
  }
  if (region && region !== 'all') {
    where.push(`reg_nom="${region.replace(/"/g, '\\"')}"`);
  }
  if (withCoordsOnly) where.push('equip_coordonnees IS NOT NULL');

  const url = new URL(BASE_URL);
  url.searchParams.set('limit', String(Math.min(limit, 100)));
  url.searchParams.set('select', SELECT_FIELDS);
  if (where.length) url.searchParams.set('where', where.join(' AND '));

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Erreur API (${res.status})`);
  const data: { results: ApiRecord[] } = await res.json();
  return data.results.map(mapRecordToClub);
}

export async function fetchClubById(id: string): Promise<Club | null> {
  const url = new URL(BASE_URL);
  url.searchParams.set('limit', '1');
  url.searchParams.set('select', SELECT_FIELDS);
  url.searchParams.set('where', `equip_numero="${id.replace(/"/g, '\\"')}"`);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Erreur API (${res.status})`);
  const data: { results: ApiRecord[] } = await res.json();
  return data.results[0] ? mapRecordToClub(data.results[0]) : null;
}
