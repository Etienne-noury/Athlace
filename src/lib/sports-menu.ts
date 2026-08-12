import { disciplines } from '@/data/disciplines';

export interface SportFamily {
  id: string;
  name: string;
  icon: string;
  sports: string[]; // discipline IDs
}

export const SPORT_FAMILIES: SportFamily[] = [
  {
    id: 'raquette',
    name: 'Sports de raquette',
    icon: '🏸',
    sports: ['badminton', 'tennis', 'tennis-de-table', 'squash', 'padel', 'beach-tennis'],
  },
  {
    id: 'collectifs',
    name: 'Sports collectifs',
    icon: '⚽',
    sports: ['football', 'basketball', 'volleyball', 'handball', 'rugby', 'futsal', 'beach-soccer', 'football-feminin'],
  },
  {
    id: 'individuels',
    name: 'Sports individuels',
    icon: '🏃',
    sports: ['course-a-pied', 'natation', 'yoga', 'golf', 'escalade', 'athletisme'],
  },
  {
    id: 'arts-martiaux',
    name: 'Arts martiaux',
    icon: '🥋',
    sports: ['judo', 'karate', 'boxe', 'boxe-anglaise', 'boxe-francaise', 'mma', 'taekwondo', 'aikido'],
  },
  {
    id: 'fitness',
    name: 'Fitness & bien-être',
    icon: '💪',
    sports: ['fitness', 'musculation', 'crossfit', 'pilates', 'zumba', 'aquagym'],
  },
];

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
  const byName = disciplines.find((d) => slugify(d.name) === slug);
  return byName?.name;
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

