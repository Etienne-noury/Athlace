import { describe, expect, it } from 'vitest';
import { computeDisciplineAvailability } from '@/hooks/useAvailableDisciplines';
import { getDisciplineById, getDisciplineQueryNames, getSubDisciplineValue } from '@/data/disciplines';

describe('sous-disciplines issues de la base', () => {
  it('additionne toutes les clés des différents match et les trie par effectif', () => {
    const { sports } = computeDisciplineAvailability([
      { discipline: 'Hockey (sur gazon)', clubs: 8, subs: { 'Hockey en salle': 3, 'Hockey à 5': 2 } },
      { discipline: 'Hockey sur gazon', clubs: 7, subs: { 'Hockey en salle': 4, 'Hockey à 5': 1 } },
    ]);
    expect(sports['hockey-sur-gazon'].subList).toEqual([
      { name: 'Hockey en salle', count: 7 }, { name: 'Hockey à 5', count: 3 },
    ]);
  });

  it('exclut offers et handi et les clés sans club', () => {
    const { sports } = computeDisciplineAvailability([
      { discipline: 'Handball', clubs: 12, subs: { BabyHand: 8, ParaHand: 4, 'Handball à 7': 6, 'Autre': 0 } },
    ]);
    expect(sports.handball.subList).toEqual([{ name: 'Handball à 7', count: 6 }]);
  });

  it('résout un nouvel id vers le nom exact de la base', () => {
    const { sports } = computeDisciplineAvailability([
      { discipline: 'Tennis', clubs: 4, subs: { 'Tennis adapté à 4': 3 } },
    ]);
    expect(getSubDisciplineValue('tennis', 'tennis--tennis-adapte-a-4', sports)).toBe('Tennis adapté à 4');
    expect(getDisciplineById('tennis--tennis-adapte-a-4', sports)?.parentId).toBe('tennis');
    expect(getDisciplineQueryNames('tennis--tennis-adapte-a-4', sports)).toEqual(['Tennis']);
    expect(getSubDisciplineValue('handball', 'tennis--tennis-adapte-a-4', sports)).toBeNull();
  });

  it('préserve les anciens ids et ne devine pas les noms inconnus', () => {
    expect(getSubDisciplineValue('handball', 'handball--handball-a-7', {})).toBe('Handball à 7');
    expect(getSubDisciplineValue('handball', 'handball-a-7', {})).toBe('Handball à 7');
    expect(getSubDisciplineValue('tennis', 'tennis--inconnu', {})).toBeNull();
  });

  it('conserve les noms exacts des familles de Danse renvoyées par la RPC', () => {
    const { sports } = computeDisciplineAvailability([
      { discipline: 'Danse', clubs: 5, subs: { 'Rock’n’roll débutant': 4 } },
    ]);
    expect(getSubDisciplineValue('danse', 'danse--rock-n-roll-debutant', sports)).toBe('Rock’n’roll débutant');
  });
});