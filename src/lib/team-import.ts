import Papa from 'papaparse';
import { newTeam, type PriceDraft, type TeamDraft } from '@/lib/club-form';

/**
 * Import des équipes par fichier (modèle CSV ouvert dans Excel) : une ligne par créneau, les lignes qui
 * portent le même nom d'équipe (ou, sans nom, le même genre et la même catégorie) forment une seule équipe.
 */
export const TEAM_COLUMNS = [
  "Nom de l'équipe", 'Sous-discipline', 'Genre', 'Catégorie', 'Niveau', 'Division', 'Âge min', 'Âge max', 'Débutants acceptés',
  'Jour', 'Heure de début', 'Heure de fin', 'Lieu', 'Tarif (€)', 'Période du tarif', 'Libellé du tarif',
  "Nombre d'encadrants", "Type d'encadrants",
] as const;

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const PERIODS: PriceDraft['period'][] = ['saison', 'mois', 'trimestre', 'séance'];

const norm = (s: unknown) => String(s ?? '').trim();
const key = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9+]/g, '');

const yes = (s: string): boolean | null => {
  const k = key(s);
  if (!k) return null;
  if (['oui', 'o', 'yes', 'x', '1', 'vrai'].includes(k)) return true;
  if (['non', 'n', 'no', '0', 'faux'].includes(k)) return false;
  return null;
};

const gender = (s: string) => {
  const k = key(s);
  if (!k) return '';
  if (k.startsWith('h') || k.startsWith('masc') || k === 'garcons') return 'Hommes';
  if (k.startsWith('f') || k === 'filles') return 'Femmes';
  if (k.startsWith('mix')) return 'Mixte';
  return norm(s);
};

const level = (s: string): TeamDraft['level'] => {
  const k = key(s);
  if (k.startsWith('loisir')) return 'loisir';
  if (k.startsWith('compet')) return 'competition';
  if (k.includes('deux') || k.includes('both')) return 'les_deux';
  return '';
};

const day = (s: string) => DAYS.find((d) => key(d) === key(s) || key(d).slice(0, 3) === key(s).slice(0, 3)) ?? '';

/** « 18h », « 18h30 », « 18:30 », « 1830 » ou une heure Excel (0,75) → « 18:30 ». */
export const time = (s: string): string => {
  const v = norm(s).toLowerCase().replace(',', '.');
  if (!v) return '';
  if (/^0?\.\d+$/.test(v)) {
    const mins = Math.round(Number(v) * 24 * 60);
    return `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`;
  }
  const m = v.match(/^(\d{1,2})\s*[h:.]?\s*(\d{2})?/);
  if (!m) return '';
  const h = Number(m[1]);
  const min = Number(m[2] ?? 0);
  if (h > 23 || min > 59) return '';
  return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
};

const period = (s: string): PriceDraft['period'] => PERIODS.find((x) => key(x) === key(s)) ?? 'saison';
const amount = (s: string) => {
  const v = norm(s).replace(/[€\s]/g, '').replace(',', '.');
  return v && !Number.isNaN(Number(v)) ? v : '';
};

/** Modèle à télécharger : en-têtes + deux lignes d'exemple adaptées au sport. Séparateur « ; » et BOM pour Excel. */
export function teamTemplateCsv(categories: string[]): string {
  const [c1 = 'Catégorie 1', c2 = 'Catégorie 2'] = categories;
  const rows = [
    [...TEAM_COLUMNS],
    [`${c1} A`, '', 'Mixte', c1, 'Loisir', '', '', '', 'oui', 'Mercredi', '14:00', '15:30', 'Gymnase municipal', '120', 'saison', 'Cotisation annuelle', '2', 'Bénévole'],
    [`${c1} A`, '', 'Mixte', c1, 'Loisir', '', '', '', 'oui', 'Samedi', '10:00', '11:30', 'Gymnase municipal', '', '', '', '', ''],
    [`${c2} filles`, '', 'Femmes', c2, 'Compétition', '', '', '', 'non', 'Mardi', '18:00', '19:30', 'Stade', '150', 'saison', 'Cotisation annuelle', '1', 'Diplômé'],
  ];
  return '\uFEFF' + Papa.unparse(rows, { delimiter: ';' });
}

export interface TeamImportResult { teams: TeamDraft[]; errors: string[]; rows: number }

export function parseTeamsCsv(text: string): TeamImportResult {
  const parsed = Papa.parse<Record<string, string>>(text.replace(/^\uFEFF/, ''), { header: true, skipEmptyLines: 'greedy', delimiter: '' });
  const errors: string[] = parsed.errors.slice(0, 3).map((e) => `Ligne ${(e.row ?? 0) + 2} : ${e.message}`);
  // Retrouve chaque colonne attendue quelle que soit la casse ou les accents des en-têtes.
  const fields = parsed.meta.fields ?? [];
  const col = (name: string) => fields.find((f) => key(f) === key(name)) ?? name;
  const get = (r: Record<string, string>, name: (typeof TEAM_COLUMNS)[number]) => norm(r[col(name)]);
  if (!fields.some((f) => key(f) === key('Catégorie')) && !fields.some((f) => key(f) === key("Nom de l'équipe"))) {
    return { teams: [], errors: ["Colonnes introuvables : utilisez le modèle à télécharger (première ligne = noms de colonnes)."], rows: 0 };
  }

  const byKey = new Map<string, TeamDraft>();
  parsed.data.forEach((r, i) => {
    const name = get(r, "Nom de l'équipe");
    const g = gender(get(r, 'Genre'));
    const cat = get(r, 'Catégorie');
    const k = name ? `n:${key(name)}` : `c:${key(g)}|${key(cat)}`;
    if (!name && !cat) { errors.push(`Ligne ${i + 2} : ni nom d'équipe ni catégorie, ligne ignorée.`); return; }
    let t = byKey.get(k);
    if (!t) {
      t = { ...newTeam(), name, gender: g, categories: cat ? [cat] : [] };
      byKey.set(k, t);
    }
    const fill = <K extends keyof TeamDraft>(f: K, v: TeamDraft[K]) => { if (v && !t![f]) t![f] = v; };
    fill('sub_discipline', get(r, 'Sous-discipline'));
    if (!t.gender) t.gender = g;
    if (!t.categories.length && cat) t.categories = [cat];
    fill('level', level(get(r, 'Niveau')));
    fill('division', get(r, 'Division'));
    fill('min_age', get(r, 'Âge min').replace(/\D/g, ''));
    fill('max_age', get(r, 'Âge max').replace(/\D/g, ''));
    if (t.beginners_ok === null) t.beginners_ok = yes(get(r, 'Débutants acceptés'));
    const coaches = get(r, "Nombre d'encadrants");
    if (coaches && !t.coaches_count) t.coaches_count = Number(coaches) >= 10 ? '10+' : String(Number(coaches) || 0);
    const types = get(r, "Type d'encadrants").split(/[,/+]| et /).map((x) => x.trim()).filter(Boolean)
      .map((x) => (key(x).startsWith('dipl') ? 'Diplômé' : key(x).startsWith('ben') ? 'Bénévole' : x));
    for (const ty of types) if (!t.coach_types.includes(ty)) t.coach_types.push(ty);

    const venue = get(r, 'Lieu');
    if (venue && !t.venues.includes(venue)) t.venues.push(venue);
    const rawDay = get(r, 'Jour');
    if (rawDay) {
      const d = day(rawDay);
      if (!d) errors.push(`Ligne ${i + 2} : jour « ${rawDay} » non reconnu.`);
      else t.slots.push({ day: d, start_time: time(get(r, 'Heure de début')), end_time: time(get(r, 'Heure de fin')), venue });
    }
    const a = amount(get(r, 'Tarif (€)'));
    if (a) {
      const price: PriceDraft = { label: get(r, 'Libellé du tarif'), amount: a, period: period(get(r, 'Période du tarif')), includes_license: true };
      if (!t.prices.some((x) => x.amount === price.amount && x.period === price.period && x.label === price.label)) t.prices.push(price);
    }
  });
  return { teams: [...byKey.values()], errors, rows: parsed.data.length };
}
