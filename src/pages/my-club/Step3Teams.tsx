// Étape 3 du formulaire « Mon club » : équipes et groupes (saisie une par une ou import en masse).

import { useState } from 'react';
import { Plus, Trash2, Upload, Copy, Download, FileSpreadsheet, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { newTeam, type PriceDraft, type TeamDraft, type TeamSlot } from '@/lib/club-form';
import { parseTeamsCsv, teamTemplateCsv } from '@/lib/team-import';
import { COACH_TYPES, GENDERS, type SportFormSpec } from '@/data/club-form-catalog';
import { LEVELS, REGISTRATION, COACH_COUNTS, DAYS, PERIODS, AIDS } from './constants';
import { FedBadge, Field, Block, Chips, YesNo, selectCls, PillChoice, ListInput, SelectOther } from './widgets';
import { type StepProps } from './types';

/** Équipe ajoutée par défaut et jamais remplie : remplacée lors d'un ajout groupé ou d'un import. */
const isEmptyTeam = (t: TeamDraft) =>
  !t.categories.length && !t.gender && !t.sub_discipline && !t.level && !t.slots.length && !t.prices.length && !t.venues.length;

/**
 * Remplir vite beaucoup d'équipes : création groupée (une équipe par catégorie cochée, avec lieux, créneaux,
 * tarifs et encadrants repris d'une équipe modèle) ou import d'un fichier Excel/CSV à partir du modèle.
 */

export function TeamsBulk({ spec, teams, onAdd }: { spec: SportFormSpec; teams: TeamDraft[]; onAdd: (t: TeamDraft[]) => void }) {
  const [mode, setMode] = useState<'' | 'bulk' | 'file'>('');
  const [gender, setGender] = useState('');
  const [cats, setCats] = useState<string[]>([]);
  const [level, setLevel] = useState<TeamDraft['level']>('');
  const [modelId, setModelId] = useState('');
  const [report, setReport] = useState<{ ok: number; errors: string[] } | null>(null);
  const models = teams.filter((t) => !isEmptyTeam(t));
  const label = (t: TeamDraft, i: number) => t.name.trim() || [t.gender, t.categories[0]].filter(Boolean).join(' · ') || `Équipe ${i + 1}`;

  const create = () => {
    const model = teams.find((t) => t.id === modelId);
    const add = cats.map((c) => {
      const base = model ? structuredClone(model) : newTeam();
      return { ...base, id: newTeam().id, name: '', gender, categories: [c], level: level || base.level, division: model ? '' : base.division };
    });
    onAdd(add);
    toast({ title: `${add.length} équipe${add.length > 1 ? 's' : ''} ajoutée${add.length > 1 ? 's' : ''}`, description: 'Complétez les créneaux et tarifs propres à chacune.' });
    setCats([]); setMode('');
  };

  const download = () => {
    const blob = new Blob([teamTemplateCsv(spec.categories)], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'athlace-modele-equipes.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const importFile = async (file: File) => {
    if (/\.xlsx?$/i.test(file.name)) {
      setReport({ ok: 0, errors: ['Fichier Excel (.xlsx) : dans Excel, faites « Enregistrer sous » puis choisissez « CSV (séparateur : point-virgule) », et importez ce fichier.'] });
      return;
    }
    const res = parseTeamsCsv(await file.text());
    if (res.teams.length) onAdd(res.teams);
    setReport({ ok: res.teams.length, errors: res.errors });
  };

  return (
    <div className="space-y-4 rounded-2xl border border-dashed bg-creme/40 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <p className="mr-auto text-small font-bold text-nuit">Beaucoup d'équipes ? Gagnez du temps :</p>
        <Button variant={mode === 'bulk' ? 'default' : 'outline'} size="sm" onClick={() => setMode(mode === 'bulk' ? '' : 'bulk')}>
          <Layers className="mr-1 h-4 w-4" /> Créer plusieurs équipes d'un coup
        </Button>
        <Button variant={mode === 'file' ? 'default' : 'outline'} size="sm" onClick={() => setMode(mode === 'file' ? '' : 'file')}>
          <FileSpreadsheet className="mr-1 h-4 w-4" /> Importer un fichier Excel
        </Button>
      </div>

      {mode === 'bulk' && (
        <div className="space-y-4 rounded-xl bg-background p-4">
          <Field label="Genre"><PillChoice options={GENDERS.map((g) => ({ v: g, l: g }))} value={gender} onChange={setGender} /></Field>
          <Field label="Catégories (une équipe sera créée par catégorie cochée)">
            <Chips options={spec.categories} value={cats} onChange={setCats} />
          </Field>
          <Field label="Niveau"><PillChoice options={LEVELS} value={level} onChange={(v) => setLevel(v as TeamDraft['level'])} /></Field>
          {models.length > 0 && (
            <Field label="Reprendre les lieux, créneaux, tarifs et encadrants de" hint="Facultatif : vous ajusterez ensuite chaque équipe.">
              <select className={cn(selectCls, 'max-w-sm')} value={modelId} onChange={(e) => setModelId(e.target.value)}>
                <option value="">Aucune (équipes vides)</option>
                {models.map((t, i) => <option key={t.id} value={t.id}>{label(t, i)}</option>)}
              </select>
            </Field>
          )}
          <Button onClick={create} disabled={!cats.length}>
            <Plus className="mr-1 h-4 w-4" /> Créer {cats.length || ''} équipe{cats.length > 1 ? 's' : ''}
          </Button>
        </div>
      )}

      {mode === 'file' && (
        <div className="space-y-3 rounded-xl bg-background p-4 text-small text-nuit">
          <ol className="list-decimal space-y-1 pl-5 text-nuit/70">
            <li>Téléchargez le modèle et ouvrez-le dans Excel (ou Google Sheets).</li>
            <li>Une ligne par créneau : répétez le même nom d'équipe pour lui donner plusieurs créneaux.</li>
            <li>Enregistrez au format CSV, puis importez-le ici. Les équipes s'ajoutent à la liste, vous pouvez tout modifier ensuite.</li>
          </ol>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={download}><Download className="mr-1 h-4 w-4" /> Télécharger le modèle</Button>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-pill bg-primary px-4 py-2 text-small font-bold text-primary-foreground">
              <Upload className="h-4 w-4" /> Importer le fichier
              <input type="file" accept=".csv,text/csv,.xlsx,.xls" className="sr-only"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) importFile(f); e.target.value = ''; }} />
            </label>
          </div>
          {report && (
            <div className="space-y-1 rounded-xl bg-creme p-3">
              {report.ok > 0 && <p className="font-bold">{report.ok} équipe{report.ok > 1 ? 's' : ''} importée{report.ok > 1 ? 's' : ''}.</p>}
              {report.errors.map((e) => <p key={e} className="text-nuit/70">{e}</p>)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* Étape 3 · Équipes et groupes : un bloc par équipe (pratique, public, niveau, lieux, créneaux, tarifs, encadrants, inscriptions) */
export function TeamBlock({ t, index, onChange, onRemove, onDuplicate, venueNames, subOptions, spec }: {
  t: TeamDraft; index: number; onChange: (t: TeamDraft) => void; onRemove: () => void; onDuplicate: () => void;
  venueNames: string[]; subOptions: string[]; spec: SportFormSpec;
}) {
  const up = (patch: Partial<TeamDraft>) => onChange({ ...t, ...patch });
  const upSlot = (i: number, patch: Partial<TeamSlot>) => up({ slots: t.slots.map((x, j) => (j === i ? { ...x, ...patch } : x)) });
  const upPrice = (i: number, patch: Partial<PriceDraft>) => up({ prices: t.prices.map((x, j) => (j === i ? { ...x, ...patch } : x)) });
  const slotVenues = [...new Set([...(t.venues.length ? t.venues : venueNames), ...t.slots.map((x) => x.venue)].filter(Boolean))];
  const divisions = [...new Set([...(t.gender === 'Femmes' && spec.divisionsF ? spec.divisionsF : spec.divisions), t.division].filter(Boolean))];
  const competes = t.level === 'competition' || t.level === 'les_deux';
  const hasCoaches = t.coaches_count !== '' && t.coaches_count !== '0';

  return (
    <div className="space-y-5 rounded-2xl border bg-background p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-sans text-subtitle font-bold text-nuit">
          {t.name.trim() || [t.gender, ...t.categories].filter(Boolean).join(' · ') || `Équipe ou groupe ${index + 1}`}
        </h3>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={onDuplicate}><Copy className="mr-1 h-4 w-4" />Dupliquer</Button>
          <Button variant="ghost" size="sm" onClick={onRemove}><Trash2 className="mr-1 h-4 w-4" />Retirer</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
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

      <div className="grid gap-4 md:grid-cols-[auto_1fr]">
        <Field label="Genre"><PillChoice options={GENDERS.map((g) => ({ v: g, l: g }))} value={t.gender} onChange={(v) => up({ gender: v })} /></Field>
        <Field label="Catégorie" hint="Catégorie officielle de la fédération. Une équipe = une catégorie.">
          <SelectOther options={spec.categories} value={t.categories[0] ?? ''} onChange={(v) => up({ categories: v ? [v] : [] })} otherLabel="Autre catégorie…" />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Field label="Débutants acceptés"><YesNo value={t.beginners_ok} onChange={(v) => up({ beginners_ok: v })} /></Field>
        <Field label="Âge minimum"><Input type="number" min={0} className="w-28" value={t.min_age} onChange={(e) => up({ min_age: e.target.value })} /></Field>
        <Field label="Âge maximum"><Input type="number" min={0} className="w-28" value={t.max_age} onChange={(e) => up({ max_age: e.target.value })} /></Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Niveau"><PillChoice options={LEVELS} value={t.level} onChange={(v) => up({ level: v })} /></Field>
        {competes && divisions.length > 0 && (
          <Field label="Division ou niveau de compétition">
            <select className={selectCls} value={t.division} onChange={(e) => up({ division: e.target.value })}>
              <option value="">-</option>
              {divisions.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </Field>
        )}
      </div>

      <Field label="Lieux">
        {venueNames.length > 0
          ? <Chips options={[...new Set([...venueNames, ...t.venues])]} value={t.venues} onChange={(v) => up({ venues: v })} />
          : <p className="text-small text-nuit/70">Ajoutez vos lieux de pratique à l'étape 2 pour les choisir ici.</p>}
      </Field>

      <div className="grid gap-5 xl:grid-cols-2">
        <Field label="Créneaux *">
          <div className="space-y-2">
            {t.slots.map((sl, i) => (
              <div key={i} className="grid grid-cols-2 gap-2 rounded-xl border p-3 sm:grid-cols-[1fr_6.5rem_6.5rem_1.3fr_auto] sm:items-center">
                <select aria-label="Jour" className={selectCls} value={sl.day} onChange={(e) => upSlot(i, { day: e.target.value })}>
                  <option value="">Jour</option>
                  {[...new Set([...DAYS, sl.day].filter(Boolean))].map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                <select aria-label="Lieu" className={cn(selectCls, 'sm:order-4')} value={sl.venue} onChange={(e) => upSlot(i, { venue: e.target.value })}>
                  <option value="">Lieu</option>
                  {slotVenues.map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
                <Input aria-label="Début" type="time" className="sm:order-2" value={sl.start_time} onChange={(e) => upSlot(i, { start_time: e.target.value })} />
                <Input aria-label="Fin" type="time" className="sm:order-3" value={sl.end_time} onChange={(e) => upSlot(i, { end_time: e.target.value })} />
                <Button variant="ghost" size="icon" className="sm:order-5" aria-label="Supprimer le créneau" onClick={() => up({ slots: t.slots.filter((_, j) => j !== i) })}>
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
              <div key={i} className="grid grid-cols-2 gap-2 rounded-xl border p-3 sm:grid-cols-[1.5fr_6rem_7rem_auto] sm:items-center">
                <Input aria-label="Libellé du tarif" className="col-span-2 sm:col-span-1" placeholder="Cotisation annuelle" value={x.label} onChange={(e) => upPrice(i, { label: e.target.value })} />
                <Input aria-label="Montant en euros" type="number" min={0} step="0.01" placeholder="€" value={x.amount} onChange={(e) => upPrice(i, { amount: e.target.value })} />
                <select aria-label="Période" className={selectCls} value={x.period} onChange={(e) => upPrice(i, { period: e.target.value as PriceDraft['period'] })}>
                  {PERIODS.map((pp) => <option key={pp} value={pp}>{pp}</option>)}
                </select>
                <Button variant="ghost" size="icon" aria-label="Supprimer le tarif" onClick={() => up({ prices: t.prices.filter((_, j) => j !== i) })}>
                  <Trash2 className="h-4 w-4" />
                </Button>
                <label className="col-span-2 flex items-center gap-2 text-small text-nuit sm:col-span-4">
                  <Checkbox checked={x.includes_license} onCheckedChange={(c) => upPrice(i, { includes_license: !!c })} /> Licence incluse
                </label>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => up({ prices: [...t.prices, { label: '', amount: '', period: 'saison', includes_license: true }] })}>
              <Plus className="mr-1 h-4 w-4" /> Ajouter un tarif
            </Button>
          </div>
        </Field>
      </div>

      <div className="grid gap-4 rounded-xl bg-creme/60 p-4 md:grid-cols-[auto_1fr]">
        <Field label="Encadrants">
          <select aria-label="Nombre d'encadrants" className={cn(selectCls, 'w-28')} value={t.coaches_count}
            onChange={(e) => up({ coaches_count: e.target.value, coach_types: e.target.value === '0' ? [] : t.coach_types })}>
            <option value="">-</option>
            {COACH_COUNTS.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </Field>
        {hasCoaches && (
          <Field label="Type d'encadrant">
            <Chips options={[...COACH_TYPES]} value={t.coach_types} onChange={(v) => up({ coach_types: v })} />
          </Field>
        )}
        {hasCoaches && t.coach_types.includes('Diplômé') && spec.coachTitles && (
          <div className="md:col-span-2">
            <Field label="Diplômes des encadrants">
              <Chips options={[...new Set([...spec.coachTitles, ...(t.coach_titles ?? [])])]} value={t.coach_titles ?? []} onChange={(v) => up({ coach_titles: v })} />
            </Field>
          </div>
        )}
      </div>

      <Field label="Inscriptions pour ce groupe"><PillChoice options={REGISTRATION} value={t.registration} onChange={(v) => up({ registration: v })} /></Field>
    </div>
  );
}

export function Step3({ p, set, fed, subOptions, spec }: StepProps & { subOptions: string[]; spec: SportFormSpec }) {
  const teams = p.teams ?? [];
  const venueNames = [...new Set((p.venues ?? []).map((v) => v.name.trim() || v.address.trim()).filter(Boolean))];
  const aids = p.aids ?? [];
  return (
    <>
      <p className="text-small text-nuit/70">
        Un bloc par équipe ou par groupe : chacun a son public, son niveau, ses créneaux, ses tarifs et ses encadrants.
        Un club sans équipes peut créer un seul groupe.
      </p>
      {(fed('schedules') || fed('prices')) && teams.length > 0 && (
        <p className="text-small text-nuit/70">Prérempli avec les données de votre fédération <FedBadge /></p>
      )}
      <TeamsBulk spec={spec} teams={teams} onAdd={(add) => set('teams', [...teams.filter((x) => !isEmptyTeam(x)), ...add])} />
      {teams.map((t, i) => (
        <TeamBlock key={t.id} t={t} index={i} venueNames={venueNames} subOptions={subOptions} spec={spec}
          onChange={(nt) => set('teams', teams.map((x) => (x.id === t.id ? nt : x)))}
          onDuplicate={() => {
            const copy: TeamDraft = { ...structuredClone(t), id: newTeam().id, name: t.name ? `${t.name} (copie)` : '' };
            set('teams', [...teams.slice(0, i + 1), copy, ...teams.slice(i + 1)]);
          }}
          onRemove={() => set('teams', teams.filter((x) => x.id !== t.id))} />
      ))}
      <Button variant="outline" className="w-full border-dashed" onClick={() => set('teams', [...teams, newTeam(teams.length + 1)])}>
        <Plus className="mr-1 h-4 w-4" /> Ajouter une équipe ou un groupe
      </Button>

      <Block title="Inscriptions (pour tout le club)">
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Début des inscriptions"><Input type="date" value={p.registration_start ?? ''} onChange={(e) => set('registration_start', e.target.value)} /></Field>
          <Field label="Fin des inscriptions"><Input type="date" value={p.registration_end ?? ''} onChange={(e) => set('registration_end', e.target.value)} /></Field>
          <Field label="Date de reprise de la saison"><Input type="date" value={p.season_start ?? ''} onChange={(e) => set('season_start', e.target.value)} /></Field>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Séance d'essai"><YesNo value={p.trial} onChange={(v) => set('trial', v)} /></Field>
          {p.trial && (
            <Field label="Nombre de séances gratuites">
              <Input type="number" min={1} className="w-32" value={p.trial_sessions ?? ''} onChange={(e) => set('trial_sessions', e.target.value)} />
            </Field>
          )}
        </div>
        <Field label="Paiement en plusieurs fois"><YesNo value={p.installments} onChange={(v) => set('installments', v)} /></Field>
        <Field label="Aides acceptées">
          <Chips options={[...new Set([...AIDS, ...aids])]} value={aids} onChange={(v) => set('aids', v)} />
        </Field>
        {aids.includes('Autre') && (
          <Field label="Autre aide acceptée">
            <Input className="max-w-md" value={p.aids_other ?? ''} onChange={(e) => set('aids_other', e.target.value)} />
          </Field>
        )}
        <Field label="Pièces à fournir">
          <ListInput value={p.documents_list ?? []} onChange={(v) => set('documents_list', v)} placeholder="Ex. photo d'identité" addLabel="Ajouter une pièce" />
        </Field>
        <Field label="Lien d'inscription en ligne (si vous en avez un)" fed={fed('registration_url')}>
          <Input type="url" className="max-w-xl" placeholder="https://" value={p.registration_url ?? ''} onChange={(e) => set('registration_url', e.target.value)} />
        </Field>
      </Block>
    </>
  );
}

/* Étape 4 · Spécificités du sport : labels, prérequis, dotation, matériel et précisions libres */
