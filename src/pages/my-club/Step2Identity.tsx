// Étape 2 du formulaire « Mon club » : identité, description, contacts, lieux et images du club.

import { useState } from 'react';
import { Loader2, Plus, Trash2, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { type VenueDraft } from '@/lib/club-form';
import { AMENITY_OPTIONS } from '@/data/club-form-catalog';
import { MEDIA_BUCKET, MEDIA_TYPES, MEDIA_MAX_BYTES } from './constants';
import { FedBadge, Field, Block, YesNo, MediaImg, ChipsOther, ListInput } from './widgets';
import { type StepProps } from './types';

export function Step2({ p, set, fed, userId }: StepProps & { userId: string }) {
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
    <div className="grid gap-6 lg:grid-cols-2">
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
          <Textarea rows={6} maxLength={500} value={p.description ?? ''} onChange={(e) => set('description', e.target.value.slice(0, 500))}
            placeholder="Racontez votre club : son histoire, son ambiance, ce qui le rend unique, ce qu'un nouveau membre va y trouver…" />
        </Field>
        <Field label="Date de création" fed={fed('creation_date')}>
          <Input type="date" className="max-w-xs" value={p.creation_date ?? ''} onChange={(e) => set('creation_date', e.target.value)} />
        </Field>
      </Block>

      <Block title="Lieux de pratique *">
        {fed('venues') && <FedBadge />}
        <p className="text-small text-nuit/70">Vous les retrouverez à l'étape suivante pour chaque équipe ou groupe.</p>
        {venues.map((v, i) => (
          <div key={i} className="space-y-3 rounded-xl border p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Nom"><Input placeholder="Gymnase Jean Moulin" value={v.name} onChange={(e) => upV(i, { name: e.target.value })} /></Field>
              <Field label="Adresse"><Input value={v.address} onChange={(e) => upV(i, { address: e.target.value })} /></Field>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-small text-nuit">
                <Checkbox checked={v.is_main} onCheckedChange={(c) => upV(i, { is_main: !!c })} /> Lieu principal
              </label>
              <Button variant="ghost" size="sm" onClick={() => set('venues', venues.filter((_, j) => j !== i))}><Trash2 className="mr-1 h-4 w-4" />Retirer</Button>
            </div>
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
        <Field label="Conditions spécifiques" hint="Ex. test de niveau à l'entrée, licence compétition obligatoire, surclassement médical.">
          <YesNo value={p.has_specific_conditions} onChange={(v) => {
            set('has_specific_conditions', v);
            if (v && !(p.specific_conditions ?? []).length) set('specific_conditions', ['']);
          }} />
        </Field>
        {p.has_specific_conditions && (
          <ListInput value={p.specific_conditions ?? []} onChange={(v) => set('specific_conditions', v)}
            placeholder="Condition" addLabel="Ajouter une condition" />
        )}
        <p className="text-caption text-nuit/70">Âges, publics et débutants se précisent par équipe ou groupe, à l'étape 3.</p>
      </Block>

      <Block title="Équipements">
        <Field label="Équipements disponibles" fed={fed('amenities')}>
          <ChipsOther options={AMENITY_OPTIONS} value={p.amenities} onChange={(v) => set('amenities', v)} placeholder="Autre équipement…" />
        </Field>
        <Field label="Accessible aux personnes à mobilité réduite"><YesNo value={p.pmr} onChange={(v) => set('pmr', v)} /></Field>
      </Block>

      <div className="lg:col-span-2">
        <Block title="Médias">
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
          <Field label="Vidéos (liens YouTube, Instagram, TikTok…)" fed={fed('video_url')}>
            <ListInput type="url" value={p.video_urls ?? []} onChange={(v) => set('video_urls', v)} placeholder="https://" addLabel="Ajouter une vidéo" />
          </Field>
        </Block>
      </div>
    </div>
  );
}

/** Liste déroulante d'un seul choix, avec « Autre » qui ouvre un champ libre. */
