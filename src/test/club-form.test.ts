import { describe, it, expect } from 'vitest';
import { completionPercent, clubIdentified, COMPLETION_FIELDS, flattenTeams, missingRequired, newTeam, teamsFromPrefill } from '@/lib/club-form';

describe('questionnaire club', () => {
  it("la page 1 n'exige que l'identification du club", () => {
    expect(clubIdentified({ club_id: 'x' })).toBe(true);
    expect(clubIdentified({ new_club: { name: 'A', discipline: '', city: 'Nantes' } })).toBe(false);
    expect(clubIdentified({ new_club: { name: 'A', discipline: 'Judo', city: 'Nantes' } })).toBe(true);
  });

  it("liste les champs obligatoires manquants (minimum + l'essentiel)", () => {
    expect(missingRequired({}).map((m) => m.page)).toEqual([1, 1, 2, 2, 3, 5]);
    const t = { ...newTeam(), slots: [{ day: 'Lundi', start_time: '18:00', end_time: '19:30', venue: 'Gymnase' }] };
    expect(missingRequired({
      club_id: 'x', email: 'a@b.fr', description: 'Club', venues: [{ name: 'Gymnase', address: '', is_main: true }], teams: [t], role: 'président',
    })).toEqual([]);
  });

  it('recopie les équipes dans les champs lus par la validation admin', () => {
    const t = { ...newTeam(), name: 'U11', sub_discipline: 'Futsal', categories: ['Moins de 12 ans'], level: 'competition' as const, division: 'D2',
      slots: [{ day: 'Mercredi', start_time: '14:00', end_time: '15:30', venue: 'Gymnase' }],
      prices: [{ label: 'Cotisation', amount: '120', period: 'saison' as const, includes_license: true }] };
    const flat = flattenTeams({ teams: [t] });
    expect(flat.schedules).toEqual([{ day: 'Mercredi', start_time: '14:00', end_time: '15:30', category: 'U11 · Moins de 12 ans', level: 'D2', venue: 'Gymnase' }]);
    expect(flat.prices?.[0].label).toBe('U11 · Cotisation');
    expect(flat.sub_disciplines).toEqual(['Futsal']);
    expect(flat.practice_level).toBe('competition');
  });

  it("regroupe les créneaux et tarifs de la fédération dans une première équipe", () => {
    const teams = teamsFromPrefill({ schedules: [{ day: 'Lundi', start_time: '18:00', end_time: '19:00', category: '', level: '', venue: 'Salle A' }] });
    expect(teams).toHaveLength(1);
    expect(teams[0].venues).toEqual(['Salle A']);
    expect(teamsFromPrefill({})).toEqual([]);
  });

  it('la jauge compte aussi les questions du sport', () => {
    expect(completionPercent({})).toBe(0);
    const total = COMPLETION_FIELDS.length + 1 + 2;
    expect(completionPercent({ club_id: 'x', sport_answers: { a: true } }, ['a', 'b'])).toBe(Math.round((2 / total) * 100));
  });
});
