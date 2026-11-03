import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchAutocomplete } from '@/components/search/SearchAutocomplete';
import { DisciplineFilter } from '@/components/filters/DisciplineFilter';
import { useAthleteFavorites } from '@/hooks/useAthleteFavorites';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { resolveCity } from '@/lib/api/geo-search';
import { cityFavoriteKey, citySearchUrl, sportSearchUrl } from '@/lib/athlete-account';
import { getParentDisciplines } from '@/data/disciplines';

export function FollowedFavorites({ kind }: { kind: 'cities' | 'sports' }) {
  const { user } = useAuth();
  const fav = useAthleteFavorites();
  const [city, setCity] = useState('');
  const [sport, setSport] = useState('all');
  const [busy, setBusy] = useState(false);
  const query = kind === 'cities' ? fav.cities : fav.sports;
  const add = async () => {
    if (!user || busy) return;
    setBusy(true);
    try {
      if (kind === 'cities') {
        const hit = await resolveCity(city);
        if (!hit) { toast({ title: 'Choisissez une ville dans les suggestions', variant: 'destructive' }); return; }
        const key = cityFavoriteKey(hit);
        if (fav.cities.data?.some((v) => v.city_code === key)) { toast({ title: 'Cette ville est déjà dans vos favoris' }); return; }
        const { error } = await supabase.from('favorite_cities').insert({ user_id: user.id, city_name: hit.name, city_code: key, postal_code: hit.postcode });
        if (error) throw error;
        setCity('');
      } else {
        if (!getParentDisciplines().some((s) => s.id === sport)) return;
        if (fav.sports.data?.some((v) => v.sport_id === sport)) { toast({ title: 'Ce sport est déjà dans vos favoris' }); return; }
        const { error } = await supabase.from('favorite_sports').insert({ user_id: user.id, sport_id: sport });
        if (error) throw error;
        setSport('all');
      }
      await fav.refresh();
      toast({ title: kind === 'cities' ? 'Ville ajoutée aux favoris' : 'Sport ajouté aux favoris' });
    } catch { toast({ title: 'Ajout impossible', variant: 'destructive' }); }
    finally { setBusy(false); }
  };
  const remove = async (id: string) => {
    if (!user || busy) return;
    setBusy(true);
    try {
      const { error } = await supabase.from(kind === 'cities' ? 'favorite_cities' : 'favorite_sports').delete().eq('id', id).eq('user_id', user.id);
      if (error) throw error;
      await fav.refresh();
    } catch { toast({ title: 'Suppression impossible', variant: 'destructive' }); }
    finally { setBusy(false); }
  };
  const rows = kind === 'cities' ? (fav.cities.data ?? []).map((v) => ({ id: v.id, label: v.city_name, detail: v.postal_code, url: citySearchUrl(v.city_name) })) : (fav.sports.data ?? []).map((v) => ({ id: v.id, label: getParentDisciplines().find((s) => s.id === v.sport_id)?.name ?? v.sport_id, detail: '', url: sportSearchUrl(v.sport_id) }));
  return <div className="space-y-6">
    <form onSubmit={(e) => { e.preventDefault(); void add(); }} className="flex flex-col sm:flex-row gap-3 items-end max-w-2xl">
      <div className="flex-1 w-full min-w-0">{kind === 'cities' ? <><label className="text-sm font-bold block mb-2">Ajouter une ville</label><SearchAutocomplete value={city} onChange={setCity} placeholder="Rechercher une commune…" inputClassName="pl-12" /></> : <DisciplineFilter sport={sport} sub="all" onSportChange={setSport} onSubChange={() => {}} showSub={false} />}</div>
      <Button type="submit" className="gap-2" disabled={busy || (kind === 'cities' ? city.trim().length < 2 : sport === 'all')}><Plus className="h-4 w-4" />Ajouter</Button>
    </form>
    {query.isLoading ? <p role="status">Chargement…</p> : query.isError ? <div role="alert"><p>Impossible de charger vos favoris.</p><Button variant="outline" onClick={() => query.refetch()}>Réessayer</Button></div> : rows.length === 0 ? <p className="text-muted-foreground py-8">{kind === 'cities' ? 'Vous n’avez pas encore de ville favorite.' : 'Vous n’avez pas encore de sport favori.'}</p> : <div className="grid gap-4 md:grid-cols-2">{rows.map((row) => <div key={row.id} className="bg-card border border-border rounded-lg p-5 flex items-center justify-between gap-3"><Link to={row.url} className="flex-1 min-w-0"><h2 className="font-bold break-words">{row.label}</h2>{row.detail && <p className="text-sm text-muted-foreground">{row.detail}</p>}</Link><Button variant="ghost" size="icon" aria-label={`Retirer ${row.label} des favoris`} disabled={busy} onClick={() => remove(row.id)}><Trash2 className="h-4 w-4" /></Button></div>)}</div>}
  </div>;
}