import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { getParentDisciplines, getDisciplineById } from '@/data/disciplines';
import { eventFormSchema, eventSlug, eventDates, type SportEvent } from '@/lib/events';

const empty = { title: '', slug: '', description: '', start_date: '', end_date: '', city: '', address: '', latitude: '', longitude: '', sport_id: 'all', federation_code: '', organizer_name: '', is_athlace: false, external_url: '', image_url: '' };
type Draft = typeof empty & { id?: string };
const toDraft = (event: SportEvent): Draft => ({ ...event, end_date: event.end_date ?? '', address: event.address ?? '', latitude: event.latitude === null ? '' : String(event.latitude), longitude: event.longitude === null ? '' : String(event.longitude), federation_code: event.federation_code ?? '', external_url: event.external_url ?? '', image_url: event.image_url ?? '' });
const fields = [
  ['start_date', 'Date de début *', 'date'], ['end_date', 'Date de fin', 'date'],
  ['city', 'Ville *', 'text'], ['address', 'Adresse', 'text'],
  ['latitude', 'Latitude', 'number'], ['longitude', 'Longitude', 'number'],
  ['federation_code', 'Fédération (sigle)', 'text'], ['organizer_name', 'Organisateur *', 'text'],
  ['external_url', 'Lien d’inscription', 'text'], ['image_url', 'URL de l’image', 'text'],
] as const;

export function EventsAdmin() {
  const client = useQueryClient();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [deleting, setDeleting] = useState<SportEvent | null>(null);
  const [busy, setBusy] = useState(false);
  const events = useQuery({ queryKey: ['events', 'admin'], queryFn: async () => {
    const { data, error } = await supabase.from('events').select('*').order('start_date', { ascending: false });
    if (error) throw error;
    return data ?? [];
  } });
  const refresh = () => client.invalidateQueries({ queryKey: ['events'] });
  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft || busy) return;
    const parsed = eventFormSchema.safeParse(draft);
    if (!parsed.success) {
      toast({ title: 'Vérifiez le formulaire', description: parsed.error.issues.map((i) => `${i.path.join(' ')} : ${i.message}`).join(' · '), variant: 'destructive' });
      return;
    }
    setBusy(true);
    try {
      const row = { ...parsed.data, title: parsed.data.title ?? '', slug: parsed.data.slug ?? '', city: parsed.data.city ?? '', start_date: parsed.data.start_date ?? '', sport_id: parsed.data.sport_id ?? '', organizer_name: parsed.data.organizer_name ?? '' };
      const { error } = draft.id ? await supabase.from('events').update(row).eq('id', draft.id) : await supabase.from('events').insert(row);
      if (error) throw error;
      toast({ title: draft.id ? 'Événement modifié' : 'Événement créé' });
      setDraft(null);
      await refresh();
    } catch (error) { toast({ title: 'Enregistrement impossible', description: error instanceof Error ? error.message : 'Vérifiez les champs et l’unicité du slug.', variant: 'destructive' }); }
    finally { setBusy(false); }
  };
  const remove = async () => {
    if (!deleting || busy) return;
    setBusy(true);
    try {
      const { error } = await supabase.from('events').delete().eq('id', deleting.id);
      if (error) throw error;
      if (draft?.id === deleting.id) setDraft(null);
      setDeleting(null);
      toast({ title: 'Événement supprimé' });
      await refresh();
    } catch { toast({ title: 'Suppression impossible', variant: 'destructive' }); }
    finally { setBusy(false); }
  };
  return <section className="space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-4"><h2 className="text-2xl font-black">Événements</h2>{!draft && <Button onClick={() => setDraft({ ...empty })} className="gap-2"><Plus className="h-4 w-4" />Créer un événement</Button>}</div>
    {draft && <Card className="p-4 sm:p-6"><form onSubmit={save} className="space-y-4">
      <h3 className="text-xl font-bold">{draft.id ? 'Modifier l’événement' : 'Nouvel événement'}</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1 text-sm sm:col-span-2"><span>Titre *</span><Input required maxLength={200} value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value, slug: draft.id ? draft.slug : eventSlug(e.target.value) })} /></label>
        <label className="space-y-1 text-sm"><span>Slug *</span><Input required maxLength={200} pattern="[a-z0-9]+(-[a-z0-9]+)*" value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} /></label>
        <div className="space-y-1 text-sm"><label id="event-sport-label">Sport *</label><Select value={draft.sport_id} onValueChange={(v) => setDraft({ ...draft, sport_id: v })}><SelectTrigger aria-labelledby="event-sport-label"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all" disabled>Choisir un sport</SelectItem>{getParentDisciplines().map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent></Select></div>
        {fields.map(([key, label, type]) => <label key={key} className="space-y-1 text-sm"><span>{label}</span><Input type={type} step={type === 'number' ? 'any' : undefined} required={key === 'start_date' || key === 'city' || key === 'organizer_name'} maxLength={key.endsWith('_url') ? 2000 : key === 'address' ? 500 : 200} value={draft[key]} onChange={(e) => setDraft({ ...draft, [key]: e.target.value })} /></label>)}
        <label className="space-y-1 text-sm sm:col-span-2"><span>Description</span><Textarea rows={6} maxLength={20000} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></label>
        <label className="flex items-center gap-3 text-sm sm:col-span-2"><Switch checked={draft.is_athlace} onCheckedChange={(v) => setDraft({ ...draft, is_athlace: v })} />Événement organisé par Athlace</label>
      </div>
      <div className="flex flex-wrap gap-3"><Button type="submit" disabled={busy}>Enregistrer</Button><Button type="button" variant="outline" disabled={busy} onClick={() => setDraft(null)}>Annuler</Button></div>
    </form></Card>}
    {events.isLoading ? <p role="status">Chargement…</p> : events.isError ? <div role="alert" className="space-y-3"><p>Impossible de charger les événements.</p><Button variant="outline" onClick={() => events.refetch()}>Réessayer</Button></div> : !events.data?.length ? <p className="text-muted-foreground">Aucun événement enregistré.</p> : <div className="divide-y border-y border-border">{events.data.map((event) => <div key={event.id} className="flex flex-wrap items-center gap-4 py-4">
      <div className="min-w-0 flex-1"><h3 className="font-bold break-words">{event.title}</h3><p className="text-sm text-muted-foreground">{eventDates(event.start_date, event.end_date)} · {event.city} · {getDisciplineById(event.sport_id)?.name ?? event.sport_id}</p></div>
      <Button variant="outline" size="icon" aria-label={`Modifier ${event.title}`} title="Modifier" onClick={() => setDraft(toDraft(event))}><Pencil className="h-4 w-4" /></Button>
      <Button variant="outline" size="icon" aria-label={`Supprimer ${event.title}`} title="Supprimer" onClick={() => setDeleting(event)}><Trash2 className="h-4 w-4" /></Button>
    </div>)}</div>}
    <AlertDialog open={!!deleting} onOpenChange={(open) => { if (!open && !busy) setDeleting(null); }}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Supprimer cet événement ?</AlertDialogTitle><AlertDialogDescription>{deleting?.title} sera définitivement supprimé.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel disabled={busy}>Annuler</AlertDialogCancel><AlertDialogAction disabled={busy} onClick={(e) => { e.preventDefault(); void remove(); }}>Supprimer</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
  </section>;
}