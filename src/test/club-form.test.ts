import { describe, it, expect } from 'vitest';
import { completionPercent, step1Valid, COMPLETION_FIELDS } from '@/lib/club-form';

describe('questionnaire club', () => {
  it("l'étape 1 exige club, rôle et numéro d'affiliation", () => {
    expect(step1Valid({ club_id: 'x', role: 'président' })).toBe(false);
    expect(step1Valid({ club_id: 'x', role: 'président', affiliation_number: '123' })).toBe(true);
    expect(step1Valid({ new_club: { name: 'A', discipline: '', city: 'Nantes' }, role: 'autre', affiliation_number: '1' })).toBe(false);
  });

  it('la jauge compte aussi les questions du sport', () => {
    expect(completionPercent({})).toBe(0);
    const total = COMPLETION_FIELDS.length + 1 + 2;
    expect(completionPercent({ club_id: 'x', sport_answers: { a: true } }, ['a', 'b'])).toBe(Math.round((2 / total) * 100));
  });
});
