// Page « Mon club » : formulaire en 5 étapes où un responsable propose ou complète la fiche de son club.
// Chaque étape est dans src/pages/my-club/ ; cette page gère le chargement, la sauvegarde et la navigation.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { fetchAvailableDisciplines } from '@/hooks/useAvailableDisciplines';
import { toast } from '@/hooks/use-toast';
import { clubIdentified, completionPercent, flattenPayload, isFilled, missingRequired, prefillFromClub, upgradePayload, type ClubPayload } from '@/lib/club-form';
import { ARBORESCENCE } from '@/data/disciplines';
import { getSportFormSpec } from '@/data/club-form-catalog';
import { STEPS, type ClubRow } from './my-club/constants';
import { StepCard, Pager } from './my-club/widgets';
import { Step1 } from './my-club/Step1Club';
import { Step2 } from './my-club/Step2Identity';
import { Step3 } from './my-club/Step3Teams';
import { Step4 } from './my-club/Step4Sport';
import { Step5 } from './my-club/Step5Summary';

/* ---------- Données ---------- */

async function loadClubPrefill(clubId: string) {
  // get_club_for_claim lit la fiche même quand la fédération n'a pas encore donné son accord (phase de test),
  // sans email ni téléphone ; ceux-ci ne sont préremplis que si la fiche est publiée (get_club_contact).
  const [res, contact] = await Promise.all([
    supabase.rpc('get_club_for_claim', { p_club_id: clubId }),
    supabase.rpc('get_club_contact', { p_club_id: clubId }),
  ]);
  const data = res.data as { club: Record<string, unknown>; venues: Record<string, unknown>[]; schedules: Record<string, unknown>[]; prices: Record<string, unknown>[] } | null;
  if (!data?.club) return null;
  const c = Array.isArray(contact.data) ? contact.data[0] : null;
  return {
    club: data.club as unknown as ClubRow,
    prefill: prefillFromClub(data.club, c ?? null, data.venues ?? [], data.schedules ?? [], data.prices ?? []),
  };
}
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
        setP(upgradePayload(payload));
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
            setP(upgradePayload({ ...r.prefill, club_id: r.club.id }));
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
    setP((o) => upgradePayload({ ...r.prefill, role: o.role, affiliation_number: o.affiliation_number, club_id: id, new_club: null }));
  };

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

  const percent = completionPercent(p);
  // Référentiel du sport (catégories, divisions, labels, dotation…) d'après la discipline du club.
  const spec = useMemo(() => {
    for (const family of ARBORESCENCE) {
      const sport = family.sports.find((sp) => sp.match.includes(discipline) || sp.name === discipline);
      if (sport) return { ...getSportFormSpec(sport.name, family.id), sportName: sport.name };
    }
    return { ...getSportFormSpec(null, null), sportName: discipline };
  }, [discipline]);
  const missing = missingRequired(p);

  const save = useCallback(async (nextStep: number, extra?: { status?: 'submitted' }) => {
    if (!user) return false;
    setSaving(true);
    setSaveState('saving');
    const flat = flattenPayload(p);
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

      <div className="container mx-auto max-w-6xl space-y-6 px-4 py-8">
        <StepCard step={step} percent={percent} onGo={goTo} canLeaveFirst={clubIdentified(p)} saveState={saveState} />

        <div className="space-y-6">
          {step === 1 && (
            <Step1 p={p} set={set} setP={setP} club={club} setClub={setClub} pickClub={pickClub}
              disciplines={discRows.map((r) => r.discipline).sort((a, b) => a.localeCompare(b, 'fr'))} fed={fed} />
          )}
          {step === 2 && <Step2 p={p} set={set} fed={fed} userId={user.id} />}
          {step === 3 && <Step3 p={p} set={set} fed={fed} subOptions={subOptions} spec={spec} />}
          {step === 4 && <Step4 p={p} set={set} fed={fed} spec={spec} />}
          {step === 5 && (
            <Step5 p={p} set={set} fed={fed} club={club} spec={spec} certify={certify} setCertify={setCertify}
              subId={subId} affMatch={affMatch} missing={missing} onEdit={goTo} />
          )}
        </div>

        <Pager step={step} onGo={goTo} canLeaveFirst={clubIdentified(p)} saving={saving} last={
          step < STEPS.length ? (
            <Button onClick={() => goTo(step + 1)} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Suivant
            </Button>
          ) : (
            <Button onClick={submit} disabled={!certify || missing.length > 0 || saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Envoyer pour vérification
            </Button>
          )
        } />
      </div>
    </Layout>
  );
}
