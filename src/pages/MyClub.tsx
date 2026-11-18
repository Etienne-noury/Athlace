import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Plus, Trash2, Upload, CheckCircle2, Search, X, Pencil, AlertCircle } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { fetchAvailableDisciplines } from '@/hooks/useAvailableDisciplines';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  clubIdentified, completionPercent, flattenTeams, isFilled, missingRequired, newTeam, prefillFromClub, teamsFromPrefill,
  type ClubPayload, type PriceDraft, type TeamDraft, type TeamSlot, type VenueDraft,
} from '@/lib/club-form';

/* ---------- Constantes ---------- */

const STEPS = ['Votre club', 'Identité et description', 'Équipes et groupes', 'Spécificités du sport', 'Récapitulatif'];
const ROLES = ['président', 'secrétaire', 'trésorier', 'entraîneur', 'autre'];
const AUDIENCES = ['Enfants', 'Ados', 'Adultes', 'Seniors', 'Féminines', 'Handicap'];
const AGE_CATEGORIES = ['Baby (< 6 ans)', 'Moins de 8 ans', 'Moins de 10 ans', 'Moins de 12 ans', 'Moins de 14 ans', 'Moins de 16 ans', 'Moins de 18 ans', 'Seniors', 'Vétérans'];
const LEVELS = [
  { v: 'loisir', l: 'Loisir' }, { v: 'competition', l: 'Compétition' }, { v: 'les_deux', l: 'Les deux' },
] as const;
const REGISTRATION = [
  { v: 'ouvertes', l: 'Inscriptions ouvertes' }, { v: 'liste_attente', l: "Liste d'attente" }, { v: 'complet', l: 'Complet' },
] as const;
const CONTACT: [keyof ClubPayload, string, string][] = [
  ['email', 'Email', 'email'], ['phone', 'Téléphone', 'tel'], ['website', 'Site web', 'url'],
  ['instagram_url', 'Instagram', 'url'], ['facebook_url', 'Facebook', 'url'], ['tiktok_url', 'TikTok', 'url'],
  ['youtube_url', 'YouTube', 'url'], ['linkedin_url', 'LinkedIn', 'url'],
];
const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const PERIODS: PriceDraft['period'][] = ['saison', 'mois', 'trimestre', 'séance'];
const AIDS = ["Pass'Sport", 'Chèques ANCV', 'Coupons sport', 'Aide mairie ou CAF'];
const AMENITIES = ['Vestiaires', 'Douches', 'Parking', 'Club-house', 'Matériel en prêt'];
const MEDIA_BUCKET = 'club-media';
// Mêmes limites que le bucket Supabase (voir drizzle/migrations/0038_security_hardening.sql).
const MEDIA_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const MEDIA_MAX_BYTES = 5 * 1024 * 1024;

interface SportQuestion {
  id: string; key: string; label: string; help: string | null;
  type: 'text' | 'number' | 'boolean' | 'select' | 'multiselect';
  options: string[] | null; sort: number; federation_code: string | null;
}
type ClubRow = Record<string, unknown> & { id: string; name: string; city: string | null; discipline: string; federation_code: string };

/* ---------- Petits composants ---------- */

function StepCard({ step, percent, onGo, canLeaveFirst, saveState }: {
  step: number; percent: number; onGo: (n: number) => void; canLeaveFirst: boolean; saveState: 'idle' | 'saving' | 'saved' | 'error';
}) {
  return (
    <div className="rounded-2xl border bg-blanc p-5 space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-sans text-title font-bold text-nuit">
          {step < STEPS.length ? `Étape ${step} / ${STEPS.length - 1}` : 'Dernière étape'} · {STEPS[step - 1]}
        </p>
        <p className="text-small text-nuit/70">
          Fiche complète à <span className="font-bold text-bleu-athlace">{percent} %</span>
          <span className="ml-2" aria-live="polite">
            {saveState === 'saving' ? '· Enregistrement…' : saveState === 'saved' ? '· Enregistré' : saveState === 'error' ? '· Non enregistré' : ''}
          </span>
        </p>
      </div>
      <nav aria-label="Étapes du questionnaire" className="grid grid-cols-5 gap-1">
        {STEPS.map((label, i) => {
          const n = i + 1;
          const disabled = n > 1 && !canLeaveFirst;
          return (
            <button
              key={label} type="button" onClick={() => onGo(n)} disabled={disabled}
              aria-current={n === step ? 'step' : undefined}
              className="group space-y-1.5 text-left disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className={cn('block h-1.5 rounded-pill', n <= step ? 'bg-primary' : 'bg-creme')} />
              <span className={cn('hidden text-caption sm:block', n === step ? 'font-bold text-nuit' : 'text-nuit/70 group-hover:text-nuit')}>{label}</span>
            </button>
          );
        })}
      </nav>
      <Progress value={percent} aria-label={`Fiche complète à ${percent} %`} className="h-2 bg-creme" />
    </div>
  );
}

function FedBadge() {
  return (
    <span className="ml-2 inline-flex items-center rounded-pill bg-creme px-2 py-0.5 text-[11px] font-bold text-bleu-athlace">
      Donnée fédération
    </span>
  );
}

function Field({ label, fed, children, hint, htmlFor }: { label: string; fed?: boolean; children: ReactNode; hint?: string; htmlFor?: string }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor} className="text-small font-bold text-nuit">
        {label}
        {fed && <FedBadge />}
      </Label>
      {children}
      {hint && <p className="text-caption text-nuit/70">{hint}</p>}
    </div>
  );
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-4 rounded-2xl border bg-background p-5">
      <h3 className="font-sans text-subtitle font-bold text-nuit">{title}</h3>
      {children}
    </div>
  );
}

function Chips({ options, value, onChange }: { options: string[]; value: string[] | undefined; onChange: (v: string[]) => void }) {
  const cur = value ?? [];
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = cur.includes(o);
        return (
          <button
            key={o} type="button" aria-pressed={on}
            onClick={() => onChange(on ? cur.filter((x) => x !== o) : [...cur, o])}
            className={cn(
              'rounded-pill border px-3 py-1.5 text-small transition-colors',
              on ? 'border-primary bg-primary text-primary-foreground' : 'bg-background text-nuit/70 hover:border-primary',
            )}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}

function YesNo({ value, onChange }: { value: boolean | null | undefined; onChange: (v: boolean | null) => void }) {
  return (
    <div className="flex gap-2">
      {[{ v: true, l: 'Oui' }, { v: false, l: 'Non' }].map((o) => (
        <button
          key={o.l} type="button" aria-pressed={value === o.v}
          onClick={() => onChange(value === o.v ? null : o.v)}
          className={cn(
            'rounded-pill border px-4 py-1.5 text-small transition-colors',
            value === o.v ? 'border-primary bg-primary text-primary-foreground' : 'bg-background text-nuit/70 hover:border-primary',
          )}
        >
          {o.l}
        </button>
      ))}
    </div>
  );
}

const selectCls = 'h-10 w-full rounded-md border border-input bg-background px-3 text-sm';

/** Affiche une image stockée (URL publique de la fédération ou fichier privé du questionnaire). */
function MediaImg({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [url, setUrl] = useState<string | null>(src.startsWith('http') ? src : null);
  useEffect(() => {
    if (src.startsWith('http')) { setUrl(src); return; }
    supabase.storage.from(MEDIA_BUCKET).createSignedUrl(src, 3600).then(({ data }) => setUrl(data?.signedUrl ?? null));
  }, [src]);
  return url ? <img src={url} alt={alt} className={className} /> : <div className={cn('bg-creme', className)} />;
}

/* ---------- Données ---------- */

async function loadClubPrefill(clubId: string) {
  const [club, contact, venues, schedules, prices] = await Promise.all([
    supabase.from('clubs_public').select('*').eq('id', clubId).maybeSingle(),
    supabase.rpc('get_club_contact', { p_club_id: clubId }),
    supabase.from('club_venues').select('*').eq('club_id', clubId),
    supabase.from('club_schedules').select('*').eq('club_id', clubId),
    supabase.from('club_prices').select('*').eq('club_id', clubId),
  ]);
  if (!club.data) return null;
  const c = Array.isArray(contact.data) ? contact.data[0] : null;
  return {
    club: club.data as unknown as ClubRow,
    prefill: prefillFromClub(
      club.data as Record<string, unknown>, c ?? null,
      (venues.data ?? []) as Record<string, unknown>[],
      (schedules.data ?? []) as Record<string, unknown>[],
      (prices.data ?? []) as Record<string, unknown>[],
    ),
  };
}

/* ---------- Page ---------- */

export default function MyClub() {
  const { user, loading } = useAuth();
  const [params] = useSearchParams();

  const [ready, setReady] = useState(false);
  const [subId, setSubId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('draft');
  const [affMatch, setAffMatch] = useState<boolean | null>(null);
  const [step, setStep] = useState(1);
  const [p, setP] = useState<ClubPayload>({});
  const [prefill, setPrefill] = useState<ClubPayload>({});
  const [club, setClub] = useState<ClubRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [certify, setCertify] = useState(false);
  const [done, setDone] = useState(false);
  const dirty = useRef(false);

  const set = useCallback(<K extends keyof ClubPayload>(k: K, v: ClubPayload[K]) => {
    dirty.current = true;
    setP((o) => ({ ...o, [k]: v }));
  }, []);
  const fed = (k: keyof ClubPayload) =>
    isFilled(prefill[k]) && JSON.stringify(prefill[k]) === JSON.stringify(p[k]);

  // Chargement initial : brouillon existant, sinon club passé en paramètre.
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      const { data: sub } = await supabase
        .from('club_submissions')
        .select('*')
        .eq('user_id', user.id)
        .in('status', ['draft', 'submitted'])
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (cancelled) return;
      if (sub) {
        const payload = (sub.payload ?? {}) as ClubPayload;
        setSubId(sub.id);
        setStatus(sub.status);
        setAffMatch(sub.affiliation_match);
        setStep(Math.min(Math.max(sub.current_step ?? 1, 1), STEPS.length));
        // Les brouillons de l'ancien questionnaire (8 étapes) gardent leurs créneaux et tarifs, regroupés en une équipe.
        setP({ ...payload, teams: teamsFromPrefill(payload) });
        if (payload.club_id) {
          const r = await loadClubPrefill(payload.club_id);
          if (!cancelled && r) { setClub(r.club); setPrefill(r.prefill); }
        }
      } else {
        const clubParam = params.get('club');
        if (clubParam) {
          const r = await loadClubPrefill(clubParam);
          if (!cancelled && r) {
            setClub(r.club); setPrefill(r.prefill);
            setP({ ...r.prefill, teams: teamsFromPrefill(r.prefill), club_id: r.club.id });
          }
        }
      }
      if (!cancelled) setReady(true);
    })();
    return () => { cancelled = true; };
  }, [user, params]);

  const pickClub = async (id: string) => {
    const r = await loadClubPrefill(id);
    if (!r) return;
    dirty.current = true;
    setClub(r.club);
    setPrefill(r.prefill);
    // Le n° d'affiliation sert de preuve de lien avec le club : il doit être saisi, jamais pré-rempli.
    setP((o) => ({ ...r.prefill, teams: teamsFromPrefill(r.prefill), role: o.role, affiliation_number: o.affiliation_number, club_id: id, new_club: null }));
  };

  const fedCode = club?.federation_code ?? null;
  const { data: questions = [] } = useQuery({
    queryKey: ['sport-questions', fedCode],
    queryFn: async () => {
      let q = supabase.from('sport_questions').select('*').eq('active', true);
      q = fedCode ? q.or(`federation_code.is.null,federation_code.eq.${fedCode}`) : q.is('federation_code', null);
      const { data, error } = await q.order('sort').order('key');
      if (error) throw error;
      return (data ?? []) as SportQuestion[];
    },
    enabled: !!user,
  });

  const { data: discRows = [] } = useQuery({
    queryKey: ['available-disciplines'],
    queryFn: fetchAvailableDisciplines,
    staleTime: 3600_000,
  });

  const discipline = club?.discipline ?? p.new_club?.discipline ?? '';
  const subOptions = useMemo(() => {
    const row = discRows.find((r) => r.discipline === discipline);
    const fromDb = Object.keys(row?.subs ?? {}).sort((a, b) => a.localeCompare(b, 'fr'));
    return [...new Set([...fromDb, ...(prefill.sub_disciplines ?? []), ...(p.teams ?? []).map((t) => t.sub_discipline).filter(Boolean)])];
  }, [discRows, discipline, prefill.sub_disciplines, p.teams]);

  const percent = completionPercent(p, questions.map((q) => q.key));
  const missing = missingRequired(p);

  const save = useCallback(async (nextStep: number, extra?: { status?: 'submitted' }) => {
    if (!user) return false;
    setSaving(true);
    setSaveState('saving');
    const flat = flattenTeams(p);
    const row = {
      user_id: user.id,
      club_id: p.club_id ?? null,
      role: p.role || null,
      affiliation_number: p.affiliation_number?.trim() || null,
      payload: flat as unknown as never,
      current_step: nextStep,
      ...(extra?.status ? { status: extra.status } : {}),
    };
    const res = subId
      ? await supabase.from('club_submissions').update(row).eq('id', subId).select('id, status, affiliation_match').single()
      : await supabase.from('club_submissions').insert(row).select('id, status, affiliation_match').single();
    setSaving(false);
    if (res.error) {
      setSaveState('error');
      toast({ title: 'Enregistrement impossible', description: res.error.message, variant: 'destructive' });
      return false;
    }
    dirty.current = false;
    setSaveState('saved');
    setSubId(res.data.id);
    setStatus(res.data.status);
    setAffMatch(res.data.affiliation_match);
    return true;
  }, [user, p, subId]);

  // Enregistrement au fil de l'eau : chaque saisie est gardée, même si le club s'arrête en route.
  useEffect(() => {
    if (!ready || !dirty.current || !clubIdentified(p)) return;
    const t = window.setTimeout(() => { if (dirty.current) void save(step); }, 1500);
    return () => window.clearTimeout(t);
  }, [p, ready, step, save]);

  const goTo = async (n: number) => {
    if (n < 1 || n > STEPS.length) return;
    if (n > 1 && !clubIdentified(p)) {
      toast({ title: 'Choisissez votre club', description: "Recherchez votre club, ou indiquez-le s'il n'est pas listé." });
      return;
    }
    if (clubIdentified(p) && dirty.current && !(await save(n))) return;
    setStep(n);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submit = async () => {
    if (!certify || missing.length) return;
    if (await save(step, { status: 'submitted' })) setDone(true);
  };

  if (loading || (user && !ready)) {
    return (
      <Layout>
        <div className="container mx-auto flex justify-center px-4 py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="mb-4 font-sans text-2xl font-black text-nuit">Mon club</h1>
          <p className="mb-6 text-nuit/70">Connectez-vous pour réclamer ou gérer la fiche de votre club.</p>
          <Button asChild><Link to="/compte/connexion/">Se connecter</Link></Button>
        </div>
      </Layout>
    );
  }

  if (done) {
    return (
      <Layout>
        <div className="container mx-auto max-w-xl space-y-6 px-4 py-20 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-bleu-athlace" />
          <h1 className="font-sans text-heading-2 font-black text-nuit">Merci !</h1>
          <p className="text-body-lg text-nuit/70">Votre fiche sera mise à jour après vérification par l'équipe Athlace.</p>
          <Button variant="outline" onClick={() => setDone(false)}>Modifier mes réponses</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="border-b border-border bg-muted py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-sans text-3xl font-black text-nuit">Mon club</h1>
          <p className="mt-2 text-nuit/70">
            4 étapes et un récapitulatif. Tout est enregistré au fil de l'eau : vous pouvez vous arrêter et reprendre plus tard.
            Vos réponses sont vérifiées par l'équipe Athlace avant publication.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {status === 'submitted' && (
              <p className="inline-flex rounded-pill bg-creme px-3 py-1 text-small text-bleu-athlace">
                Fiche envoyée, en attente de vérification. Vous pouvez encore la modifier.
              </p>
            )}
            {status !== 'submitted' && clubIdentified(p) && missing.length > 0 && (
              <p className="inline-flex rounded-pill bg-creme px-3 py-1 text-small text-nuit">Fiche partiellement complétée</p>
            )}
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-3xl space-y-6 px-4 py-8">
        <StepCard step={step} percent={percent} onGo={goTo} canLeaveFirst={clubIdentified(p)} saveState={saveState} />

        <div className="space-y-6">
          {step === 1 && (
            <Step1 p={p} set={set} setP={setP} club={club} setClub={setClub} pickClub={pickClub}
              disciplines={discRows.map((r) => r.discipline).sort((a, b) => a.localeCompare(b, 'fr'))} fed={fed} />
          )}
          {step === 2 && <Step2 p={p} set={set} fed={fed} userId={user.id} />}
          {step === 3 && <Step3 p={p} set={set} fed={fed} subOptions={subOptions} />}
          {step === 4 && <Step4 p={p} set={set} fed={fed} questions={questions} />}
          {step === 5 && (
            <Step5 p={p} set={set} fed={fed} club={club} questions={questions} certify={certify} setCertify={setCertify}
              subId={subId} affMatch={affMatch} missing={missing} onEdit={goTo} />
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-6">
          <Button variant="outline" onClick={() => goTo(step - 1)} disabled={step === 1 || saving}>Précédent</Button>
          {step < STEPS.length ? (
            <Button onClick={() => goTo(step + 1)} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Suivant
            </Button>
          ) : (
            <Button onClick={submit} disabled={!certify || missing.length > 0 || saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Envoyer pour vérification
            </Button>
          )}
        </div>
      </div>
    </Layout>
  );
}

/* ---------- Étapes ---------- */

type SetFn = <K extends keyof ClubPayload>(k: K, v: ClubPayload[K]) => void;
interface StepProps { p: ClubPayload; set: SetFn; fed: (k: keyof ClubPayload) => boolean }

function PillChoice<T extends string>({ options, value, onChange }: {
  options: readonly { v: T; l: string }[]; value: T | '' | undefined; onChange: (v: T | '') => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button key={o.v} type="button" aria-pressed={value === o.v}
          onClick={() => onChange(value === o.v ? '' : o.v)}
          className={cn('rounded-pill border px-3 py-1.5 text-small',
            value === o.v ? 'border-primary bg-primary text-primary-foreground' : 'bg-background text-nuit/70 hover:border-primary')}>
          {o.l}
        </button>
      ))}
    </div>
  );
}

/* Étape 1 · Votre club et contact */
function Step1({
  p, set, setP, club, setClub, pickClub, disciplines, fed,
}: StepProps & {
  setP: React.Dispatch<React.SetStateAction<ClubPayload>>;
  club: ClubRow | null; setClub: (c: ClubRow | null) => void; pickClub: (id: string) => void;
  disciplines: string[];
}) {
  const [q, setQ] = useState('');
  const [hits, setHits] = useState<ClubRow[]>([]);
  const notListed = !!p.new_club;

  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) { setHits([]); return; }
    const t = setTimeout(async () => {
      const safe = term.replace(/[,()%]/g, ' ');
      const { data } = await supabase
        .from('clubs_public')
        .select('id, name, city, discipline, federation_code')
        .or(`name.ilike.%${safe}%,city.ilike.%${safe}%`)
        .limit(8);
      setHits((data ?? []) as unknown as ClubRow[]);
    }, 250);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <>
      <Block title="Votre club *">
        {club ? (
          <div className="flex items-center justify-between gap-3 rounded-xl bg-creme p-4">
            <div>
              <p className="font-bold text-nuit">{club.name}</p>
              <p className="text-small text-nuit/70">{[club.discipline, club.city].filter(Boolean).join(' · ')}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => { setClub(null); setP((o) => ({ ...o, club_id: null })); }}>
              Changer
            </Button>
          </div>
        ) : notListed ? (
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Nom du club *">
              <Input value={p.new_club!.name} onChange={(e) => set('new_club', { ...p.new_club!, name: e.target.value })} />
            </Field>
            <Field label="Discipline *">
              <select className={selectCls} value={p.new_club!.discipline} onChange={(e) => set('new_club', { ...p.new_club!, discipline: e.target.value })}>
                <option value="">Choisir…</option>
                {disciplines.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </Field>
            <Field label="Ville *">
              <Input value={p.new_club!.city} onChange={(e) => set('new_club', { ...p.new_club!, city: e.target.value })} />
            </Field>
            <div className="sm:col-span-3">
              <Button variant="link" className="px-0" onClick={() => set('new_club', null)}>Rechercher mon club dans la liste</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-nuit/70" />
              <Input className="pl-9" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Nom du club ou ville" aria-label="Rechercher votre club" />
            </div>
            {hits.length > 0 && (
              <ul className="divide-y rounded-xl border">
                {hits.map((h) => (
                  <li key={h.id}>
                    <button type="button" onClick={() => pickClub(h.id)} className="w-full px-4 py-3 text-left hover:bg-creme">
                      <span className="font-bold text-nuit">{h.name}</span>
                      <span className="block text-small text-nuit/70">{[h.discipline, h.city].filter(Boolean).join(' · ')}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <Button variant="link" className="px-0" onClick={() => set('new_club', { name: q, discipline: '', city: '' })}>
              Mon club n'est pas listé
            </Button>
          </div>
        )}
      </Block>

      <Block title="Contact">
        <p className="text-small text-nuit/70">Au moins un email ou un téléphone, pour que les sportifs puissent vous joindre. *</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {CONTACT.map(([k, l, type]) => (
            <Field key={k} label={l} fed={fed(k)}>
              <Input type={type} value={(p[k] as string) ?? ''} onChange={(e) => set(k, e.target.value as never)} />
            </Field>
          ))}
        </div>
      </Block>
    </>
  );
}

/* Étape 2 · Identité et description (lieux, conditions, vie du club, puis photos et vidéo) */
function Step2({ p, set, fed, userId }: StepProps & { userId: string }) {
  const [uploading, setUploading] = useState(false);
  const upload = async (file: File) => {
    if (!MEDIA_TYPES.includes(file.type)) {
      toast({ title: 'Format non accepté', description: 'Formats acceptés : PNG, JPEG ou WebP.', variant: 'destructive' });
      return null;
    }
    if (file.size > MEDIA_MAX_BYTES) {
      toast({ title: 'Image trop lourde', description: 'Taille maximale : 5 Mo.', variant: 'destructive' });
      return null;
    }
    const ext = file.name.split('.').pop() ?? 'jpg';
    const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, { contentType: file.type });
    if (error) { toast({ title: 'Envoi impossible', description: error.message, variant: 'destructive' }); return null; }
    return path;
  };
  const photos = p.photos ?? [];
  const venues = p.venues ?? [];
  const upV = (i: number, patch: Partial<VenueDraft>) => set('venues', venues.map((v, j) => (j === i ? { ...v, ...patch } : v)));

  return (
    <>
      <Block title="Le club">
        <Field label="Logo" fed={fed('logo')}>
          <div className="flex items-center gap-4">
            {p.logo && <MediaImg src={p.logo} alt="Logo du club" className="h-16 w-16 rounded-xl border object-contain" />}
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-pill bg-creme px-4 py-2 text-small font-bold text-bleu-athlace">
              <Upload className="h-4 w-4" /> {p.logo ? 'Remplacer' : 'Ajouter un logo'}
              <input type="file" accept={MEDIA_TYPES.join(',')} className="sr-only" disabled={uploading}
                onChange={async (e) => {
                  const f = e.target.files?.[0]; if (!f) return;
                  setUploading(true); const path = await upload(f); setUploading(false);
                  if (path) set('logo', path);
                }} />
            </label>
          </div>
        </Field>
        <Field label="Description *" fed={fed('description')} hint={`${(p.description ?? '').length}/500 caractères`}>
          <Textarea rows={5} maxLength={500} value={p.description ?? ''} onChange={(e) => set('description', e.target.value.slice(0, 500))} />
        </Field>
        <Field label="Date de création" fed={fed('creation_date')}>
          <Input type="date" value={p.creation_date ?? ''} onChange={(e) => set('creation_date', e.target.value)} />
        </Field>
      </Block>

      <Block title="Lieux de pratique *">
        {fed('venues') && <FedBadge />}
        <p className="text-small text-nuit/70">Vous les retrouverez à l'étape suivante pour chaque équipe ou groupe.</p>
        {venues.map((v, i) => (
          <div key={i} className="grid gap-3 rounded-xl border p-4 sm:grid-cols-[1fr_2fr_auto_auto] sm:items-end">
            <Field label="Nom"><Input placeholder="Gymnase Jean Moulin" value={v.name} onChange={(e) => upV(i, { name: e.target.value })} /></Field>
            <Field label="Adresse"><Input value={v.address} onChange={(e) => upV(i, { address: e.target.value })} /></Field>
            <label className="flex items-center gap-2 pb-2 text-small text-nuit">
              <Checkbox checked={v.is_main} onCheckedChange={(c) => upV(i, { is_main: !!c })} /> Lieu principal
            </label>
            <Button variant="ghost" size="icon" aria-label="Supprimer le lieu" onClick={() => set('venues', venues.filter((_, j) => j !== i))}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button variant="outline" onClick={() => set('venues', [...venues, { name: '', address: '', is_main: venues.length === 0 }])}>
          <Plus className="mr-1 h-4 w-4" /> Ajouter un lieu
        </Button>
      </Block>

      <Block title="Conditions pour s'inscrire">
        <Field label="Certificat médical ou questionnaire de santé demandé">
          <YesNo value={p.health_certificate} onChange={(v) => set('health_certificate', v)} />
        </Field>
        <Field label="Publics accueillis" fed={fed('audiences')}>
          <Chips options={[...new Set([...AUDIENCES, ...(p.audiences ?? [])])]} value={p.audiences} onChange={(v) => set('audiences', v)} />
        </Field>
        <Field label="Débutants acceptés"><YesNo value={p.beginners_ok} onChange={(v) => set('beginners_ok', v)} /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Âge minimum" fed={fed('min_age')}>
            <Input type="number" min={0} value={p.min_age ?? ''} onChange={(e) => set('min_age', e.target.value)} />
          </Field>
          <Field label="Âge maximum">
            <Input type="number" min={0} value={p.max_age ?? ''} onChange={(e) => set('max_age', e.target.value)} />
          </Field>
        </div>
        <Field label="Autres conditions">
          <Textarea rows={2} value={p.other_conditions ?? ''} onChange={(e) => set('other_conditions', e.target.value)} />
        </Field>
      </Block>

      <Block title="Vie du club">
        <Field label="Nombre d'encadrants diplômés">
          <Input type="number" min={0} className="w-32" value={p.coaches_certified ?? ''} onChange={(e) => set('coaches_certified', e.target.value)} />
        </Field>
        <Field label="Ambiance">
          <div className="flex items-center gap-4 text-small text-nuit/70">
            <span>Conviviale</span>
            <Slider className="flex-1" min={0} max={100} step={5} value={[p.ambiance ?? 50]}
              onValueChange={([v]) => set('ambiance', v)} aria-label="Ambiance, de conviviale à compétitive" />
            <span>Compétitive</span>
          </div>
          {p.ambiance == null && <p className="text-caption text-nuit/70">Déplacez le curseur pour répondre.</p>}
        </Field>
        <Field label="Équipements" fed={fed('amenities')}>
          <Chips options={[...new Set([...AMENITIES, ...(p.amenities ?? [])])]} value={p.amenities} onChange={(v) => set('amenities', v)} />
        </Field>
        <Field label="Accessible aux personnes à mobilité réduite"><YesNo value={p.pmr} onChange={(v) => set('pmr', v)} /></Field>
        <Field label="Événements annuels">
          <Textarea rows={2} value={p.events ?? ''} onChange={(e) => set('events', e.target.value)} />
        </Field>
        <Field label="Le club cherche des bénévoles"><YesNo value={p.volunteers} onChange={(v) => set('volunteers', v)} /></Field>
      </Block>

      <Block title="Photos et vidéo">
        <Field label={`Photos (${photos.length}/6)`} fed={fed('photos')}>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {photos.map((ph, i) => (
              <div key={ph} className="relative">
                <MediaImg src={ph} alt={`Photo ${i + 1}`} className="aspect-square w-full rounded-lg object-cover" />
                <button type="button" aria-label="Retirer la photo" onClick={() => set('photos', photos.filter((x) => x !== ph))}
                  className="absolute right-1 top-1 inline-flex h-8 w-8 items-center justify-center rounded-pill bg-background text-nuit shadow">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            {photos.length < 6 && (
              <label className="flex aspect-square cursor-pointer items-center justify-center rounded-lg border border-dashed text-nuit/70 hover:border-primary">
                {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
                <input type="file" accept={MEDIA_TYPES.join(',')} multiple className="sr-only" disabled={uploading}
                  onChange={async (e) => {
                    const files = [...(e.target.files ?? [])].slice(0, 6 - photos.length);
                    setUploading(true);
                    const paths: string[] = [];
                    for (const f of files) { const pth = await upload(f); if (pth) paths.push(pth); }
                    setUploading(false);
                    set('photos', [...photos, ...paths].slice(0, 6));
                  }} />
                <span className="sr-only">Ajouter des photos</span>
              </label>
            )}
          </div>
        </Field>
        <Field label="Vidéo (lien)" fed={fed('video_url')}>
          <Input type="url" placeholder="https://" value={p.video_url ?? ''} onChange={(e) => set('video_url', e.target.value)} />
        </Field>
      </Block>
    </>
  );
}

/* Étape 3 · Équipes et groupes : un bloc par équipe (pratique, niveau, lieux, créneaux, tarifs, inscriptions) */
function TeamBlock({ t, index, onChange, onRemove, venueNames, subOptions }: {
  t: TeamDraft; index: number; onChange: (t: TeamDraft) => void; onRemove: () => void; venueNames: string[]; subOptions: string[];
}) {
  const up = (patch: Partial<TeamDraft>) => onChange({ ...t, ...patch });
  const upSlot = (i: number, patch: Partial<TeamSlot>) => up({ slots: t.slots.map((x, j) => (j === i ? { ...x, ...patch } : x)) });
  const upPrice = (i: number, patch: Partial<PriceDraft>) => up({ prices: t.prices.map((x, j) => (j === i ? { ...x, ...patch } : x)) });
  const slotVenues = [...new Set([...(t.venues.length ? t.venues : venueNames), ...t.slots.map((x) => x.venue)].filter(Boolean))];

  return (
    <div className="space-y-4 rounded-2xl border bg-background p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-sans text-subtitle font-bold text-nuit">{t.name.trim() || `Équipe ou groupe ${index + 1}`}</h3>
        <Button variant="ghost" size="sm" onClick={onRemove}><Trash2 className="mr-1 h-4 w-4" />Retirer</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nom (facultatif)" hint="Ex. U11 garçons, Adultes loisir, Groupe compétition">
          <Input value={t.name} onChange={(e) => up({ name: e.target.value })} />
        </Field>
        <Field label="Sous-discipline">
          {subOptions.length > 0 ? (
            <select className={selectCls} value={t.sub_discipline} onChange={(e) => up({ sub_discipline: e.target.value })}>
              <option value="">-</option>
              {subOptions.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          ) : (
            <Input value={t.sub_discipline} onChange={(e) => up({ sub_discipline: e.target.value })} />
          )}
        </Field>
      </div>

      <Field label="Catégories">
        <Chips options={[...new Set([...AGE_CATEGORIES, 'Hommes', 'Femmes', 'Mixte', ...t.categories])]} value={t.categories} onChange={(v) => up({ categories: v })} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Niveau"><PillChoice options={LEVELS} value={t.level} onChange={(v) => up({ level: v })} /></Field>
        <Field label="Division ou niveau de compétition" hint="Ex. Régionale 2, Nationale 3, ceinture marron">
          <Input value={t.division} onChange={(e) => up({ division: e.target.value })} />
        </Field>
      </div>

      <Field label="Lieux">
        {venueNames.length > 0
          ? <Chips options={[...new Set([...venueNames, ...t.venues])]} value={t.venues} onChange={(v) => up({ venues: v })} />
          : <p className="text-small text-nuit/70">Ajoutez vos lieux de pratique à l'étape 2 pour les choisir ici.</p>}
      </Field>

      <Field label="Créneaux *">
        <div className="space-y-2">
          {t.slots.map((sl, i) => (
            <div key={i} className="grid gap-2 rounded-xl border p-3 sm:grid-cols-[1fr_1fr_1fr_1.5fr_auto] sm:items-end">
              <select aria-label="Jour" className={selectCls} value={sl.day} onChange={(e) => upSlot(i, { day: e.target.value })}>
                <option value="">Jour</option>
                {[...new Set([...DAYS, sl.day].filter(Boolean))].map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              <Input aria-label="Début" type="time" value={sl.start_time} onChange={(e) => upSlot(i, { start_time: e.target.value })} />
              <Input aria-label="Fin" type="time" value={sl.end_time} onChange={(e) => upSlot(i, { end_time: e.target.value })} />
              <select aria-label="Lieu" className={selectCls} value={sl.venue} onChange={(e) => upSlot(i, { venue: e.target.value })}>
                <option value="">Lieu</option>
                {slotVenues.map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
              <Button variant="ghost" size="icon" aria-label="Supprimer le créneau" onClick={() => up({ slots: t.slots.filter((_, j) => j !== i) })}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => up({ slots: [...t.slots, { day: '', start_time: '', end_time: '', venue: t.venues[0] ?? '' }] })}>
            <Plus className="mr-1 h-4 w-4" /> Ajouter un créneau
          </Button>
        </div>
      </Field>

      <Field label="Tarifs">
        <div className="space-y-2">
          {t.prices.map((x, i) => (
            <div key={i} className="grid gap-2 rounded-xl border p-3 sm:grid-cols-[2fr_1fr_1fr_auto_auto] sm:items-end">
              <Input aria-label="Libellé du tarif" placeholder="Cotisation annuelle" value={x.label} onChange={(e) => upPrice(i, { label: e.target.value })} />
              <Input aria-label="Montant en euros" type="number" min={0} step="0.01" placeholder="€" value={x.amount} onChange={(e) => upPrice(i, { amount: e.target.value })} />
              <select aria-label="Période" className={selectCls} value={x.period} onChange={(e) => upPrice(i, { period: e.target.value as PriceDraft['period'] })}>
                {PERIODS.map((pp) => <option key={pp} value={pp}>{pp}</option>)}
              </select>
              <label className="flex items-center gap-2 pb-2 text-small text-nuit">
                <Checkbox checked={x.includes_license} onCheckedChange={(c) => upPrice(i, { includes_license: !!c })} /> Licence incluse
              </label>
              <Button variant="ghost" size="icon" aria-label="Supprimer le tarif" onClick={() => up({ prices: t.prices.filter((_, j) => j !== i) })}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => up({ prices: [...t.prices, { label: '', amount: '', period: 'saison', includes_license: true }] })}>
            <Plus className="mr-1 h-4 w-4" /> Ajouter un tarif
          </Button>
        </div>
      </Field>

      <Field label="Inscriptions"><PillChoice options={REGISTRATION} value={t.registration} onChange={(v) => up({ registration: v })} /></Field>
    </div>
  );
}

function Step3({ p, set, fed, subOptions }: StepProps & { subOptions: string[] }) {
  const teams = p.teams ?? [];
  const venueNames = [...new Set((p.venues ?? []).map((v) => v.name.trim() || v.address.trim()).filter(Boolean))];
  return (
    <>
      <p className="text-small text-nuit/70">
        Un bloc par équipe ou par groupe : chacun a ses catégories, son niveau, ses créneaux et ses tarifs.
        Un club sans équipes peut créer un seul groupe.
      </p>
      {(fed('schedules') || fed('prices')) && teams.length > 0 && (
        <p className="text-small text-nuit/70">Prérempli avec les données de votre fédération <FedBadge /></p>
      )}
      {teams.map((t, i) => (
        <TeamBlock key={t.id} t={t} index={i} venueNames={venueNames} subOptions={subOptions}
          onChange={(nt) => set('teams', teams.map((x) => (x.id === t.id ? nt : x)))}
          onRemove={() => set('teams', teams.filter((x) => x.id !== t.id))} />
      ))}
      <Button variant="outline" className="w-full border-dashed" onClick={() => set('teams', [...teams, newTeam(teams.length + 1)])}>
        <Plus className="mr-1 h-4 w-4" /> Ajouter une équipe ou un groupe
      </Button>

      <Block title="Inscriptions (pour tout le club)">
        <Field label="Séance d'essai"><YesNo value={p.trial} onChange={(v) => set('trial', v)} /></Field>
        {p.trial && (
          <Field label="Nombre de séances gratuites">
            <Input type="number" min={1} className="w-32" value={p.trial_sessions ?? ''} onChange={(e) => set('trial_sessions', e.target.value)} />
          </Field>
        )}
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Début des inscriptions"><Input type="date" value={p.registration_start ?? ''} onChange={(e) => set('registration_start', e.target.value)} /></Field>
          <Field label="Fin des inscriptions"><Input type="date" value={p.registration_end ?? ''} onChange={(e) => set('registration_end', e.target.value)} /></Field>
          <Field label="Date de reprise"><Input type="date" value={p.season_start ?? ''} onChange={(e) => set('season_start', e.target.value)} /></Field>
        </div>
        <Field label="Paiement en plusieurs fois"><YesNo value={p.installments} onChange={(v) => set('installments', v)} /></Field>
        <Field label="Aides acceptées"><Chips options={AIDS} value={p.aids} onChange={(v) => set('aids', v)} /></Field>
        <Field label="Pièces à fournir">
          <Textarea rows={2} value={p.documents ?? ''} onChange={(e) => set('documents', e.target.value)} />
        </Field>
        <Field label="Lien d'inscription en ligne" fed={fed('registration_url')}>
          <Input type="url" placeholder="https://" value={p.registration_url ?? ''} onChange={(e) => set('registration_url', e.target.value)} />
        </Field>
      </Block>
    </>
  );
}

/* Étape 4 · Spécificités du sport : labels, puis les questions propres au sport (grades, matériel, brevets…) */
function Step4({ p, set, fed, questions }: StepProps & { questions: SportQuestion[] }) {
  const answers = p.sport_answers ?? {};
  const setA = (k: string, v: unknown) => set('sport_answers', { ...answers, [k]: v });
  return (
    <>
      <Block title="Labels et certifications">
        <Field label="Labels" fed={fed('labels')} hint="Séparés par des virgules, ex. Label École de foot, Club formateur">
          <Input value={p.labels ?? ''} onChange={(e) => set('labels', e.target.value)} />
        </Field>
        <Field label="Niveau ou grade requis pour s'inscrire">
          <Input value={p.required_level ?? ''} onChange={(e) => set('required_level', e.target.value)} />
        </Field>
      </Block>
      <Block title="Questions propres à votre sport">
        {questions.length === 0 ? (
          <p className="text-small text-nuit/70">Pas de question spécifique pour ce sport pour l'instant.</p>
        ) : questions.map((q) => {
          const v = answers[q.key];
          return (
            <Field key={q.id} label={q.label} hint={q.help ?? undefined}>
              {q.type === 'text' && <Input value={(v as string) ?? ''} onChange={(e) => setA(q.key, e.target.value)} />}
              {q.type === 'number' && (
                <Input type="number" className="w-40" value={(v as string | number) ?? ''}
                  onChange={(e) => setA(q.key, e.target.value === '' ? null : Number(e.target.value))} />
              )}
              {q.type === 'boolean' && <YesNo value={v as boolean | null} onChange={(b) => setA(q.key, b)} />}
              {q.type === 'select' && (
                <select className={selectCls} value={(v as string) ?? ''} onChange={(e) => setA(q.key, e.target.value || null)}>
                  <option value="">-</option>
                  {(q.options ?? []).map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              )}
              {q.type === 'multiselect' && (
                <Chips options={q.options ?? []} value={Array.isArray(v) ? (v as string[]) : []} onChange={(arr) => setA(q.key, arr)} />
              )}
            </Field>
          );
        })}
      </Block>
    </>
  );
}

/* Étape 5 · Récapitulatif et attestation */
const fmt = (v: unknown): string =>
  v === true ? 'Oui' : v === false ? 'Non' : Array.isArray(v) ? v.join(', ') : String(v);

const RECAP: { page: number; title: string; fields: [keyof ClubPayload, string][] }[] = [
  { page: 1, title: 'Votre club et contact', fields: [
    ['email', 'Email'], ['phone', 'Téléphone'], ['website', 'Site web'], ['instagram_url', 'Instagram'], ['facebook_url', 'Facebook'],
    ['tiktok_url', 'TikTok'], ['youtube_url', 'YouTube'], ['linkedin_url', 'LinkedIn'],
  ] },
  { page: 2, title: 'Identité et description', fields: [
    ['description', 'Description'], ['creation_date', 'Date de création'], ['health_certificate', 'Certificat / questionnaire santé'],
    ['audiences', 'Publics'], ['beginners_ok', 'Débutants acceptés'], ['min_age', 'Âge minimum'], ['max_age', 'Âge maximum'],
    ['other_conditions', 'Autres conditions'], ['coaches_certified', 'Encadrants diplômés'],
    ['ambiance', 'Ambiance (0 conviviale - 100 compétitive)'], ['amenities', 'Équipements'], ['pmr', 'Accessibilité PMR'],
    ['events', 'Événements annuels'], ['volunteers', 'Cherche des bénévoles'], ['video_url', 'Vidéo'],
  ] },
  { page: 3, title: 'Équipes et groupes', fields: [
    ['trial', "Séance d'essai"], ['trial_sessions', 'Séances gratuites'], ['registration_start', 'Début inscriptions'],
    ['registration_end', 'Fin inscriptions'], ['season_start', 'Reprise'], ['installments', 'Paiement en plusieurs fois'],
    ['aids', 'Aides acceptées'], ['documents', 'Pièces à fournir'], ['registration_url', "Lien d'inscription"],
  ] },
  { page: 4, title: 'Spécificités du sport', fields: [['labels', 'Labels'], ['required_level', 'Niveau requis']] },
];

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="contents">
      <dt className="font-bold text-nuit">{label}</dt>
      <dd className="break-words text-nuit/70">{children}</dd>
    </div>
  );
}

function Step5({
  p, set, fed, club, questions, certify, setCertify, subId, affMatch, missing, onEdit,
}: StepProps & {
  club: ClubRow | null; questions: SportQuestion[]; certify: boolean; setCertify: (v: boolean) => void;
  subId: string | null; affMatch: boolean | null; missing: { page: number; label: string }[]; onEdit: (n: number) => void;
}) {
  const clubName = club?.name ?? p.new_club?.name;
  return (
    <>
      {missing.length > 0 && (
        <div className="space-y-2 rounded-2xl border border-destructive/40 bg-background p-4">
          <p className="flex items-center gap-2 font-bold text-nuit"><AlertCircle className="h-4 w-4 text-destructive" /> À compléter avant l'envoi</p>
          <ul className="space-y-1 text-small">
            {missing.map((m) => (
              <li key={m.label}>
                <button type="button" className="text-bleu-athlace underline-offset-2 hover:underline" onClick={() => onEdit(m.page)}>
                  {m.label} (étape {m.page})
                </button>
              </li>
            ))}
          </ul>
          <p className="text-caption text-nuit/70">Tout ce que vous avez déjà saisi est enregistré : votre fiche reste partiellement complétée en attendant.</p>
        </div>
      )}

      {RECAP.map((sec) => {
        const rows = sec.fields.filter(([k]) => isFilled(p[k]));
        return (
          <div key={sec.page} className="space-y-3 rounded-2xl border bg-background p-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-sans text-subtitle font-bold text-nuit">{sec.page}. {sec.title}</h3>
              <Button variant="ghost" size="sm" onClick={() => onEdit(sec.page)}><Pencil className="mr-1 h-4 w-4" />Modifier</Button>
            </div>
            <dl className="grid gap-x-6 gap-y-2 text-small sm:grid-cols-[auto_1fr]">
              {sec.page === 1 && <Row label="Club">{clubName ?? '-'}</Row>}
              {sec.page === 2 && isFilled(p.logo) && <Row label="Logo">Fourni</Row>}
              {sec.page === 2 && isFilled(p.venues) && (
                <Row label="Lieux">{p.venues!.map((v) => [v.name, v.address].filter(Boolean).join(' - ') + (v.is_main ? ' (principal)' : '')).join(' ; ')}</Row>
              )}
              {sec.page === 2 && isFilled(p.photos) && <Row label="Photos">{p.photos!.length}</Row>}
              {sec.page === 3 && (p.teams ?? []).map((t, i) => (
                <Row key={t.id} label={t.name.trim() || `Équipe ou groupe ${i + 1}`}>
                  {[
                    t.sub_discipline, t.categories.join(', '),
                    LEVELS.find((l) => l.v === t.level)?.l, t.division,
                    t.slots.filter((sl) => sl.day).map((sl) => `${sl.day} ${sl.start_time}-${sl.end_time}${sl.venue ? ` (${sl.venue})` : ''}`).join(', '),
                    t.prices.filter((x) => x.amount).map((x) => `${x.label ? `${x.label} ` : ''}${x.amount} € / ${x.period}`).join(', '),
                    REGISTRATION.find((r) => r.v === t.registration)?.l,
                  ].filter(Boolean).join(' · ') || '-'}
                </Row>
              ))}
              {rows.map(([k, l]) => <Row key={k} label={l}>{fmt(p[k])}</Row>)}
              {sec.page === 4 && questions.filter((q) => isFilled(p.sport_answers?.[q.key])).map((q) => (
                <Row key={q.id} label={q.label}>{fmt(p.sport_answers![q.key])}</Row>
              ))}
            </dl>
          </div>
        );
      })}

      <Block title="Attestation">
        <Field label="Votre rôle dans le club *">
          <div className="flex flex-wrap gap-2">
            {ROLES.map((r) => (
              <button key={r} type="button" aria-pressed={p.role === r} onClick={() => set('role', r)}
                className={cn('rounded-pill border px-3 py-1.5 text-small capitalize',
                  p.role === r ? 'border-primary bg-primary text-primary-foreground' : 'bg-background text-nuit/70 hover:border-primary')}>
                {r}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Numéro d'affiliation fédérale du club" fed={fed('affiliation_number')} htmlFor="aff"
          hint="Facultatif pour l'instant. Il nous aide à vérifier que vous représentez bien le club.">
          <Input id="aff" value={p.affiliation_number ?? ''} onChange={(e) => set('affiliation_number', e.target.value)} />
        </Field>
        {subId && affMatch === true && (
          <p className="inline-flex items-center gap-1.5 rounded-pill bg-secondary px-3 py-1 text-small font-bold text-secondary-foreground">
            <CheckCircle2 className="h-4 w-4" /> Affiliation vérifiée
          </p>
        )}
        <p className="rounded-xl bg-creme p-3 text-small text-nuit/70">
          La façon de prouver votre appartenance au club (licence d'encadrant, attestation d'affiliation ou double authentification)
          sera précisée prochainement. En attendant, l'équipe Athlace vérifie chaque fiche avant publication.
        </p>
        <label className="flex items-start gap-3 rounded-2xl border bg-creme p-4 text-small text-nuit">
          <Checkbox checked={certify} onCheckedChange={(c) => setCertify(!!c)} className="mt-0.5" />
          <span>Je certifie représenter ce club et que les informations ci-dessus sont exactes. *</span>
        </label>
      </Block>
    </>
  );
}
