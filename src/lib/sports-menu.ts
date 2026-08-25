import { ARBORESCENCE, disciplines, slugifyDiscipline } from '@/data/disciplines';

export interface SportFamily {
  id: string;
  name: string;
  icon: string;
  sports: string[]; // discipline IDs
}

export const SPORT_FAMILIES: SportFamily[] = ARBORESCENCE.map((cat) => ({
  id: cat.id,
  name: cat.name,
  icon: cat.icon,
  sports: cat.sports.map((s) => slugifyDiscipline(s.name)),
}));

export function getFamilyById(id: string): SportFamily | undefined {
  return SPORT_FAMILIES.find((f) => f.id === id);
}

export function getSportsByFamily(familyId: string) {
  const family = getFamilyById(familyId);
  if (!family) return [];
  return disciplines.filter((d) => family.sports.includes(d.id));
}

export function getAllSports() {
  return disciplines.filter((d) => !d.parentId);
}

export function getSportById(id: string) {
  return disciplines.find((d) => d.id === id);
}

export function getDisciplineDisplayName(slug: string): string | undefined {
  const direct = disciplines.find((d) => d.id === slug);
  if (direct) return direct.name;
  const byName = disciplines.find((d) => slugifyDiscipline(d.name) === slug);
  return byName?.name;
}
