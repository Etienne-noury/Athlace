// Étape 1 du formulaire « Mon club » : retrouver son club et dire quel est son rôle.

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { type ClubPayload } from '@/lib/club-form';
import { CONTACT, type ClubRow } from './constants';
import { Field, Block, selectCls, SocialsEditor } from './widgets';
import { type StepProps } from './types';

export function Step1({
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
      // Recherche ouverte même avant l'accord de la fédération (nom, ville, discipline seulement).
      const { data } = await supabase.rpc('search_clubs_for_claim', { q: term.replace(/[%_]/g, ' ') });
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
        <div className="grid gap-4 md:grid-cols-3">
          {CONTACT.map(([k, l, type]) => (
            <Field key={k} label={l} fed={fed(k)}>
              <Input type={type} value={(p[k] as string) ?? ''} onChange={(e) => set(k, e.target.value as never)} />
            </Field>
          ))}
        </div>
        <SocialsEditor value={p.socials ?? []} onChange={(v) => set('socials', v)} />
      </Block>
    </>
  );
}

/* ---------- Champs composés ---------- */

/** Réseaux sociaux repliés : on n'affiche rien tant que le club n'en ajoute pas. */
