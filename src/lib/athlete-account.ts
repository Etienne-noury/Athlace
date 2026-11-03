import { normalizeText, type CityHit } from '@/lib/api/geo-search';
export const cityFavoriteKey = (city: Pick<CityHit, 'name' | 'postcode'>) => `${city.postcode}:${normalizeText(city.name)}`;
export const citySearchUrl = (city: string) => `/clubs/?${new URLSearchParams({ q: city })}`;
export const sportSearchUrl = (sport: string) => `/clubs/?${new URLSearchParams({ discipline: sport })}`;
export const EMPTY_ALERTS = { new_club_city: false, new_club_sport: false, favorite_club_news: false };
export type AlertKey = keyof typeof EMPTY_ALERTS;
export const ALERT_OPTIONS: { key: AlertKey; label: string }[] = [
  { key: 'new_club_city', label: 'Nouveau club dans une de mes villes favorites' },
  { key: 'new_club_sport', label: 'Nouveau club dans un de mes sports favoris' },
  { key: 'favorite_club_news', label: 'Actualités et événements de mes clubs favoris' },
];