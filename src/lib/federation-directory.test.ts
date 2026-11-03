import { describe, expect, it, vi } from 'vitest';
vi.mock('@/integrations/supabase/client', () => ({ supabase: {} }));
import { getFederationStats, getFederationSports, federationClubUrl, findFederationBySlug } from './federation-directory';
import { groupFederationsByArborescence, type FederationSportive } from './federations-officielles';

const fed = (sigle: string): FederationSportive => ({ id: sigle, sigle, nom: sigle, site_web: '', is_paralympique: false });

describe('federation directory rules', () => {
  it('keeps FFAAA and FFAB as separate federations of Aïkido', () => {
    const groups = groupFederationsByArborescence([fed('FFAAA'), fed('FFAB')], (f) => f.sigle);
    expect(groups[0].id).toBe('combat');
    expect(groups[0].sports[0].federations.map((f) => f.sigle)).toEqual(['FFAAA', 'FFAB']);
    expect(getFederationSports('FFAAA').map((s) => s.name)).toEqual(['Aïkido']);
  });
  it('counts clubs by federation code rather than a merged sport total', () => {
    const rows = [
      { federation_code: 'FFAAA', discipline: 'Aïkido', clubs: 12, subs: [] },
      { federation_code: 'FFAB', discipline: 'Aïkido', clubs: 7, subs: [] },
    ];
    expect(getFederationStats('FFAAA', rows).count).toBe(12);
    expect(getFederationStats('FFAB', rows).count).toBe(7);
  });
  it('does not miscount FFP parachuting clubs as polo clubs', () => {
    const rows = [
      { federation_code: 'FFP', discipline: 'Parachutisme', clubs: 147, subs: ['Soufflerie'] },
      { federation_code: 'FFPOLO', discipline: 'Polo', clubs: 31, subs: [] },
    ];
    // FFP is the official polo sigle; disambiguate its legacy import collision.
    expect(getFederationStats('FFP-PARA', rows).count).toBe(147);
    expect(getFederationStats('FFP', rows).count).toBe(178);
  });
  it('returns only this federation’s database sub-disciplines as dynamic links', () => {
    const stats = getFederationStats('FFESSM', [
      { federation_code: 'FFESSM', discipline: 'Études et sports sous-marins', clubs: 10, subs: ['Hockey', 'Plongée enfant'] },
      { federation_code: 'FFN', discipline: 'Natation', clubs: 20, subs: ['Water-polo'] },
    ]);
    expect(stats.disciplines).toEqual([{ name: 'Hockey', sportId: 'plongee-et-sports-sous-marins', id: 'plongee-et-sports-sous-marins--hockey' }]);
    expect(federationClubUrl(stats.disciplines[0].sportId, stats.disciplines[0].id)).toBe('/clubs/?discipline=plongee-et-sports-sous-marins&sous-discipline=plongee-et-sports-sous-marins--hockey');
  });
  it('returns zero clubs and no disciplines for an unavailable federation', () => {
    expect(getFederationStats('FFAAA', [])).toEqual({ count: 0, disciplines: [] });
  });
  it('resolves lowercase sigle slugs and rejects unknown slugs', () => {
    expect(findFederationBySlug([fed('FFAAA')], 'ffaaa')?.sigle).toBe('FFAAA');
    expect(findFederationBySlug([fed('FFAAA')], 'unknown')).toBeUndefined();
  });
});