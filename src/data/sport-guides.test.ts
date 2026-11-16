import { describe, expect, it } from 'vitest';
import { disciplines } from './disciplines';
import { DISCIPLINE_GUIDES, SPORT_GUIDES } from './sport-guides';
import { safeExternalUrl } from '@/lib/safe-url';

describe('fiches sport', () => {
  const sportIds = disciplines.filter((d) => !d.parentId).map((d) => d.id);
  const subIds = disciplines.filter((d) => d.parentId).map((d) => d.id);

  it('couvre chaque sport et chaque sous-discipline de l’arborescence', () => {
    expect(sportIds.filter((id) => !SPORT_GUIDES[id])).toEqual([]);
    expect(subIds.filter((id) => !DISCIPLINE_GUIDES[id])).toEqual([]);
  });

  it('ne contient aucune fiche orpheline', () => {
    expect(Object.keys(SPORT_GUIDES).filter((id) => !sportIds.includes(id))).toEqual([]);
    expect(Object.keys(DISCIPLINE_GUIDES).filter((id) => !subIds.includes(id))).toEqual([]);
  });

  it('cite au moins une source valide par sport', () => {
    const sansSource = Object.entries(SPORT_GUIDES)
      .filter(([, g]) => !g.sources.some((s) => safeExternalUrl(s.url)))
      .map(([id]) => id);
    expect(sansSource).toEqual([]);
  });

  it('n’affiche aucun montant en euros', () => {
    const avecMontant = Object.entries(SPORT_GUIDES)
      .filter(([, g]) => /\d+\s?(€|euros?)/i.test(JSON.stringify(g)))
      .map(([id]) => id);
    expect(avecMontant).toEqual([]);
  });
});
