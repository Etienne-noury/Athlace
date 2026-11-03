import { describe, expect, it } from 'vitest';
import { cityFavoriteKey, citySearchUrl, sportSearchUrl, EMPTY_ALERTS } from './athlete-account';
describe('Espace sportif', () => {
  it('relie une ville au paramètre q', () => expect(new URL(citySearchUrl('Saint-Étienne'), 'https://athlace.fr').searchParams.get('q')).toBe('Saint-Étienne'));
  it('relie un sport au filtre discipline', () => expect(sportSearchUrl('hockey')).toBe('/clubs/?discipline=hockey'));
  it('distingue les communes homonymes', () => expect(cityFavoriteKey({ name: 'Saint-Denis', postcode: '93200' })).not.toBe(cityFavoriteKey({ name: 'Saint-Denis', postcode: '97400' })));
  it('déduplique les variantes de casse et accents', () => expect(cityFavoriteKey({ name: 'SAINT-ÉTIENNE', postcode: '42000' })).toBe(cityFavoriteKey({ name: 'Saint-Etienne', postcode: '42000' })));
  it('les alertes sont désactivées par défaut', () => expect(EMPTY_ALERTS).toEqual({ new_club_city: false, new_club_sport: false, favorite_club_news: false }));
});