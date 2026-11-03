import { describe, it, expect } from 'vitest';
import { safeExternalUrl } from './safe-url';

describe('safeExternalUrl', () => {
  it('conserve un lien https valide', () => {
    expect(safeExternalUrl('https://club.fr/inscription')).toBe('https://club.fr/inscription');
  });

  it("complète un domaine sans protocole en https", () => {
    expect(safeExternalUrl('www.club.fr')).toBe('https://www.club.fr/');
  });

  it('refuse les schémas dangereux', () => {
    expect(safeExternalUrl('javascript:alert(1)')).toBeNull();
    expect(safeExternalUrl(' JavaScript:alert(1)')).toBeNull();
    expect(safeExternalUrl('data:text/html,<script>alert(1)</script>')).toBeNull();
  });

  it('renvoie null pour null ou une chaîne vide', () => {
    expect(safeExternalUrl(null)).toBeNull();
    expect(safeExternalUrl('   ')).toBeNull();
  });
});
