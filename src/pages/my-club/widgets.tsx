// Petits composants d'affichage et de saisie réutilisés par les étapes du formulaire « Mon club ».

import { useEffect, useState, type ReactNode } from 'react';
import { Plus, Trash2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { type SocialLink } from '@/lib/club-form';
import { SOCIAL_NETWORKS } from '@/data/club-form-catalog';
import { STEPS, MEDIA_BUCKET } from './constants';

/* ---------- Petits composants ---------- */

export function StepCard({ step, percent, onGo, canLeaveFirst, saveState }: {
  step: number; percent: number; onGo: (n: number) => void; canLeaveFirst: boolean; saveState: 'idle' | 'saving' | 'saved' | 'error';
}) {
  return (
    <div className="space-y-4 rounded-2xl border bg-blanc p-5">
      <ol className="flex items-start" aria-label="Étapes du questionnaire">
        {STEPS.map((label, i) => {
          const n = i + 1;
          const disabled = n > 1 && !canLeaveFirst;
          const current = n === step;
          return (
            <li key={label} className="flex flex-1 items-start last:flex-none">
              <button
                type="button" onClick={() => onGo(n)} disabled={disabled} aria-current={current ? 'step' : undefined}
                className="group flex min-w-0 flex-col items-center gap-2 text-center disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-pill border-2 text-small font-bold transition-colors',
                  n < step ? 'border-primary bg-primary text-primary-foreground'
                    : current ? 'border-primary bg-background text-bleu-athlace ring-4 ring-primary/15'
                      : 'border-border bg-background text-nuit/70 group-hover:border-primary',
                )}>
                  {n < step ? <Check className="h-5 w-5" strokeWidth={3} aria-label={`Étape ${n} faite`} /> : n}
                </span>
                <span className={cn('hidden max-w-[9rem] text-caption leading-tight md:block', current ? 'font-bold text-nuit' : 'text-nuit/70')}>{label}</span>
              </button>
              {n < STEPS.length && <span aria-hidden className={cn('mx-2 mt-[1.1rem] h-0.5 flex-1 rounded-pill', n < step ? 'bg-primary' : 'bg-creme')} />}
            </li>
          );
        })}
      </ol>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3">
        <p className="font-sans text-subtitle font-bold text-nuit md:hidden">{STEPS[step - 1]}</p>
        <div className="flex flex-1 items-center gap-3">
          <Progress value={percent} aria-label={`Fiche complète à ${percent} %`} className="h-2 max-w-xs bg-creme" />
          <p className="whitespace-nowrap text-small text-nuit/70">Fiche complète à <span className="font-bold text-bleu-athlace">{percent} %</span></p>
        </div>
        <p className="text-small text-nuit/70" aria-live="polite">
          {saveState === 'saving' ? 'Enregistrement…' : saveState === 'saved' ? 'Enregistré' : saveState === 'error' ? 'Non enregistré' : ''}
        </p>
      </div>
    </div>
  );
}

/** Pagination du bas : précédent, pages 1 à 5, suivant. */
export function Pager({ step, onGo, canLeaveFirst, saving, last }: { step: number; onGo: (n: number) => void; canLeaveFirst: boolean; saving: boolean; last: ReactNode }) {
  return (
    <nav aria-label="Pages du questionnaire" className="flex flex-wrap items-center justify-between gap-3 border-t pt-6">
      <Button variant="outline" onClick={() => onGo(step - 1)} disabled={step === 1 || saving}>Précédent</Button>
      <div className="flex items-center gap-1.5">
        {STEPS.map((label, i) => {
          const n = i + 1;
          return (
            <button key={label} type="button" onClick={() => onGo(n)} disabled={n > 1 && !canLeaveFirst}
              aria-label={`Page ${n} : ${label}`} aria-current={n === step ? 'page' : undefined}
              className={cn('h-9 w-9 rounded-pill text-small font-bold transition-colors disabled:opacity-50',
                n === step ? 'bg-primary text-primary-foreground' : 'bg-creme text-nuit hover:bg-primary/20')}>
              {n}
            </button>
          );
        })}
      </div>
      {last}
    </nav>
  );
}

export function FedBadge() {
  return (
    <span className="ml-2 inline-flex items-center rounded-pill bg-creme px-2 py-0.5 text-[11px] font-bold text-bleu-athlace">
      Donnée fédération
    </span>
  );
}

export function Field({ label, fed, children, hint, htmlFor }: { label: string; fed?: boolean; children: ReactNode; hint?: string; htmlFor?: string }) {
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

export function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-4 rounded-2xl border bg-background p-5">
      <h3 className="font-sans text-subtitle font-bold text-nuit">{title}</h3>
      {children}
    </div>
  );
}

export function Chips({ options, value, onChange }: { options: string[]; value: string[] | undefined; onChange: (v: string[]) => void }) {
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

export function YesNo({ value, onChange }: { value: boolean | null | undefined; onChange: (v: boolean | null) => void }) {
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

export const selectCls = 'h-10 w-full rounded-md border border-input bg-background px-3 text-sm';

/** Affiche une image stockée (URL publique de la fédération ou fichier privé du questionnaire). */
export function MediaImg({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [url, setUrl] = useState<string | null>(src.startsWith('http') ? src : null);
  useEffect(() => {
    if (src.startsWith('http')) { setUrl(src); return; }
    supabase.storage.from(MEDIA_BUCKET).createSignedUrl(src, 3600).then(({ data }) => setUrl(data?.signedUrl ?? null));
  }, [src]);
  return url ? <img src={url} alt={alt} className={className} /> : <div className={cn('bg-creme', className)} />;
}
export function PillChoice<T extends string>({ options, value, onChange }: {
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
export function SocialsEditor({ value, onChange }: { value: SocialLink[]; onChange: (v: SocialLink[]) => void }) {
  const up = (i: number, patch: Partial<SocialLink>) => onChange(value.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  return (
    <div className="space-y-2">
      {value.length > 0 && <p className="text-small font-bold text-nuit">Réseaux sociaux</p>}
      {value.map((sl, i) => (
        <div key={i} className="grid gap-2 sm:grid-cols-[12rem_1fr_auto] sm:items-center">
          <select aria-label="Réseau social" className={selectCls} value={sl.network} onChange={(e) => up(i, { network: e.target.value })}>
            {[...new Set([...SOCIAL_NETWORKS, sl.network])].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          <Input type="url" placeholder="https://" aria-label={`Lien ${sl.network}`} value={sl.url} onChange={(e) => up(i, { url: e.target.value })} />
          <Button variant="ghost" size="icon" aria-label="Retirer ce réseau" onClick={() => onChange(value.filter((_, j) => j !== i))}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={() => {
        const used = new Set(value.map((x) => x.network));
        onChange([...value, { network: SOCIAL_NETWORKS.find((n) => !used.has(n)) ?? 'Autre', url: '' }]);
      }}>
        <Plus className="mr-1 h-4 w-4" /> Ajouter un réseau social
      </Button>
    </div>
  );
}

/** Pastilles à choix multiples + champ « Autre » pour ajouter une valeur propre au club. */
export function ChipsOther({ options, value, onChange, placeholder = 'Autre…' }: {
  options: string[]; value: string[] | undefined; onChange: (v: string[]) => void; placeholder?: string;
}) {
  const [other, setOther] = useState('');
  const cur = value ?? [];
  const add = () => {
    const v = other.trim();
    if (v && !cur.includes(v)) onChange([...cur, v]);
    setOther('');
  };
  return (
    <div className="space-y-2">
      <Chips options={[...new Set([...options, ...cur])]} value={cur} onChange={onChange} />
      <div className="flex max-w-md gap-2">
        <Input value={other} placeholder={placeholder} aria-label={placeholder}
          onChange={(e) => setOther(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }} />
        <Button type="button" variant="outline" onClick={add} disabled={!other.trim()}>Ajouter</Button>
      </div>
    </div>
  );
}

/** Liste à puces modifiable (pièces à fournir, conditions, vidéos…). */
export function ListInput({ value, onChange, placeholder, addLabel, type = 'text' }: {
  value: string[]; onChange: (v: string[]) => void; placeholder: string; addLabel: string; type?: string;
}) {
  return (
    <div className="space-y-2">
      {value.map((v, i) => (
        <div key={i} className="flex items-center gap-2">
          <span aria-hidden className="w-5 text-small font-bold text-bleu-athlace">{i + 1}.</span>
          <Input type={type} value={v} placeholder={placeholder} aria-label={`${placeholder} ${i + 1}`}
            onChange={(e) => onChange(value.map((x, j) => (j === i ? e.target.value : x)))} />
          <Button variant="ghost" size="icon" aria-label="Retirer" onClick={() => onChange(value.filter((_, j) => j !== i))}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={() => onChange([...value, ''])}><Plus className="mr-1 h-4 w-4" />{addLabel}</Button>
    </div>
  );
}

/* Étape 2 · Identité et description (le club, lieux, conditions, équipements, médias) */
export function SelectOther({ options, value, onChange, otherLabel }: {
  options: string[]; value: string; onChange: (v: string) => void; otherLabel: string;
}) {
  const OTHER = '__autre__';
  const known = options.includes(value);
  const [custom, setCustom] = useState(!!value && !known);
  return (
    <div className="flex flex-wrap gap-2">
      <select aria-label="Catégorie" className={cn(selectCls, 'max-w-xs')} value={custom ? OTHER : value}
        onChange={(e) => {
          if (e.target.value === OTHER) { setCustom(true); onChange(''); } else { setCustom(false); onChange(e.target.value); }
        }}>
        <option value="">-</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
        <option value={OTHER}>Autre…</option>
      </select>
      {custom && <Input className="max-w-xs" placeholder={otherLabel} aria-label={otherLabel} value={value} onChange={(e) => onChange(e.target.value)} />}
    </div>
  );
}

export function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="contents">
      <dt className="font-bold text-nuit">{label}</dt>
      <dd className="break-words text-nuit/70">{children}</dd>
    </div>
  );
}
