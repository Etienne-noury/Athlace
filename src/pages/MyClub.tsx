import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Plus, Trash2, Upload, CheckCircle2, Search, X } from 'lucide-react';
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
  completionPercent, isFilled, prefillFromClub, step1Valid,
  type ClubPayload, type PriceDraft, type ScheduleDraft, type VenueDraft,
} from '@/lib/club-form';

/* ---------- Constantes ---------- */

const STEPS = [
  'Votre club', 'Identité', 'Pratique et niveau', 'Lieux et créneaux',
  'Tarifs et inscription', 'Encadrement et vie du club', 'Spécifique au sport', 'Contact et récap',
];
const ROLES = ['président', 'secrétaire', 'trésorier', 'entraîneur', 'autre'];
const AUDIENCES = ['Enfants', 'Ados', 'Adultes', 'Seniors', 'Féminines', 'Handicap'];
const AGE_CATEGORIES = ['Baby (< 6 ans)', 'Moins de 8 ans', 'Moins de 10 ans', 'Moins de 12 ans', 'Moins de 14 ans', 'Moins de 16 ans', 'Moins de 18 ans', 'Seniors', 'Vétérans'];
const LEVELS = [
  { v: 'loisir', l: 'Loisir' }, { v: 'competition', l: 'Compétition' }, { v: 'les_deux', l: 'Les deux' },
];
const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const PERIODS: PriceDraft['period'][] = ['saison', 'mois', 'trimestre', 'séance'];
const AIDS = ["Pass'Sport", 'Chèques ANCV', 'Coupons sport', 'Aide mairie ou CAF'];
const AMENITIES = ['Vestiaires', 'Douches', 'Parking', 'Club-house', 'Matériel en prêt'];
const MEDIA_BUCKET = 'club-media';

interface SportQuestion {
  id: string; key: string; label: string; help: string | null;
  type: 'text' | 'number' | 'boolean' | 'select' | 'multiselect';
  options: string[] | null; sort: number; federation_code: string | null;
}
type ClubRow = Record<string, unknown> & { id: string; name: string; city: string | null; discipline: string; federation_code: string };

/* ---------- Petits composants ---------- */

function StepCard({ step, percent }: { step: number; percent: number }) {
  return (
    <div className="rounded-2xl border bg-surface p-5 space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-sans text-title font-bold text-ink">
          Étape {step} / {STEPS.length} · {STEPS[step - 1]}
        </p>
        <p className="text-small text-slate-600">
          Fiche complète à <span className="font-bold text-blue-500">{percent} %</span>
        </p>
      </div>
      <div className="flex gap-1" aria-hidden>
        {STEPS.map((_, i) => (
          <div key={i} className={cn('h-1.5 flex-1 rounded-pill', i < step ? 'bg-primary' : 'bg-tint-100')} />
        ))}
      </div>
      <Progress value={percent} aria-label={`Fiche complète à ${percent} %`} className="h-2 bg-tint-100" />
    </div>
  );
}

function FedBadge() {
  return (
    <span className="ml-2 inline-flex items-center rounded-pill bg-tint-100 px-2 py-0.5 text-[11px] font-bold text-blue-500">
      Donnée fédération
    </span>
  );
}

function Field({ label, fed, children, hint, htmlFor }: { label: string; fed?: boolean; children: ReactNode; hint?: string; htmlFor?: string }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor} className="text-small font-bold text-ink">
        {label}
        {fed && <FedBadge />}
      </Label>
      {children}
      {hint && <p className="text-caption text-slate-500">{hint}</p>}
    </div>
  );
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-4 rounded-2xl border bg-background p-5">
      <h3 className="font-sans text-subtitle font-bold text-ink">{title}</h3>
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
              on ? 'border-primary bg-primary text-primary-foreground' : 'bg-background text-slate-600 hover:border-primary',
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
            value === o.v ? 'border-primary bg-primary text-primary-foreground' : 'bg-background text-slate-600 hover:border-primary',
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
  return url ? <img src={url} alt={alt} className={className} /> : <div className={cn('bg-tint-100', className)} />;
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
  const [certify, setCertify] = useState(false);
  const [done, setDone] = useState(false);

  const set = useCallback(<K extends keyof ClubPayload>(k: K, v: ClubPayload[K]) => setP((o) => ({ ...o, [k]: v })), []);
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
        setP(payload);
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
            setP({ ...r.prefill, club_id: r.club.id });
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
    setClub(r.club);
    setPrefill(r.prefill);
    setP((o) => ({ ...r.prefill, role: o.role, affiliation_number: o.affiliation_number || r.prefill.affiliation_number, club_id: id, new_club: null }));
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
    return [...new Set([...fromDb, ...(p.sub_disciplines ?? [])])];
  }, [discRows, discipline, p.sub_disciplines]);

  const percent = completionPercent(p, questions.map((q) => q.key));

  const save = async (nextStep: number, extra?: { status?: 'submitted' }) => {
    if (!user) return false;
    setSaving(true);
    const row = {
      user_id: user.id,
      club_id: p.club_id ?? null,
      role: p.role || null,
      affiliation_number: p.affiliation_number?.trim() || null,
      payload: p as unknown as never,
      current_step: nextStep,
      ...(extra?.status ? { status: extra.status } : {}),
    };
    const res = subId
      ? await supabase.from('club_submissions').update(row).eq('id', subId).select('id, status, affiliation_match').single()
      : await supabase.from('club_submissions').insert(row).select('id, status, affiliation_match').single();
    setSaving(false);
    if (res.error) {
      toast({ title: "Enregistrement impossible", description: res.error.message, variant: 'destructive' });
      return false;
    }
    setSubId(res.data.id);
    setStatus(res.data.status);
    setAffMatch(res.data.affiliation_match);
    return true;
  };

  const goTo = async (n: number) => {
    if (step === 1 && n > 1 && !step1Valid(p)) {
      toast({ title: 'Étape 1 incomplète', description: "Indiquez votre club, votre rôle et le numéro d'affiliation." });
      return;
    }
    if (step1Valid(p) && !(await save(n))) return;
    setStep(n);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const saveLater = async () => {
    if (!step1Valid(p)) {
      toast({ title: 'Étape 1 incomplète', description: "Complétez l'étape 1 pour pouvoir enregistrer." });
      return;
    }
    if (await save(step)) toast({ title: 'Brouillon enregistré', description: 'Vous pourrez reprendre plus tard.' });
  };

  const submit = async () => {
    if (!certify) return;
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
          <h1 className="mb-4 font-sans text-2xl font-black text-ink">Mon club</h1>
          <p className="mb-6 text-slate-600">Connectez-vous pour réclamer ou gérer la fiche de votre club.</p>
          <Button asChild><Link to="/compte/connexion/">Se connecter</Link></Button>
        </div>
      </Layout>
    );
  }

  if (done) {
    return (
      <Layout>
        <div className="container mx-auto max-w-xl space-y-6 px-4 py-20 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-blue-500" />
          <h1 className="font-sans text-heading-2 font-black text-ink">Merci !</h1>
          <p className="text-body-lg text-slate-600">Votre fiche sera mise à jour après vérification par l'équipe Athlace.</p>
          <Button variant="outline" onClick={() => setDone(false)}>Modifier mes réponses</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="border-b border-border bg-muted py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-sans text-3xl font-black text-ink">Mon club</h1>
          <p className="mt-2 text-slate-600">
            Complétez la fiche de votre club. Vos réponses sont vérifiées par l'équipe Athlace avant publication.
          </p>
          {status === 'submitted' && (
            <p className="mt-3 inline-flex rounded-pill bg-tint-100 px-3 py-1 text-small text-blue-500">
              Fiche envoyée, en attente de vérification - vous pouvez encore la modifier.
            </p>
          )}
        </div>
      </section>

      <div className="container mx-auto max-w-3xl space-y-6 px-4 py-8">
        <StepCard step={step} percent={percent} />

        <div className="space-y-6">
          {step === 1 && (
            <Step1 p={p} set={set} setP={setP} club={club} setClub={setClub} pickClub={pickClub}
              disciplines={discRows.map((r) => r.discipline).sort((a, b) => a.localeCompare(b, 'fr'))}
              subId={subId} affMatch={affMatch} fed={fed} />
          )}
          {step === 2 && <Step2 p={p} set={set} fed={fed} userId={user.id} />}
          {step === 3 && <Step3 p={p} set={set} fed={fed} subOptions={subOptions} />}
          {step === 4 && <Step4 p={p} set={set} fed={fed} />}
          {step === 5 && <Step5 p={p} set={set} fed={fed} />}
          {step === 6 && <Step6 p={p} set={set} fed={fed} />}
          {step === 7 && <Step7 p={p} set={set} questions={questions} />}
          {step === 8 && <Step8 p={p} set={set} fed={fed} club={club} questions={questions} certify={certify} setCertify={setCertify} />}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-6">
          <Button variant="outline" onClick={() => goTo(step - 1)} disabled={step === 1 || saving}>Précédent</Button>
          <Button variant="ghost" onClick={saveLater} disabled={saving} className="rounded-pill bg-surface-alt text-blue-500">
            Enregistrer et finir plus tard
          </Button>
          {step < STEPS.length ? (
            <Button onClick={() => goTo(step + 1)} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Suivant
            </Button>
          ) : (
            <Button onClick={submit} disabled={!certify || saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Envoyer
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

function Step1({
  p, set, setP, club, setClub, pickClub, disciplines, subId, affMatch, fed,
}: StepProps & {
  setP: React.Dispatch<React.SetStateAction<ClubPayload>>;
  club: ClubRow | null; setClub: (c: ClubRow | null) => void; pickClub: (id: string) => void;
  disciplines: string[]; subId: string | null; affMatch: boolean | null;
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
          <div className="flex items-center justify-between gap-3 rounded-xl bg-tint-100 p-4">
            <div>
              <p className="font-bold text-ink">{club.name}</p>
              <p className="text-small text-slate-600">{[club.discipline, club.city].filter(Boolean).join(' · ')}</p>
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
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input className="pl-9" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Nom du club ou ville" aria-label="Rechercher votre club" />
            </div>
            {hits.length > 0 && (
              <ul className="divide-y rounded-xl border">
                {hits.map((h) => (
                  <li key={h.id}>
                    <button type="button" onClick={() => pickClub(h.id)} className="w-full px-4 py-3 text-left hover:bg-tint-100">
                      <span className="font-bold text-ink">{h.name}</span>
                      <span className="block text-small text-slate-600">{[h.discipline, h.city].filter(Boolean).join(' · ')}</span>
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

      <Block title="Vous">
        <Field label="Votre rôle *">
          <div className="flex flex-wrap gap-2">
            {ROLES.map((r) => (
              <button key={r} type="button" aria-pressed={p.role === r} onClick={() => set('role', r)}
                className={cn('rounded-pill border px-3 py-1.5 text-small capitalize',
                  p.role === r ? 'border-primary bg-primary text-primary-foreground' : 'bg-background text-slate-600 hover:border-primary')}>
                {r}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Numéro d'affiliation fédérale *" fed={fed('affiliation_number')} htmlFor="aff">
          <Input id="aff" value={p.affiliation_number ?? ''} onChange={(e) => set('affiliation_number', e.target.value)} />
        </Field>
        {subId && affMatch !== null && (
          affMatch ? (
            <p className="inline-flex items-center gap-1.5 rounded-pill bg-secondary px-3 py-1 text-small font-bold text-secondary-foreground">
              <CheckCircle2 className="h-4 w-4" /> Affiliation vérifiée
            </p>
          ) : (
            <p className="text-small text-slate-600">Vérification manuelle par l'équipe Athlace.</p>
          )
        )}
      </Block>
    </>
  );
}

function Step2({ p, set, fed, userId }: StepProps & { userId: string }) {
  const [uploading, setUploading] = useState(false);
  const upload = async (file: File) => {
    const ext = file.name.split('.').pop() ?? 'jpg';
    const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, { contentType: file.type });
    if (error) { toast({ title: 'Envoi impossible', description: error.message, variant: 'destructive' }); return null; }
    return path;
  };
  const photos = p.photos ?? [];

  return (
    <Block title="Identité">
      <Field label="Logo" fed={fed('logo')}>
        <div className="flex items-center gap-4">
          {p.logo && <MediaImg src={p.logo} alt="Logo du club" className="h-16 w-16 rounded-xl border object-contain" />}
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-pill bg-surface-alt px-4 py-2 text-small font-bold text-blue-500">
            <Upload className="h-4 w-4" /> {p.logo ? 'Remplacer' : 'Ajouter un logo'}
            <input type="file" accept="image/*" className="sr-only" disabled={uploading}
              onChange={async (e) => {
                const f = e.target.files?.[0]; if (!f) return;
                setUploading(true); const path = await upload(f); setUploading(false);
                if (path) set('logo', path);
              }} />
          </label>
        </div>
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Couleur principale" fed={fed('color_1')}>
          <Input type="color" className="h-10 w-20 p-1" value={p.color_1 ?? '#415CAF'} onChange={(e) => set('color_1', e.target.value)} />
        </Field>
        <Field label="Couleur secondaire" fed={fed('color_2')}>
          <Input type="color" className="h-10 w-20 p-1" value={p.color_2 ?? '#D5DC3C'} onChange={(e) => set('color_2', e.target.value)} />
        </Field>
      </div>
      <Field label={`Photos (${photos.length}/6)`} fed={fed('photos')}>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {photos.map((ph, i) => (
            <div key={ph} className="relative">
              <MediaImg src={ph} alt={`Photo ${i + 1}`} className="aspect-square w-full rounded-lg object-cover" />
              <button type="button" aria-label="Retirer la photo" onClick={() => set('photos', photos.filter((x) => x !== ph))}
                className="absolute right-1 top-1 rounded-pill bg-background p-1 text-ink shadow">
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {photos.length < 6 && (
            <label className="flex aspect-square cursor-pointer items-center justify-center rounded-lg border border-dashed text-slate-500 hover:border-primary">
              {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
              <input type="file" accept="image/*" multiple className="sr-only" disabled={uploading}
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
      <Field label="Description" fed={fed('description')} hint={`${(p.description ?? '').length}/500 caractères`}>
        <Textarea rows={5} maxLength={500} value={p.description ?? ''} onChange={(e) => set('description', e.target.value.slice(0, 500))} />
      </Field>
      <Field label="Date de création" fed={fed('creation_date')}>
        <Input type="date" value={p.creation_date ?? ''} onChange={(e) => set('creation_date', e.target.value)} />
      </Field>
    </Block>
  );
}

function Step3({ p, set, fed, subOptions }: StepProps & { subOptions: string[] }) {
  return (
    <>
      <Block title="Pratique">
        <Field label="Sous-disciplines" fed={fed('sub_disciplines')}>
          {subOptions.length > 0 ? (
            <div className="grid gap-2 sm:grid-cols-2">
              {subOptions.map((o) => {
                const on = (p.sub_disciplines ?? []).includes(o);
                return (
                  <label key={o} className="flex items-center gap-2 text-small text-ink">
                    <Checkbox checked={on} onCheckedChange={(c) =>
                      set('sub_disciplines', c ? [...(p.sub_disciplines ?? []), o] : (p.sub_disciplines ?? []).filter((x) => x !== o))} />
                    {o}
                  </label>
                );
              })}
            </div>
          ) : <p className="text-small text-slate-500">Aucune sous-discipline connue pour ce sport.</p>}
        </Field>
        <Field label="Autre sous-discipline">
          <Input value={p.sub_other ?? ''} onChange={(e) => set('sub_other', e.target.value)} />
        </Field>
        <Field label="Publics" fed={fed('audiences')}>
          <Chips options={[...new Set([...AUDIENCES, ...(p.audiences ?? [])])]} value={p.audiences} onChange={(v) => set('audiences', v)} />
        </Field>
        <Field label="Catégories d'âge" fed={fed('age_categories')}>
          <Chips options={[...new Set([...AGE_CATEGORIES, ...(p.age_categories ?? [])])]} value={p.age_categories} onChange={(v) => set('age_categories', v)} />
        </Field>
      </Block>

      <Block title="Niveau du club">
        <Field label="Type de pratique">
          <div className="flex flex-wrap gap-2">
            {LEVELS.map((l) => (
              <button key={l.v} type="button" aria-pressed={p.practice_level === l.v}
                onClick={() => set('practice_level', p.practice_level === l.v ? undefined : l.v)}
                className={cn('rounded-pill border px-3 py-1.5 text-small',
                  p.practice_level === l.v ? 'border-primary bg-primary text-primary-foreground' : 'bg-background text-slate-600 hover:border-primary')}>
                {l.l}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Ligue ou division" fed={fed('league')}>
          <Input value={p.league ?? ''} onChange={(e) => set('league', e.target.value)} />
        </Field>
      </Block>

      <Block title="Prérequis pour s'inscrire">
        <Field label="Débutants acceptés"><YesNo value={p.beginners_ok} onChange={(v) => set('beginners_ok', v)} /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Âge minimum" fed={fed('min_age')}>
            <Input type="number" min={0} value={p.min_age ?? ''} onChange={(e) => set('min_age', e.target.value)} />
          </Field>
          <Field label="Âge maximum">
            <Input type="number" min={0} value={p.max_age ?? ''} onChange={(e) => set('max_age', e.target.value)} />
          </Field>
        </div>
        <Field label="Niveau ou grade requis">
          <Input value={p.required_level ?? ''} onChange={(e) => set('required_level', e.target.value)} />
        </Field>
        <Field label="Certificat médical ou questionnaire de santé demandé">
          <YesNo value={p.health_certificate} onChange={(v) => set('health_certificate', v)} />
        </Field>
        <Field label="Autres conditions">
          <Textarea rows={3} value={p.other_conditions ?? ''} onChange={(e) => set('other_conditions', e.target.value)} />
        </Field>
      </Block>
    </>
  );
}

function Step4({ p, set, fed }: StepProps) {
  const venues = p.venues ?? [];
  const schedules = p.schedules ?? [];
  const upV = (i: number, patch: Partial<VenueDraft>) => set('venues', venues.map((v, j) => (j === i ? { ...v, ...patch } : v)));
  const upS = (i: number, patch: Partial<ScheduleDraft>) => set('schedules', schedules.map((v, j) => (j === i ? { ...v, ...patch } : v)));

  return (
    <>
      <Block title="Lieux">
        {fed('venues') && <FedBadge />}
        {venues.map((v, i) => (
          <div key={i} className="grid gap-3 rounded-xl border p-4 sm:grid-cols-[1fr_2fr_auto_auto] sm:items-end">
            <Field label="Nom"><Input value={v.name} onChange={(e) => upV(i, { name: e.target.value })} /></Field>
            <Field label="Adresse"><Input value={v.address} onChange={(e) => upV(i, { address: e.target.value })} /></Field>
            <label className="flex items-center gap-2 pb-2 text-small text-ink">
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

      <Block title="Créneaux">
        {fed('schedules') && <FedBadge />}
        {schedules.map((s, i) => (
          <div key={i} className="grid gap-3 rounded-xl border p-4 sm:grid-cols-3">
            <Field label="Jour">
              <select className={selectCls} value={s.day} onChange={(e) => upS(i, { day: e.target.value })}>
                <option value="">-</option>
                {[...new Set([...DAYS, s.day].filter(Boolean))].map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </Field>
            <Field label="Début"><Input type="time" value={s.start_time} onChange={(e) => upS(i, { start_time: e.target.value })} /></Field>
            <Field label="Fin"><Input type="time" value={s.end_time} onChange={(e) => upS(i, { end_time: e.target.value })} /></Field>
            <Field label="Catégorie"><Input value={s.category} onChange={(e) => upS(i, { category: e.target.value })} /></Field>
            <Field label="Niveau"><Input value={s.level} onChange={(e) => upS(i, { level: e.target.value })} /></Field>
            <Field label="Lieu">
              <div className="flex gap-2">
                <select className={selectCls} value={s.venue} onChange={(e) => upS(i, { venue: e.target.value })}>
                  <option value="">-</option>
                  {[...new Set([...venues.map((v) => v.name).filter(Boolean), s.venue].filter(Boolean))].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
                <Button variant="ghost" size="icon" aria-label="Supprimer le créneau" onClick={() => set('schedules', schedules.filter((_, j) => j !== i))}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Field>
          </div>
        ))}
        <Button variant="outline" onClick={() => set('schedules', [...schedules, { day: '', start_time: '', end_time: '', category: '', level: '', venue: '' }])}>
          <Plus className="mr-1 h-4 w-4" /> Ajouter un créneau
        </Button>
      </Block>
    </>
  );
}

function Step5({ p, set, fed }: StepProps) {
  const prices = p.prices ?? [];
  const up = (i: number, patch: Partial<PriceDraft>) => set('prices', prices.map((v, j) => (j === i ? { ...v, ...patch } : v)));
  return (
    <>
      <Block title="Tarifs">
        {fed('prices') && <FedBadge />}
        {prices.map((x, i) => (
          <div key={i} className="grid gap-3 rounded-xl border p-4 sm:grid-cols-[2fr_1fr_1fr_auto_auto] sm:items-end">
            <Field label="Libellé"><Input placeholder="Adulte loisir" value={x.label} onChange={(e) => up(i, { label: e.target.value })} /></Field>
            <Field label="Montant (€)"><Input type="number" min={0} step="0.01" value={x.amount} onChange={(e) => up(i, { amount: e.target.value })} /></Field>
            <Field label="Période">
              <select className={selectCls} value={x.period} onChange={(e) => up(i, { period: e.target.value as PriceDraft['period'] })}>
                {PERIODS.map((pp) => <option key={pp} value={pp}>{pp}</option>)}
              </select>
            </Field>
            <label className="flex items-center gap-2 pb-2 text-small text-ink">
              <Checkbox checked={x.includes_license} onCheckedChange={(c) => up(i, { includes_license: !!c })} /> Licence incluse
            </label>
            <Button variant="ghost" size="icon" aria-label="Supprimer le tarif" onClick={() => set('prices', prices.filter((_, j) => j !== i))}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button variant="outline" onClick={() => set('prices', [...prices, { label: '', amount: '', period: 'saison', includes_license: true }])}>
          <Plus className="mr-1 h-4 w-4" /> Ajouter un tarif
        </Button>
      </Block>

      <Block title="Inscription">
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
        <Field label="Liste d'attente"><YesNo value={p.waitlist} onChange={(v) => set('waitlist', v)} /></Field>
        <Field label="Paiement en plusieurs fois"><YesNo value={p.installments} onChange={(v) => set('installments', v)} /></Field>
        <Field label="Aides acceptées"><Chips options={AIDS} value={p.aids} onChange={(v) => set('aids', v)} /></Field>
        <Field label="Pièces à fournir">
          <Textarea rows={3} value={p.documents ?? ''} onChange={(e) => set('documents', e.target.value)} />
        </Field>
        <Field label="Lien d'inscription en ligne" fed={fed('registration_url')}>
          <Input type="url" placeholder="https://" value={p.registration_url ?? ''} onChange={(e) => set('registration_url', e.target.value)} />
        </Field>
      </Block>
    </>
  );
}

function Step6({ p, set, fed }: StepProps) {
  return (
    <Block title="Encadrement et vie du club">
      <Field label="Nombre d'encadrants diplômés">
        <Input type="number" min={0} className="w-32" value={p.coaches_certified ?? ''} onChange={(e) => set('coaches_certified', e.target.value)} />
      </Field>
      <Field label="Labels" fed={fed('labels')} hint="Séparés par des virgules">
        <Input value={p.labels ?? ''} onChange={(e) => set('labels', e.target.value)} />
      </Field>
      <Field label="Ambiance">
        <div className="flex items-center gap-4 text-small text-slate-600">
          <span>Conviviale</span>
          <Slider className="flex-1" min={0} max={100} step={5} value={[p.ambiance ?? 50]}
            onValueChange={([v]) => set('ambiance', v)} aria-label="Ambiance, de conviviale à compétitive" />
          <span>Compétitive</span>
        </div>
        {p.ambiance == null && <p className="text-caption text-slate-500">Déplacez le curseur pour répondre.</p>}
      </Field>
      <Field label="Équipements" fed={fed('amenities')}>
        <Chips options={[...new Set([...AMENITIES, ...(p.amenities ?? [])])]} value={p.amenities} onChange={(v) => set('amenities', v)} />
      </Field>
      <Field label="Accessible aux personnes à mobilité réduite"><YesNo value={p.pmr} onChange={(v) => set('pmr', v)} /></Field>
      <Field label="Événements annuels">
        <Textarea rows={3} value={p.events ?? ''} onChange={(e) => set('events', e.target.value)} />
      </Field>
      <Field label="Le club cherche des bénévoles"><YesNo value={p.volunteers} onChange={(v) => set('volunteers', v)} /></Field>
    </Block>
  );
}

function Step7({ p, set, questions }: Omit<StepProps, 'fed'> & { questions: SportQuestion[] }) {
  const answers = p.sport_answers ?? {};
  const setA = (k: string, v: unknown) => set('sport_answers', { ...answers, [k]: v });
  if (questions.length === 0) {
    return <Block title="Spécifique au sport"><p className="text-small text-slate-600">Aucune question spécifique pour ce sport.</p></Block>;
  }
  return (
    <Block title="Spécifique au sport">
      {questions.map((q) => {
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
  );
}

const RECAP: [keyof ClubPayload, string][] = [
  ['role', 'Rôle'], ['affiliation_number', "N° d'affiliation"], ['description', 'Description'], ['creation_date', 'Date de création'],
  ['video_url', 'Vidéo'], ['sub_disciplines', 'Sous-disciplines'], ['sub_other', 'Autre sous-discipline'], ['audiences', 'Publics'],
  ['age_categories', "Catégories d'âge"], ['practice_level', 'Type de pratique'], ['league', 'Ligue ou division'],
  ['beginners_ok', 'Débutants acceptés'], ['min_age', 'Âge minimum'], ['max_age', 'Âge maximum'], ['required_level', 'Niveau requis'],
  ['health_certificate', 'Certificat / questionnaire santé'], ['other_conditions', 'Autres conditions'],
  ['trial', "Séance d'essai"], ['trial_sessions', 'Séances gratuites'], ['registration_start', 'Début inscriptions'],
  ['registration_end', 'Fin inscriptions'], ['season_start', 'Reprise'], ['waitlist', "Liste d'attente"],
  ['installments', 'Paiement en plusieurs fois'], ['aids', 'Aides acceptées'], ['documents', 'Pièces à fournir'],
  ['registration_url', "Lien d'inscription"], ['coaches_certified', 'Encadrants diplômés'], ['labels', 'Labels'],
  ['ambiance', 'Ambiance (0 conviviale - 100 compétitive)'], ['amenities', 'Équipements'], ['pmr', 'Accessibilité PMR'],
  ['events', 'Événements annuels'], ['volunteers', 'Cherche des bénévoles'],
  ['email', 'Email'], ['phone', 'Téléphone'], ['website', 'Site web'], ['instagram_url', 'Instagram'], ['facebook_url', 'Facebook'],
  ['tiktok_url', 'TikTok'], ['youtube_url', 'YouTube'], ['linkedin_url', 'LinkedIn'],
];

const fmt = (v: unknown): string =>
  v === true ? 'Oui' : v === false ? 'Non' : Array.isArray(v) ? v.join(', ') : String(v);

function Step8({
  p, set, fed, club, questions, certify, setCertify,
}: StepProps & { club: ClubRow | null; questions: SportQuestion[]; certify: boolean; setCertify: (v: boolean) => void }) {
  const contact: [keyof ClubPayload, string, string][] = [
    ['email', 'Email', 'email'], ['phone', 'Téléphone', 'tel'], ['website', 'Site web', 'url'],
    ['instagram_url', 'Instagram', 'url'], ['facebook_url', 'Facebook', 'url'], ['tiktok_url', 'TikTok', 'url'],
    ['youtube_url', 'YouTube', 'url'], ['linkedin_url', 'LinkedIn', 'url'],
  ];
  const clubName = club?.name ?? p.new_club?.name;
  return (
    <>
      <Block title="Contact">
        <div className="grid gap-4 sm:grid-cols-2">
          {contact.map(([k, l, type]) => (
            <Field key={k} label={l} fed={fed(k)}>
              <Input type={type} value={(p[k] as string) ?? ''} onChange={(e) => set(k, e.target.value as never)} />
            </Field>
          ))}
        </div>
      </Block>

      <Block title="Récapitulatif">
        <dl className="grid gap-x-6 gap-y-3 text-small sm:grid-cols-[auto_1fr]">
          <dt className="font-bold text-ink">Club</dt>
          <dd className="text-slate-600">{clubName ?? '-'}</dd>
          {RECAP.filter(([k]) => isFilled(p[k])).map(([k, l]) => (
            <div key={k} className="contents">
              <dt className="font-bold text-ink">{l}</dt>
              <dd className="break-words text-slate-600">{fmt(p[k])}</dd>
            </div>
          ))}
          {isFilled(p.logo) && (<><dt className="font-bold text-ink">Logo</dt><dd className="text-slate-600">Fourni</dd></>)}
          {isFilled(p.photos) && (<><dt className="font-bold text-ink">Photos</dt><dd className="text-slate-600">{p.photos!.length}</dd></>)}
          {isFilled(p.venues) && (
            <><dt className="font-bold text-ink">Lieux</dt>
              <dd className="text-slate-600">{p.venues!.map((v) => [v.name, v.address].filter(Boolean).join(' - ') + (v.is_main ? ' (principal)' : '')).join(' ; ')}</dd></>
          )}
          {isFilled(p.schedules) && (
            <><dt className="font-bold text-ink">Créneaux</dt>
              <dd className="text-slate-600">{p.schedules!.map((s) => `${s.day} ${s.start_time}-${s.end_time}${s.category ? ` ${s.category}` : ''}${s.venue ? ` @ ${s.venue}` : ''}`).join(' ; ')}</dd></>
          )}
          {isFilled(p.prices) && (
            <><dt className="font-bold text-ink">Tarifs</dt>
              <dd className="text-slate-600">{p.prices!.map((x) => `${x.label} : ${x.amount} € / ${x.period}${x.includes_license ? ' (licence incluse)' : ''}`).join(' ; ')}</dd></>
          )}
          {questions.filter((q) => isFilled(p.sport_answers?.[q.key])).map((q) => (
            <div key={q.id} className="contents">
              <dt className="font-bold text-ink">{q.label}</dt>
              <dd className="text-slate-600">{fmt(p.sport_answers![q.key])}</dd>
            </div>
          ))}
        </dl>
      </Block>

      <label className="flex items-start gap-3 rounded-2xl border bg-tint-100 p-4 text-small text-ink">
        <Checkbox checked={certify} onCheckedChange={(c) => setCertify(!!c)} className="mt-0.5" />
        <span>Je certifie représenter ce club. *</span>
      </label>
    </>
  );
}
