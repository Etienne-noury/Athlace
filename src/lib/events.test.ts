import { describe, expect, it } from 'vitest';
import { eventFormSchema, eventSlug, isUpcomingEvent, parisToday } from './events';

const draft = { slug: 'rencontre-sportive', title: 'Rencontre sportive', description: '', start_date: '2026-11-03', end_date: '', city: 'Paris', address: '', latitude: '', longitude: '', sport_id: 'football', federation_code: '', organizer_name: 'Organisateur', is_athlace: false, external_url: '', image_url: '' };
describe('Événements', () => {
  it('conserve les événements futurs sans date de fin', () => expect(isUpcomingEvent({ start_date: '2026-11-04', end_date: null }, '2026-11-03')).toBe(true));
  it('conserve les événements en cours jusqu’au dernier jour inclus', () => expect(isUpcomingEvent({ start_date: '2026-11-01', end_date: '2026-11-03' }, '2026-11-03')).toBe(true));
  it('exclut les événements terminés', () => expect(isUpcomingEvent({ start_date: '2026-11-01', end_date: '2026-11-02' }, '2026-11-03')).toBe(false));
  it('inclut les événements de la journée sans date de fin', () => expect(isUpcomingEvent({ start_date: '2026-11-03', end_date: null }, '2026-11-03')).toBe(true));
  it('utilise le jour français près de minuit UTC', () => expect(parisToday(new Date('2026-11-03T23:30:00Z'))).toBe('2026-11-04'));
  it('génère un slug depuis le titre', () => expect(eventSlug('Événement Athlace à Paris !')).toBe('evenement-athlace-a-paris'));
  it('rejette une fin antérieure au début', () => expect(eventFormSchema.safeParse({ ...draft, end_date: '2026-11-02' }).success).toBe(false));
  it('valide un événement Athlace sans inscription externe', () => expect(eventFormSchema.parse({ ...draft, is_athlace: true }).external_url).toBeNull());
  it('rejette les liens dangereux', () => expect(eventFormSchema.safeParse({ ...draft, external_url: 'javascript:alert(1)' }).success).toBe(false));
  it('rejette un identifiant qui n’est pas un sport', () => expect(eventFormSchema.safeParse({ ...draft, sport_id: 'football--inconnu' }).success).toBe(false));
  it('exige une paire de coordonnées', () => expect(eventFormSchema.safeParse({ ...draft, latitude: '48.85' }).success).toBe(false));
});