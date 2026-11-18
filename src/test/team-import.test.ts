import { describe, expect, it } from 'vitest';
import { parseTeamsCsv, teamTemplateCsv, time } from '@/lib/team-import';

describe('import des équipes', () => {
  it('relit son propre modèle : lignes groupées par équipe, créneaux et tarifs', () => {
    const { teams, errors } = parseTeamsCsv(teamTemplateCsv(['U8-U9', 'U10-U11']));
    expect(errors).toEqual([]);
    expect(teams).toHaveLength(2);
    expect(teams[0]).toMatchObject({ name: 'U8-U9 A', gender: 'Mixte', categories: ['U8-U9'], level: 'loisir', beginners_ok: true, coaches_count: '2', coach_types: ['Bénévole'] });
    expect(teams[0].slots.map((s) => s.day)).toEqual(['Mercredi', 'Samedi']);
    expect(teams[0].prices).toHaveLength(1);
    expect(teams[1]).toMatchObject({ gender: 'Femmes', level: 'competition', beginners_ok: false });
  });

  it('accepte des en-têtes sans accents, des heures « 18h30 » et regroupe sans nom par genre + catégorie', () => {
    const csv = 'Genre,Categorie,Jour,Heure de debut,Heure de fin\nF,U13,mar,18h30,20h\nF,U13,jeudi,18h30,20h\nH,U15,lundi,19,21';
    const { teams } = parseTeamsCsv(csv);
    expect(teams).toHaveLength(2);
    expect(teams[0].slots).toEqual([
      { day: 'Mardi', start_time: '18:30', end_time: '20:00', venue: '' },
      { day: 'Jeudi', start_time: '18:30', end_time: '20:00', venue: '' },
    ]);
    expect(teams[1].gender).toBe('Hommes');
  });

  it('signale un fichier sans les bonnes colonnes', () => {
    expect(parseTeamsCsv('a;b\n1;2').errors[0]).toMatch(/Colonnes introuvables/);
  });

  it('convertit les heures Excel', () => {
    expect(time('0,75')).toBe('18:00');
    expect(time('9h')).toBe('09:00');
    expect(time('25h')).toBe('');
  });
});
