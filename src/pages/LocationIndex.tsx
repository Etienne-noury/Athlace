import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { Loader2, LocateFixed, Map as MapIcon, MapPin, Search } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { PageTitle } from '@/components/PageTitle';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { DEPARTMENTS, REGIONS } from '@/lib/geo';
import { formatClubCount } from '@/hooks/useAvailableDisciplines';
import { cn } from '@/lib/utils';

type Tab = 'villes' | 'departements' | 'regions';
const TABS: { id: Tab; label: string; icon: typeof MapPin }[] = [
  { id: 'villes', label: 'Villes', icon: MapPin },
  { id: 'departements', label: 'Départements', icon: MapIcon },
  { id: 'regions', label: 'Régions', icon: MapIcon },
];
const PAGE = 60;

/** Départements et collectivités d'outre-mer absents de la liste métropolitaine. */
const EXTRA_DEPARTMENTS: Record<string, string> = {
  '2A': 'Corse-du-Sud', '2B': 'Haute-Corse', '971': 'Guadeloupe', '972': 'Martinique', '973': 'Guyane',
  '974': 'La Réunion', '975': 'Saint-Pierre-et-Miquelon', '976': 'Mayotte', '977': 'Saint-Barthélemy',
  '978': 'Saint-Martin', '986': 'Wallis-et-Futuna', '987': 'Polynésie française', '988': 'Nouvelle-Calédonie',
};

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

interface LocationStats {
  departments: { code: string; clubs: number }[];
  regions: { region: string; clubs: number }[];
  cities: number;
}

function Chip({ to, title, meta, count }: { to: string; title: string; meta?: string; count: number }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-2 rounded-pill bg-muted px-3 py-1.5 text-sm transition-colors hover:bg-creme hover:text-primary"
    >
      <span className="font-bold">{title}</span>
      {meta && <span className="text-muted-foreground">{meta}</span>}
      <span className="text-muted-foreground">· {formatClubCount(count)}</span>
    </Link>
  );
}

export default function LocationIndex() {
  const [params, setParams] = useSearchParams();
  const tab: Tab = (['villes', 'departements', 'regions'] as Tab[]).includes(params.get('onglet') as Tab)
    ? (params.get('onglet') as Tab)
    : 'villes';
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const [limit, setLimit] = useState(PAGE);

  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(query.trim()), 200);
    return () => window.clearTimeout(t);
  }, [query]);
  useEffect(() => { setLimit(PAGE); }, [debounced, tab]);

  const setTab = (next: Tab) => setParams((prev) => {
    const p = new URLSearchParams(prev);
    p.set('onglet', next);
    return p;
  }, { replace: true });

  const stats = useQuery({
    queryKey: ['location-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('location_stats');
      if (error) throw error;
      return data as unknown as LocationStats;
    },
    staleTime: 10 * 60 * 1000,
  });

  const cities = useQuery({
    queryKey: ['search-cities', debounced, limit],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('search_cities', { p_q: debounced || undefined, p_limit: limit + 1 });
      if (error) throw error;
      return data ?? [];
    },
    enabled: tab === 'villes',
    placeholderData: keepPreviousData,
    staleTime: 10 * 60 * 1000,
  });

  const departments = useMemo(() => {
    const names = new Map(DEPARTMENTS.map((d) => [d.code, d.name]));
    const q = norm(debounced);
    return (stats.data?.departments ?? [])
      .map((d) => ({ ...d, name: names.get(d.code) ?? EXTRA_DEPARTMENTS[d.code] }))
      .filter((d): d is { code: string; clubs: number; name: string } => Boolean(d.name))
      .filter((d) => !q || norm(d.name).includes(q) || d.code.toLowerCase().startsWith(q))
      .sort((a, b) => a.code.localeCompare(b.code, 'fr', { numeric: true }));
  }, [stats.data, debounced]);

  const regions = useMemo(() => {
    const known = new Set(REGIONS.map((r) => r.name));
    const q = norm(debounced);
    return (stats.data?.regions ?? [])
      .filter((r) => known.has(r.region))
      .filter((r) => !q || norm(r.region).includes(q));
  }, [stats.data, debounced]);

  const cityRows = (cities.data ?? []).slice(0, limit);
  const hasMoreCities = (cities.data?.length ?? 0) > limit;
  const loading = tab === 'villes' ? cities.isLoading : stats.isLoading;
  const empty = !loading && (tab === 'villes' ? cityRows.length === 0 : tab === 'departements' ? departments.length === 0 : regions.length === 0);
  const placeholder = tab === 'villes' ? 'Chercher une ville ou un code postal…' : tab === 'departements' ? 'Chercher un département ou un numéro…' : 'Chercher une région…';

  return (
    <Layout>
      <PageTitle title="Trouver un club par localisation" description="Cherchez les clubs sportifs par ville, département ou région en France." />
      <section className="bg-muted border-b border-border py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-sans text-3xl lg:text-4xl font-black text-foreground mb-2">Trouver par localisation</h1>
          <p className="text-muted-foreground text-lg">
            {stats.data ? `${formatClubCount(stats.data.cities)} villes, ${departments.length || stats.data.departments.length} départements et ${regions.length || REGIONS.length} régions. ` : ''}
            Choisissez un lieu : la recherche s’ouvre directement dessus.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={placeholder} aria-label={placeholder} className="pl-10 bg-background" />
            </div>
            <Button asChild variant="outline" className="gap-2 bg-background">
              <Link to="/clubs/?autour=1"><LocateFixed className="h-4 w-4" />Autour de moi</Link>
            </Button>
          </div>
          <div role="tablist" aria-label="Type de lieu" className="mt-6 flex flex-wrap gap-2">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={tab === id}
                onClick={() => setTab(id)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-pill px-4 py-2 text-sm font-bold transition-colors',
                  tab === id ? 'bg-nuit text-blanc' : 'bg-background text-foreground hover:bg-creme',
                )}
              >
                <Icon className="h-4 w-4" />{label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10" role="tabpanel">
        {loading && (
          <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin" />Chargement…</div>
        )}
        {empty && <p className="text-muted-foreground">Aucun résultat pour « {debounced} ».</p>}

        {tab === 'villes' && (
          <>
            {!debounced && cityRows.length > 0 && <h2 className="mb-4 font-sans text-lg font-black">Les villes avec le plus de clubs</h2>}
            <div className="flex flex-wrap gap-2">
              {cityRows.map((c) => (
                <Chip key={`${c.city}-${c.department_code}`} to={`/clubs/?q=${encodeURIComponent(c.city)}`}
                  title={c.city} meta={c.department_code ? `(${c.department_code})` : undefined} count={c.clubs} />
              ))}
            </div>
            {hasMoreCities && (
              <Button variant="outline" className="mt-6" onClick={() => setLimit((n) => n + PAGE)} disabled={cities.isFetching}>
                Afficher plus de villes
              </Button>
            )}
          </>
        )}

        {tab === 'departements' && (
          <div className="flex flex-wrap gap-2">
            {departments.map((d) => (
              <Chip key={d.code} to={`/clubs/?departement=${encodeURIComponent(d.code)}`} title={`${d.code} · ${d.name}`} count={d.clubs} />
            ))}
          </div>
        )}

        {tab === 'regions' && (
          <div className="flex flex-wrap gap-2">
            {regions.map((r) => (
              <Chip key={r.region} to={`/clubs/?region=${encodeURIComponent(r.region)}`} title={r.region} count={r.clubs} />
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}
