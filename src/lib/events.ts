import { z } from 'zod';
import { getParentDisciplines, slugifyDiscipline } from '@/data/disciplines';
import { safeExternalUrl } from '@/lib/safe-url';
import type { Tables } from '@/integrations/supabase/types';

export type SportEvent = Tables<'events'>;
export const eventSlug = (title: string) => slugifyDiscipline(title).slice(0, 200).replace(/-+$/, '');
export function parisToday(now = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
  const value = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  return `${value('year')}-${value('month')}-${value('day')}`;
}
export const isUpcomingEvent = (event: Pick<SportEvent, 'start_date' | 'end_date'>, today = parisToday()) => (event.end_date ?? event.start_date) >= today;
export function eventDates(start: string, end: string | null) {
  const format = (date: string) => new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${date}T12:00:00`));
  return end && end !== start ? `${format(start)} - ${format(end)}` : format(start);
}
const optionalUrl = z.string().trim().max(2000).transform((v, ctx) => {
  if (!v) return null;
  const url = safeExternalUrl(v);
  if (!url) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Utilisez une adresse http ou https valide.' });
  return url;
});
const optionalCoordinate = (min: number, max: number) => z.string().trim().transform((v) => v === '' ? null : Number(v)).pipe(z.number().finite().min(min).max(max).nullable());
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((v) => {
  const parsed = new Date(`${v}T12:00:00Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === v;
}, 'Date invalide.');
export const eventFormSchema = z.object({
  slug: z.string().trim().min(1).max(200).regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(20000),
  start_date: date,
  end_date: z.union([z.literal(''), date]).transform((v) => v || null),
  city: z.string().trim().min(1).max(200),
  address: z.string().trim().max(500).transform((v) => v || null),
  latitude: optionalCoordinate(-90, 90), longitude: optionalCoordinate(-180, 180),
  sport_id: z.string().refine((id) => getParentDisciplines().some((sport) => sport.id === id), 'Choisissez un sport.'),
  federation_code: z.string().trim().max(50).transform((v) => v.toUpperCase() || null),
  organizer_name: z.string().trim().min(1).max(200),
  is_athlace: z.boolean(), external_url: optionalUrl, image_url: optionalUrl,
}).superRefine((event, ctx) => {
  if (event.end_date && event.end_date < event.start_date) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['end_date'], message: 'La fin doit être après le début.' });
  if ((event.latitude === null) !== (event.longitude === null)) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['latitude'], message: 'Renseignez les deux coordonnées ou aucune.' });
});