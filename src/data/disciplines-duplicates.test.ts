import { describe, expect, it } from 'vitest';
import { ARBORESCENCE, disciplines, isHiddenSubDiscipline, slugifyDiscipline } from '@/data/disciplines';

const sportNames = new Set(ARBORESCENCE.flatMap((c) => c.sports.map((s) => slugifyDiscipline(s.name))));

describe('arborescence sans doublon de sport', () => {
  it("aucune sous-discipline affichée ne porte le nom d'un autre sport (hors catégories multisports)", () => {
    const doublons = disciplines
      .filter((d) => d.parentId && d.category !== 'handicap' && slugifyDiscipline(d.name) !== d.parentId && sportNames.has(slugifyDiscipline(d.name)))
      .map((d) => d.id);
    expect(doublons).toEqual([]);
  });

  it('masque une sous-discipline importée qui est déjà un sport', () => {
    const rando = ARBORESCENCE.flatMap((c) => c.sports).find((s) => s.name === 'Randonnée pédestre')!;
    expect(isHiddenSubDiscipline(rando, 'Cyclotourisme', 'nature')).toBe(true);
    expect(isHiddenSubDiscipline(rando, 'Marche nordique', 'nature')).toBe(false);
  });

  it('garde les sports comme sous-disciplines des catégories multisports', () => {
    const handisport = ARBORESCENCE.flatMap((c) => c.sports).find((s) => s.name === 'Handisport')!;
    expect(isHiddenSubDiscipline(handisport, 'Natation', 'handicap')).toBe(false);
  });
});
