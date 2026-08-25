// Régions, départements et villes françaises pour le hub SEO géo
export interface Region {
  slug: string;
  name: string;
  code: string;
}

export interface Department {
  slug: string;
  name: string;
  code: string;
  regionSlug: string;
}

export function findRegionBySlug(slug: string): Region | undefined {
  return REGIONS.find((r) => r.slug === slug);
}

export function findDepartmentByCode(code: string): Department | undefined {
  return DEPARTMENTS.find((d) => d.code === code);
}

export function findDepartmentsByRegionSlug(regionSlug: string): Department[] {
  return DEPARTMENTS.filter((d) => d.regionSlug === regionSlug);
}

/** Codes postaux à utiliser quand la colonne région des clubs n'est pas renseignée. */
export function getDepartmentCodesByRegionName(regionName: string): string[] {
  if (!regionName || regionName === 'all') return [];
  const region = REGIONS.find((item) => item.name === regionName);
  if (!region) return [];
  return DEPARTMENTS
    .filter((department) => department.regionSlug === region.slug)
    .flatMap((department) => {
      if (department.code === '2A') return ['200', '201'];
      if (department.code === '2B') return ['202', '206'];
      return [department.code];
    });
}



export const REGIONS: Region[] = [
  { slug: 'auvergne-rhone-alpes', name: 'Auvergne-Rhône-Alpes', code: '84' },
  { slug: 'bourgogne-franche-comte', name: 'Bourgogne-Franche-Comté', code: '27' },
  { slug: 'bretagne', name: 'Bretagne', code: '53' },
  { slug: 'centre-val-de-loire', name: 'Centre-Val de Loire', code: '24' },
  { slug: 'corse', name: 'Corse', code: '94' },
  { slug: 'grand-est', name: 'Grand Est', code: '44' },
  { slug: 'hauts-de-france', name: 'Hauts-de-France', code: '32' },
  { slug: 'ile-de-france', name: 'Île-de-France', code: '11' },
  { slug: 'normandie', name: 'Normandie', code: '28' },
  { slug: 'nouvelle-aquitaine', name: 'Nouvelle-Aquitaine', code: '75' },
  { slug: 'occitanie', name: 'Occitanie', code: '76' },
  { slug: 'pays-de-la-loire', name: 'Pays de la Loire', code: '52' },
  { slug: 'provence-alpes-cote-d-azur', name: 'Provence-Alpes-Côte d\'Azur', code: '93' },
  { slug: 'guadeloupe', name: 'Guadeloupe', code: '01' },
  { slug: 'martinique', name: 'Martinique', code: '02' },
  { slug: 'guyane', name: 'Guyane', code: '03' },
  { slug: 'la-reunion', name: 'La Réunion', code: '04' },
  { slug: 'mayotte', name: 'Mayotte', code: '06' },
];

export const DEPARTMENTS: Department[] = [
  { slug: 'ain', name: 'Ain', code: '01', regionSlug: 'auvergne-rhone-alpes' },
  { slug: 'allier', name: 'Allier', code: '03', regionSlug: 'auvergne-rhone-alpes' },
  { slug: 'ardeche', name: 'Ardèche', code: '07', regionSlug: 'auvergne-rhone-alpes' },
  { slug: 'cantal', name: 'Cantal', code: '15', regionSlug: 'auvergne-rhone-alpes' },
  { slug: 'drome', name: 'Drôme', code: '26', regionSlug: 'auvergne-rhone-alpes' },
  { slug: 'isere', name: 'Isère', code: '38', regionSlug: 'auvergne-rhone-alpes' },
  { slug: 'loire', name: 'Loire', code: '42', regionSlug: 'auvergne-rhone-alpes' },
  { slug: 'haute-loire', name: 'Haute-Loire', code: '43', regionSlug: 'auvergne-rhone-alpes' },
  { slug: 'puy-de-dome', name: 'Puy-de-Dôme', code: '63', regionSlug: 'auvergne-rhone-alpes' },
  { slug: 'rhone', name: 'Rhône', code: '69', regionSlug: 'auvergne-rhone-alpes' },
  { slug: 'savoie', name: 'Savoie', code: '73', regionSlug: 'auvergne-rhone-alpes' },
  { slug: 'haute-savoie', name: 'Haute-Savoie', code: '74', regionSlug: 'auvergne-rhone-alpes' },

  { slug: 'cote-d-or', name: 'Côte-d\'Or', code: '21', regionSlug: 'bourgogne-franche-comte' },
  { slug: 'doubs', name: 'Doubs', code: '25', regionSlug: 'bourgogne-franche-comte' },
  { slug: 'jura', name: 'Jura', code: '39', regionSlug: 'bourgogne-franche-comte' },
  { slug: 'nievre', name: 'Nièvre', code: '58', regionSlug: 'bourgogne-franche-comte' },
  { slug: 'haute-saone', name: 'Haute-Saône', code: '70', regionSlug: 'bourgogne-franche-comte' },
  { slug: 'saone-et-loire', name: 'Saône-et-Loire', code: '71', regionSlug: 'bourgogne-franche-comte' },
  { slug: 'yonne', name: 'Yonne', code: '89', regionSlug: 'bourgogne-franche-comte' },
  { slug: 'territoire-de-belfort', name: 'Territoire de Belfort', code: '90', regionSlug: 'bourgogne-franche-comte' },

  { slug: 'cotes-d-armor', name: 'Côtes-d\'Armor', code: '22', regionSlug: 'bretagne' },
  { slug: 'finistere', name: 'Finistère', code: '29', regionSlug: 'bretagne' },
  { slug: 'ille-et-vilaine', name: 'Ille-et-Vilaine', code: '35', regionSlug: 'bretagne' },
  { slug: 'morbihan', name: 'Morbihan', code: '56', regionSlug: 'bretagne' },

  { slug: 'cher', name: 'Cher', code: '18', regionSlug: 'centre-val-de-loire' },
  { slug: 'eure-et-loir', name: 'Eure-et-Loir', code: '28', regionSlug: 'centre-val-de-loire' },
  { slug: 'indre', name: 'Indre', code: '36', regionSlug: 'centre-val-de-loire' },
  { slug: 'indre-et-loire', name: 'Indre-et-Loire', code: '37', regionSlug: 'centre-val-de-loire' },
  { slug: 'loir-et-cher', name: 'Loir-et-Cher', code: '41', regionSlug: 'centre-val-de-loire' },
  { slug: 'loiret', name: 'Loiret', code: '45', regionSlug: 'centre-val-de-loire' },

  { slug: 'corse-du-sud', name: 'Corse-du-Sud', code: '2A', regionSlug: 'corse' },
  { slug: 'haute-corse', name: 'Haute-Corse', code: '2B', regionSlug: 'corse' },

  { slug: 'ardennes', name: 'Ardennes', code: '08', regionSlug: 'grand-est' },
  { slug: 'aube', name: 'Aube', code: '10', regionSlug: 'grand-est' },
  { slug: 'marne', name: 'Marne', code: '51', regionSlug: 'grand-est' },
  { slug: 'haute-marne', name: 'Haute-Marne', code: '52', regionSlug: 'grand-est' },
  { slug: 'meurthe-et-moselle', name: 'Meurthe-et-Moselle', code: '54', regionSlug: 'grand-est' },
  { slug: 'meuse', name: 'Meuse', code: '55', regionSlug: 'grand-est' },
  { slug: 'moselle', name: 'Moselle', code: '57', regionSlug: 'grand-est' },
  { slug: 'bas-rhin', name: 'Bas-Rhin', code: '67', regionSlug: 'grand-est' },
  { slug: 'haut-rhin', name: 'Haut-Rhin', code: '68', regionSlug: 'grand-est' },
  { slug: 'vosges', name: 'Vosges', code: '88', regionSlug: 'grand-est' },

  { slug: 'aisne', name: 'Aisne', code: '02', regionSlug: 'hauts-de-france' },
  { slug: 'nord', name: 'Nord', code: '59', regionSlug: 'hauts-de-france' },
  { slug: 'oise', name: 'Oise', code: '60', regionSlug: 'hauts-de-france' },
  { slug: 'pas-de-calais', name: 'Pas-de-Calais', code: '62', regionSlug: 'hauts-de-france' },
  { slug: 'somme', name: 'Somme', code: '80', regionSlug: 'hauts-de-france' },

  { slug: 'paris', name: 'Paris', code: '75', regionSlug: 'ile-de-france' },
  { slug: 'seine-et-marne', name: 'Seine-et-Marne', code: '77', regionSlug: 'ile-de-france' },
  { slug: 'yvelines', name: 'Yvelines', code: '78', regionSlug: 'ile-de-france' },
  { slug: 'essonne', name: 'Essonne', code: '91', regionSlug: 'ile-de-france' },
  { slug: 'hauts-de-seine', name: 'Hauts-de-Seine', code: '92', regionSlug: 'ile-de-france' },
  { slug: 'seine-saint-denis', name: 'Seine-Saint-Denis', code: '93', regionSlug: 'ile-de-france' },
  { slug: 'val-de-marne', name: 'Val-de-Marne', code: '94', regionSlug: 'ile-de-france' },
  { slug: 'val-d-oise', name: 'Val-d\'Oise', code: '95', regionSlug: 'ile-de-france' },

  { slug: 'calvados', name: 'Calvados', code: '14', regionSlug: 'normandie' },
  { slug: 'eure', name: 'Eure', code: '27', regionSlug: 'normandie' },
  { slug: 'manche', name: 'Manche', code: '50', regionSlug: 'normandie' },
  { slug: 'orne', name: 'Orne', code: '61', regionSlug: 'normandie' },
  { slug: 'seine-maritime', name: 'Seine-Maritime', code: '76', regionSlug: 'normandie' },

  { slug: 'charente', name: 'Charente', code: '16', regionSlug: 'nouvelle-aquitaine' },
  { slug: 'charente-maritime', name: 'Charente-Maritime', code: '17', regionSlug: 'nouvelle-aquitaine' },
  { slug: 'correze', name: 'Corrèze', code: '19', regionSlug: 'nouvelle-aquitaine' },
  { slug: 'creuse', name: 'Creuse', code: '23', regionSlug: 'nouvelle-aquitaine' },
  { slug: 'dordogne', name: 'Dordogne', code: '24', regionSlug: 'nouvelle-aquitaine' },
  { slug: 'gironde', name: 'Gironde', code: '33', regionSlug: 'nouvelle-aquitaine' },
  { slug: 'landes', name: 'Landes', code: '40', regionSlug: 'nouvelle-aquitaine' },
  { slug: 'lot-et-garonne', name: 'Lot-et-Garonne', code: '47', regionSlug: 'nouvelle-aquitaine' },
  { slug: 'pyrenees-atlantiques', name: 'Pyrénées-Atlantiques', code: '64', regionSlug: 'nouvelle-aquitaine' },
  { slug: 'deux-sevres', name: 'Deux-Sèvres', code: '79', regionSlug: 'nouvelle-aquitaine' },
  { slug: 'vienne', name: 'Vienne', code: '86', regionSlug: 'nouvelle-aquitaine' },
  { slug: 'haute-vienne', name: 'Haute-Vienne', code: '87', regionSlug: 'nouvelle-aquitaine' },

  { slug: 'ariege', name: 'Ariège', code: '09', regionSlug: 'occitanie' },
  { slug: 'aude', name: 'Aude', code: '11', regionSlug: 'occitanie' },
  { slug: 'aveyron', name: 'Aveyron', code: '12', regionSlug: 'occitanie' },
  { slug: 'gard', name: 'Gard', code: '30', regionSlug: 'occitanie' },
  { slug: 'haute-garonne', name: 'Haute-Garonne', code: '31', regionSlug: 'occitanie' },
  { slug: 'gers', name: 'Gers', code: '32', regionSlug: 'occitanie' },
  { slug: 'herault', name: 'Hérault', code: '34', regionSlug: 'occitanie' },
  { slug: 'lot', name: 'Lot', code: '46', regionSlug: 'occitanie' },
  { slug: 'lozere', name: 'Lozère', code: '48', regionSlug: 'occitanie' },
  { slug: 'hautes-pyrenees', name: 'Hautes-Pyrénées', code: '65', regionSlug: 'occitanie' },
  { slug: 'pyrenees-orientales', name: 'Pyrénées-Orientales', code: '66', regionSlug: 'occitanie' },
  { slug: 'tarn', name: 'Tarn', code: '81', regionSlug: 'occitanie' },
  { slug: 'tarn-et-garonne', name: 'Tarn-et-Garonne', code: '82', regionSlug: 'occitanie' },

  { slug: 'loire-atlantique', name: 'Loire-Atlantique', code: '44', regionSlug: 'pays-de-la-loire' },
  { slug: 'maine-et-loire', name: 'Maine-et-Loire', code: '49', regionSlug: 'pays-de-la-loire' },
  { slug: 'mayenne', name: 'Mayenne', code: '53', regionSlug: 'pays-de-la-loire' },
  { slug: 'sarthe', name: 'Sarthe', code: '72', regionSlug: 'pays-de-la-loire' },
  { slug: 'vendee', name: 'Vendée', code: '85', regionSlug: 'pays-de-la-loire' },

  { slug: 'alpes-de-haute-provence', name: 'Alpes-de-Haute-Provence', code: '04', regionSlug: 'provence-alpes-cote-d-azur' },
  { slug: 'hautes-alpes', name: 'Hautes-Alpes', code: '05', regionSlug: 'provence-alpes-cote-d-azur' },
  { slug: 'alpes-maritimes', name: 'Alpes-Maritimes', code: '06', regionSlug: 'provence-alpes-cote-d-azur' },
  { slug: 'bouches-du-rhone', name: 'Bouches-du-Rhône', code: '13', regionSlug: 'provence-alpes-cote-d-azur' },
  { slug: 'var', name: 'Var', code: '83', regionSlug: 'provence-alpes-cote-d-azur' },
  { slug: 'vaucluse', name: 'Vaucluse', code: '84', regionSlug: 'provence-alpes-cote-d-azur' },
  { slug: 'guadeloupe', name: 'Guadeloupe', code: '971', regionSlug: 'guadeloupe' },
  { slug: 'martinique', name: 'Martinique', code: '972', regionSlug: 'martinique' },
  { slug: 'guyane', name: 'Guyane', code: '973', regionSlug: 'guyane' },
  { slug: 'la-reunion', name: 'La Réunion', code: '974', regionSlug: 'la-reunion' },
  { slug: 'mayotte', name: 'Mayotte', code: '976', regionSlug: 'mayotte' },
];

export const PARIS_ARRONDISSEMENTS = Array.from({ length: 20 }, (_, i) => ({
  slug: `paris-${i + 1}`,
  name: `Paris ${i + 1}${i + 1 === 1 ? 'er' : 'e'}`,
}));

export function getRegionBySlug(slug: string): Region | undefined {
  return REGIONS.find((r) => r.slug === slug);
}

export function getDepartmentBySlug(slug: string): Department | undefined {
  return DEPARTMENTS.find((d) => d.slug === slug);
}

export function getDepartmentsByRegion(regionSlug: string): Department[] {
  return DEPARTMENTS.filter((d) => d.regionSlug === regionSlug);
}

export function getRegionByDepartmentCode(code: string): Region | undefined {
  const dept = DEPARTMENTS.find((d) => d.code === code);
  return dept ? REGIONS.find((r) => r.slug === dept.regionSlug) : undefined;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export function unslugify(slug: string): string {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
}
