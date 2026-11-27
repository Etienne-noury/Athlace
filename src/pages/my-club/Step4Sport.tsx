// Étape 4 du formulaire « Mon club » : questions propres au sport du club.

import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { type SportFormSpec } from '@/data/club-form-catalog';
import { Field, Block, YesNo, selectCls, ChipsOther } from './widgets';
import { type StepProps } from './types';

export function Step4({ p, set, fed, spec }: StepProps & { spec: SportFormSpec & { sportName: string } }) {
  return (
    <>
      {spec.sportName && <p className="text-small text-nuit/70">Questions adaptées au sport : <span className="font-bold text-nuit">{spec.sportName}</span>.</p>}
      <div className="grid gap-6 lg:grid-cols-2">
        <Block title="Labels et certifications">
          <Field label="Labels du club" fed={fed('labels')}>
            <ChipsOther options={spec.labels} value={p.labels_list} onChange={(v) => set('labels_list', v)} placeholder="Autre label…" />
          </Field>
          {spec.prerequisite && (
            <Field label={spec.prerequisite.label}>
              <select className={cn(selectCls, 'max-w-sm')} value={p.prerequisite ?? ''} onChange={(e) => set('prerequisite', e.target.value)}>
                <option value="">-</option>
                {[...new Set([...spec.prerequisite.options, p.prerequisite ?? ''].filter(Boolean))].map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </Field>
          )}
        </Block>

        <Block title="Matériel">
          <Field label="Dotation : fourni par le club">
            <ChipsOther options={spec.provided} value={p.equipment_provided} onChange={(v) => set('equipment_provided', v)} placeholder="Autre dotation…" />
          </Field>
          <Field label="À acheter par l'adhérent">
            <ChipsOther options={spec.toBuy} value={p.equipment_to_buy} onChange={(v) => set('equipment_to_buy', v)} placeholder="Autre matériel…" />
          </Field>
        </Block>
      </div>

      {spec.extras && spec.extras.length > 0 && (
        <Block title={`Pratique propre au sport : ${spec.sportName}`}>
          <div className="grid gap-5 md:grid-cols-2">
            {spec.extras.map((q) => {
              const v = (p.sport_answers ?? {})[q.key];
              const setV = (nv: unknown) => set('sport_answers', { ...(p.sport_answers ?? {}), [q.key]: nv });
              return (
                <Field key={q.key} label={q.label}>
                  {!q.options ? <YesNo value={typeof v === 'boolean' ? v : null} onChange={setV} />
                    : q.multi ? <ChipsOther options={q.options} value={Array.isArray(v) ? (v as string[]) : []} onChange={setV} />
                      : (
                        <select className={cn(selectCls, 'max-w-sm')} value={typeof v === 'string' ? v : ''} onChange={(e) => setV(e.target.value || null)}>
                          <option value="">-</option>
                          {q.options.map((o) => <option key={o} value={o}>{o}</option>)}
                        </select>
                      )}
                </Field>
              );
            })}
          </div>
        </Block>
      )}

      <Block title="Autres précisions">
        <Field label="Ce que vous voulez ajouter sur la pratique dans votre club" hint="Facultatif">
          <Textarea rows={3} value={p.sport_notes ?? ''} onChange={(e) => set('sport_notes', e.target.value)} />
        </Field>
      </Block>
    </>
  );
}
