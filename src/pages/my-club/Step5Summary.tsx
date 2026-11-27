// Étape 5 du formulaire « Mon club » : récapitulatif avant envoi.

import { CheckCircle2, Pencil, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { isFilled, type ClubPayload } from '@/lib/club-form';
import { type SportFormSpec } from '@/data/club-form-catalog';
import { ROLES, LEVELS, REGISTRATION, type ClubRow } from './constants';
import { Field, Block, Row } from './widgets';
import { type StepProps } from './types';

/* Étape 5 · Récapitulatif et attestation */
const fmt = (v: unknown): string =>
  v === true ? 'Oui' : v === false ? 'Non' : Array.isArray(v) ? v.join(', ') : String(v);

const RECAP: { page: number; title: string; fields: [keyof ClubPayload, string][] }[] = [
  { page: 1, title: 'Votre club et contact', fields: [['email', 'Email'], ['phone', 'Téléphone'], ['website', 'Site web']] },
  { page: 2, title: 'Identité et description', fields: [
    ['description', 'Description'], ['creation_date', 'Date de création'], ['health_certificate', 'Certificat / questionnaire santé'],
    ['specific_conditions', 'Conditions spécifiques'], ['amenities', 'Équipements'], ['pmr', 'Accessibilité PMR'], ['video_urls', 'Vidéos'],
  ] },
  { page: 3, title: 'Équipes et groupes', fields: [
    ['registration_start', 'Début des inscriptions'], ['registration_end', 'Fin des inscriptions'], ['season_start', 'Reprise de la saison'],
    ['trial', "Séance d'essai"], ['trial_sessions', 'Séances gratuites'], ['installments', 'Paiement en plusieurs fois'],
    ['aids', 'Aides acceptées'], ['aids_other', 'Autre aide'], ['documents_list', 'Pièces à fournir'], ['registration_url', "Lien d'inscription"],
  ] },
  { page: 4, title: 'Spécificités du sport', fields: [
    ['labels_list', 'Labels'], ['prerequisite', 'Niveau requis'], ['equipment_provided', 'Dotation fournie'],
    ['equipment_to_buy', 'Matériel à acheter'], ['sport_notes', 'Autres précisions'],
  ] },
];

export function Step5({
  p, set, fed, club, spec, certify, setCertify, subId, affMatch, missing, onEdit,
}: StepProps & {
  club: ClubRow | null; spec: SportFormSpec; certify: boolean; setCertify: (v: boolean) => void;
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
              {sec.page === 1 && (p.socials ?? []).filter((x) => x.url.trim()).map((x, i) => <Row key={`s${i}`} label={x.network}>{x.url}</Row>)}
              {sec.page === 2 && isFilled(p.logo) && <Row label="Logo">Fourni</Row>}
              {sec.page === 2 && isFilled(p.venues) && (
                <Row label="Lieux">{p.venues!.map((v) => [v.name, v.address].filter(Boolean).join(' - ') + (v.is_main ? ' (principal)' : '')).join(' ; ')}</Row>
              )}
              {sec.page === 2 && isFilled(p.photos) && <Row label="Photos">{p.photos!.length}</Row>}
              {sec.page === 3 && (p.teams ?? []).map((t, i) => (
                <Row key={t.id} label={t.name.trim() || `Équipe ou groupe ${i + 1}`}>
                  {[
                    t.sub_discipline, t.gender, t.categories.join(', '),
                    t.min_age || t.max_age ? `${t.min_age || '?'} à ${t.max_age || '?'} ans` : '',
                    t.beginners_ok === true ? 'Débutants acceptés' : '',
                    LEVELS.find((l) => l.v === t.level)?.l, t.division,
                    t.slots.filter((sl) => sl.day).map((sl) => `${sl.day} ${sl.start_time}-${sl.end_time}${sl.venue ? ` (${sl.venue})` : ''}`).join(', '),
                    t.prices.filter((x) => x.amount).map((x) => `${x.label ? `${x.label} ` : ''}${x.amount} € / ${x.period}`).join(', '),
                    REGISTRATION.find((r) => r.v === t.registration)?.l,
                    t.coaches_count ? `${t.coaches_count} encadrant(s)${t.coach_types.length ? ` (${[...t.coach_types, ...(t.coach_titles ?? [])].join(', ')})` : ''}` : '',
                  ].filter(Boolean).join(' · ') || '-'}
                </Row>
              ))}
              {rows.map(([k, l]) => <Row key={k} label={l}>{fmt(p[k])}</Row>)}
              {sec.page === 4 && (spec.extras ?? []).filter((q) => isFilled(p.sport_answers?.[q.key])).map((q) => (
                <Row key={q.key} label={q.label}>{fmt(p.sport_answers![q.key])}</Row>
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
