import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ChevronDown, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { isFilled, prefillFromClub, type ClubPayload } from '@/lib/club-form';

const FIELDS: [keyof ClubPayload, string][] = [
  ['affiliation_number', "N° d'affiliation"], ['logo', 'Logo'], ['color_1', 'Couleur principale'], ['color_2', 'Couleur secondaire'],
  ['photos', 'Photos'], ['video_url', 'Vidéo'], ['description', 'Description'], ['creation_date', 'Date de création'],
  ['sub_disciplines', 'Sous-disciplines'], ['sub_other', 'Autre sous-discipline'], ['audiences', 'Publics'],
  ['age_categories', "Catégories d'âge"], ['practice_level', 'Type de pratique'], ['league', 'Ligue ou division'],
  ['beginners_ok', 'Débutants acceptés'], ['min_age', 'Âge minimum'], ['max_age', 'Âge maximum'],
  ['required_level', 'Niveau requis'], ['health_certificate', 'Certificat / questionnaire santé'],
  ['other_conditions', 'Autres conditions'], ['trial', "Séance d'essai"], ['trial_sessions', 'Séances gratuites'],
  ['registration_start', 'Début inscriptions'], ['registration_end', 'Fin inscriptions'], ['season_start', 'Reprise'],
  ['waitlist', "Liste d'attente"], ['installments', 'Paiement en plusieurs fois'], ['aids', 'Aides acceptées'],
  ['documents', 'Pièces à fournir'], ['registration_url', "Lien d'inscription"], ['coaches_certified', 'Encadrants diplômés'],
  ['labels', 'Labels'], ['ambiance', 'Ambiance (0-100)'], ['amenities', 'Équipements'], ['pmr', 'Accessibilité PMR'],
  ['events', 'Événements annuels'], ['volunteers', 'Cherche des bénévoles'], ['email', 'Email'], ['phone', 'Téléphone'],
  ['website', 'Site web'], ['instagram_url', 'Instagram'], ['facebook_url', 'Facebook'], ['tiktok_url', 'TikTok'],
  ['youtube_url', 'YouTube'], ['linkedin_url', 'LinkedIn'],
];

const fmt = (v: unknown): string => {
  if (!isFilled(v)) return '-';
  if (v === true) return 'Oui';
  if (v === false) return 'Non';
  if (Array.isArray(v)) {
    return v.map((x) => (x && typeof x === 'object' ? Object.values(x).filter((y) => y !== '' && y !== null).map(fmt).join(' · ') : String(x))).join(' ; ');
  }
  return String(v);
};
const norm = (v: unknown) => (isFilled(v) ? JSON.stringify(Array.isArray(v) ? [...v].map((x) => JSON.stringify(x)).sort() : v) : '');

interface Submission {
  id: string; club_id: string | null; role: string | null; affiliation_match: boolean;
  submitted_at: string | null; payload: ClubPayload;
}

function AffBadge({ ok }: { ok: boolean }) {
  return ok ? (
    <span className="rounded-pill bg-secondary px-2.5 py-0.5 text-micro font-bold text-secondary-foreground">Affiliation vérifiée</span>
  ) : (
    <span className="rounded-pill border border-destructive px-2.5 py-0.5 text-micro font-bold text-destructive">À vérifier</span>
  );
}

/* ---------- Fiches envoyées ---------- */

function SubmissionsList() {
  const qc = useQueryClient();
  const [openId, setOpenId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-submissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('club_submissions')
        .select('id, club_id, role, affiliation_match, submitted_at, payload')
        .eq('status', 'submitted')
        .order('submitted_at', { ascending: false });
      if (error) throw error;
      const subs = (data ?? []) as unknown as Submission[];
      const ids = subs.map((s) => s.club_id).filter(Boolean) as string[];
      const names = new Map<string, string>();
      if (ids.length) {
        const { data: cl } = await supabase.from('clubs_public').select('id, name').in('id', ids);
        for (const c of cl ?? []) names.set(c.id as string, c.name as string);
      }
      return subs.map((s) => ({ ...s, clubName: (s.club_id && names.get(s.club_id)) || s.payload?.new_club?.name || 'Club sans nom', isNew: !s.club_id }));
    },
  });

  if (isLoading) return <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />;
  if (!data?.length) return <p className="text-small text-nuit/70">Aucune fiche en attente.</p>;

  return (
    <div className="space-y-3">
      {data.map((s) => (
        <div key={s.id} className="rounded-2xl border bg-blanc">
          <button type="button" onClick={() => setOpenId(openId === s.id ? null : s.id)}
            className="flex w-full flex-wrap items-center gap-3 p-4 text-left" aria-expanded={openId === s.id}>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-nuit">
                {s.clubName}
                {s.isNew && <span className="ml-2 rounded-pill bg-creme px-2 py-0.5 text-micro text-bleu-athlace">Nouveau club</span>}
              </p>
              <p className="text-small text-nuit/70">
                <span className="capitalize">{s.role ?? '-'}</span> · envoyée le{' '}
                {s.submitted_at ? new Date(s.submitted_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
              </p>
            </div>
            <AffBadge ok={s.affiliation_match} />
            <ChevronDown className={cn('h-4 w-4 text-nuit/70 transition-transform', openId === s.id && 'rotate-180')} />
          </button>
          {openId === s.id && (
            <SubmissionDetail sub={s} onDone={() => { setOpenId(null); qc.invalidateQueries({ queryKey: ['admin-submissions'] }); }} />
          )}
        </div>
      ))}
    </div>
  );
}

function SubmissionDetail({ sub, onDone }: { sub: Submission; onDone: () => void }) {
  const qc = useQueryClient();
  const [showSame, setShowSame] = useState(false);
  const [busy, setBusy] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [note, setNote] = useState('');
  const p = sub.payload ?? {};

  const { data: current = {}, isLoading } = useQuery({
    queryKey: ['admin-submission-current', sub.club_id],
    enabled: !!sub.club_id,
    queryFn: async (): Promise<ClubPayload> => {
      const id = sub.club_id!;
      const [club, contact, venues, schedules, prices] = await Promise.all([
        supabase.from('clubs_public').select('*').eq('id', id).maybeSingle(),
        supabase.rpc('get_club_contact', { p_club_id: id }),
        supabase.from('club_venues').select('*').eq('club_id', id),
        supabase.from('club_schedules').select('*').eq('club_id', id),
        supabase.from('club_prices').select('*').eq('club_id', id),
      ]);
      if (!club.data) return {};
      return prefillFromClub(
        club.data as Record<string, unknown>, Array.isArray(contact.data) ? contact.data[0] ?? null : null,
        (venues.data ?? []) as Record<string, unknown>[], (schedules.data ?? []) as Record<string, unknown>[],
        (prices.data ?? []) as Record<string, unknown>[],
      );
    },
  });

  const { data: answers = { cur: {}, labels: {} } } = useQuery({
    queryKey: ['admin-submission-answers', sub.club_id],
    queryFn: async () => {
      const [{ data: qs }, { data: cur }] = await Promise.all([
        supabase.from('sport_questions').select('key, label'),
        sub.club_id ? supabase.from('club_sport_answers').select('question_key, value').eq('club_id', sub.club_id) : Promise.resolve({ data: [] }),
      ]);
      const labels: Record<string, string> = {};
      for (const q of qs ?? []) labels[q.key] = q.label;
      const c: Record<string, string> = {};
      for (const a of (cur ?? []) as { question_key: string; value: string | null }[]) c[a.question_key] = a.value ?? '';
      return { cur: c, labels };
    },
  });

  const rows: { key: string; label: string; cur: unknown; next: unknown }[] = [
    ...FIELDS.map(([k, l]) => ({ key: k, label: l, cur: (current as ClubPayload)[k], next: p[k] })),
    { key: 'venues', label: 'Lieux', cur: current.venues, next: p.venues },
    { key: 'schedules', label: 'Créneaux', cur: current.schedules, next: p.schedules },
    { key: 'prices', label: 'Tarifs', cur: current.prices, next: p.prices },
    ...Object.entries(p.sport_answers ?? {}).map(([k, v]) => ({
      key: `sport:${k}`, label: `Sport · ${answers.labels[k] ?? k}`, cur: answers.cur[k], next: v,
    })),
  ].filter((r) => isFilled(r.cur) || isFilled(r.next));
  const changed = rows.filter((r) => isFilled(r.next) && norm(r.cur) !== norm(r.next) && !(typeof r.cur === 'string' && fmt(r.cur) === fmt(r.next)));
  const same = rows.filter((r) => !changed.includes(r));

  const approve = async () => {
    setBusy(true);
    const { error } = await supabase.rpc('approve_submission', { submission_id: sub.id });
    setBusy(false);
    if (error) { toast({ title: 'Validation impossible', description: error.message, variant: 'destructive' }); return; }
    toast({ title: 'Fiche validée', description: 'Les informations du club sont mises à jour.' });
    qc.invalidateQueries({ queryKey: ['available-disciplines'] });
    qc.invalidateQueries({ queryKey: ['site-stats'] });
    onDone();
  };
  const reject = async () => {
    if (!note.trim()) return;
    setBusy(true);
    const { error } = await supabase.rpc('reject_submission', { submission_id: sub.id, note: note.trim() });
    setBusy(false);
    if (error) { toast({ title: 'Refus impossible', description: error.message, variant: 'destructive' }); return; }
    toast({ title: 'Fiche refusée' });
    setRejectOpen(false);
    onDone();
  };

  const Row = ({ r, hl }: { r: (typeof rows)[number]; hl: boolean }) => (
    <div className={cn('grid gap-2 px-4 py-3 text-small sm:grid-cols-[180px_1fr_1fr]', hl && 'bg-creme')}>
      <p className="font-bold text-nuit">{r.label}</p>
      <p className="break-all text-nuit/70">{fmt(r.cur)}</p>
      <p className={cn('break-words', hl ? 'font-bold text-bleu-athlace' : 'text-nuit/70')}>{fmt(r.next)}</p>
    </div>
  );

  return (
    <div className="space-y-4 border-t p-4">
      {isLoading ? <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /> : (
        <div className="overflow-hidden rounded-xl border bg-background">
          <div className="hidden grid-cols-[180px_1fr_1fr] gap-2 border-b px-4 py-2 text-micro font-bold uppercase text-nuit/70 sm:grid">
            <span>Champ</span><span>Donnée actuelle (fédération)</span><span>Proposé par le club</span>
          </div>
          {changed.length === 0 && <p className="px-4 py-3 text-small text-nuit/70">Aucune modification proposée.</p>}
          <div className="divide-y">{changed.map((r) => <Row key={r.key} r={r} hl />)}</div>
          {same.length > 0 && (
            <>
              <button type="button" onClick={() => setShowSame(!showSame)} aria-expanded={showSame}
                className="flex w-full items-center gap-2 border-t px-4 py-2 text-small text-bleu-athlace">
                <ChevronDown className={cn('h-4 w-4 transition-transform', showSame && 'rotate-180')} />
                {same.length} champ{same.length > 1 ? 's' : ''} identique{same.length > 1 ? 's' : ''}
              </button>
              {showSame && <div className="divide-y border-t">{same.map((r) => <Row key={r.key} r={r} hl={false} />)}</div>}
            </>
          )}
        </div>
      )}
      <div className="flex flex-wrap justify-end gap-2">
        <Button variant="outline" onClick={() => setRejectOpen(true)} disabled={busy}>Refuser</Button>
        <Button onClick={approve} disabled={busy}>{busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Valider</Button>
      </div>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Refuser la fiche</DialogTitle></DialogHeader>
          <Textarea rows={4} placeholder="Motif du refus (visible par le club)" value={note} onChange={(e) => setNote(e.target.value)} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>Annuler</Button>
            <Button onClick={reject} disabled={!note.trim() || busy}>Refuser</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ---------- Conflits ---------- */

interface Conflict { id: string; club_id: string; field: string; club_value: string | null; federation_value: string | null }

function ConflictsList() {
  const qc = useQueryClient();
  const [busy, setBusy] = useState<string | null>(null);
  const { data, isLoading } = useQuery({
    queryKey: ['admin-conflicts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('club_field_status')
        .select('id, club_id, field, club_value, federation_value')
        .eq('conflict', true)
        .order('updated_at', { ascending: false });
      if (error) throw error;
      const rows = (data ?? []) as Conflict[];
      const ids = [...new Set(rows.map((r) => r.club_id))];
      const names = new Map<string, string>();
      for (let i = 0; i < ids.length; i += 200) {
        const { data: cl } = await supabase.from('clubs_public').select('id, name').in('id', ids.slice(i, i + 200));
        for (const c of cl ?? []) names.set(c.id as string, c.name as string);
      }
      return rows.map((r) => ({ ...r, clubName: names.get(r.club_id) ?? r.club_id }));
    },
  });

  const keep = async (id: string) => {
    setBusy(id);
    const { error } = await supabase.from('club_field_status').update({ conflict: false }).eq('id', id);
    setBusy(null);
    if (error) toast({ title: 'Action impossible', description: error.message, variant: 'destructive' });
    qc.invalidateQueries({ queryKey: ['admin-conflicts'] });
  };
  const takeFed = async (id: string) => {
    setBusy(id);
    const { error } = await supabase.rpc('accept_federation_value', { status_id: id });
    setBusy(null);
    if (error) toast({ title: 'Action impossible', description: error.message, variant: 'destructive' });
    qc.invalidateQueries({ queryKey: ['admin-conflicts'] });
  };

  if (isLoading) return <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />;
  if (!data?.length) return <p className="text-small text-nuit/70">Aucun conflit.</p>;

  return (
    <div className="divide-y rounded-2xl border bg-blanc">
      {data.map((c) => (
        <div key={c.id} className="space-y-3 p-4">
          <p className="font-bold text-nuit">{c.clubName} <span className="font-light text-nuit/70">· {c.field}</span></p>
          <div className="grid gap-2 text-small sm:grid-cols-2">
            <div className="rounded-xl bg-background p-3">
              <p className="text-micro font-bold uppercase text-nuit/70">Valeur du club</p>
              <p className="break-words text-nuit">{c.club_value ?? '-'}</p>
            </div>
            <div className="rounded-xl bg-creme p-3">
              <p className="text-micro font-bold uppercase text-nuit/70">Nouvelle valeur fédération</p>
              <p className="break-words font-bold text-bleu-athlace">{c.federation_value ?? '-'}</p>
            </div>
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="outline" size="sm" disabled={busy === c.id} onClick={() => keep(c.id)}>Garder la valeur du club</Button>
            <Button size="sm" disabled={busy === c.id} onClick={() => takeFed(c.id)}>Prendre la valeur fédération</Button>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ClubSubmissionsAdmin() {
  const [view, setView] = useState<'submissions' | 'conflicts'>('submissions');
  return (
    <section className="space-y-6">
      <div className="space-y-1">
        <h2 className="font-sans text-2xl font-black text-nuit">Fiches clubs</h2>
        <p className="text-small text-nuit/70">Fiches envoyées par les clubs et conflits avec les nouvelles données des fédérations.</p>
      </div>
      <div className="flex gap-2" role="tablist">
        {([['submissions', 'Fiches envoyées'], ['conflicts', 'Conflits']] as const).map(([v, l]) => (
          <button key={v} type="button" role="tab" aria-selected={view === v} onClick={() => setView(v)}
            className={cn('rounded-pill px-4 py-1.5 text-small font-bold',
              view === v ? 'bg-primary text-primary-foreground' : 'bg-creme text-bleu-athlace')}>
            {l}
          </button>
        ))}
      </div>
      {view === 'submissions' ? <SubmissionsList /> : <ConflictsList />}
    </section>
  );
}
