import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { SearchAutocomplete } from '@/components/search/SearchAutocomplete';
import { FranceMap } from '@/components/map/FranceMap';
import { fetchEnrichedClubs } from '@/lib/api/enriched-clubs';
import {
  ARBORESCENCE,
  disciplines,
  getDisciplineById,
  getDisciplineQueryNames,
  getSubDisciplineValue,
} from '@/data/disciplines';
import { fetchFederationSources, getFederationForDiscipline } from '@/lib/federations-map';
import { ArrowRight, ExternalLink, MapPin } from 'lucide-react';
import { slugify } from '@/lib/geo';
import { useAvailableDisciplines, formatClubCount } from '@/hooks/useAvailableDisciplines';

/**
 * Page d'un sport (piste A) : uniquement des informations sûres, issues de la base
 * (clubs, pratiques) ou des fédérations (nom, site). Un bloc « Comprendre le sport »
 * viendra s'ajouter quand des fiches vérifiées existeront.
 */
export default function SportDetail() {
  const { sportId } = useParams<{ sportId: string }>();
  const navigate = useNavigate();
  const avail = useAvailableDisciplines();
  const [query, setQuery] = useState('');
  const [aroundMe, setAroundMe] = useState(false);

  const sport = useMemo(() => {
    if (!sportId) return undefined;
    return getDisciplineById(sportId, avail.sports)
      ?? disciplines.find((d) => slugify(d.name) === sportId);
  }, [sportId, avail.sports]);

  const parent = useMemo(
    () => (sport?.parentId ? disciplines.find((d) => d.id === sport.parentId) : undefined),
    [sport],
  );
  const root = parent ?? sport;
  const category = useMemo(() => ARBORESCENCE.find((c) => c.id === sport?.category), [sport]);

  const rootAvail = avail.getSport(root?.id);
  const clubCount = sport?.parentId ? (rootAvail.subs[sport.name] ?? 0) : rootAvail.count;

  const practices = useMemo(() => {
    if (!root) return [];
    return disciplines
      .filter((d) => d.parentId === root.id)
      .map((d) => ({ ...d, count: rootAvail.subs[d.name] ?? 0 }))
      .filter((d) => d.count > 0)
      .sort((a, b) => b.count - a.count);
  }, [root, rootAvail]);

  const otherSports = useMemo(() => {
    if (!root || !category) return [];
    return disciplines
      .filter((d) => !d.parentId && d.category === category.id && d.id !== root.id && avail.getSport(d.id).count > 0)
      .sort((a, b) => avail.getSport(b.id).count - avail.getSport(a.id).count)
      .slice(0, 8);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [root, category, avail.isReady]);

  const { data: federationSources = [] } = useQuery({ queryKey: ['federations'], queryFn: fetchFederationSources });
  const federation = useMemo(
    () => (root ? getFederationForDiscipline(root.id, federationSources) : undefined),
    [root, federationSources],
  );

  useEffect(() => {
    if (sport) document.title = `${sport.name} : trouver un club - Athlace`;
  }, [sport]);

  const { data: result = { clubs: [], total: 0 }, isLoading } = useQuery({
    queryKey: ['sport-detail', sport?.id, sport?.name],
    queryFn: () =>
      fetchEnrichedClubs({
        disciplines: getDisciplineQueryNames(root?.id),
        subDiscipline: sport?.parentId ? getSubDisciplineValue(sport.parentId, sport.id, avail.sports) : null,
        limit: 6,
      }),
    enabled: !!sport?.name && (!sport?.parentId || avail.isReady),
    staleTime: 5 * 60 * 1000,
  });

  if (!sport || !root) {
    return (
      <Layout>
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-sans text-3xl font-black">Sport non trouvé</h1>
            <p className="text-muted-foreground mt-4">Ce sport n'est pas encore référencé sur Athlace.</p>
            <Button className="mt-6" asChild>
              <Link to="/sports/">Voir tous les sports</Link>
            </Button>
          </div>
        </section>
      </Layout>
    );
  }

  const searchParams = () => {
    const params = new URLSearchParams({ discipline: root.id });
    if (sport.parentId) params.set('sous-discipline', sport.id);
    return params;
  };
  const allClubsUrl = `/clubs/?${searchParams().toString()}`;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = searchParams();
    if (aroundMe) params.set('autour', '1');
    else if (query.trim()) params.set('q', query.trim());
    navigate(`/clubs/?${params.toString()}`);
  };

  const available = !avail.isReady || clubCount > 0;

  return (
    <Layout>
      {/* En-tête */}
      <section className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-10 lg:py-14 space-y-6">
          <nav aria-label="Fil d'Ariane" className="flex flex-wrap items-center gap-2 text-sm text-primary-foreground/90">
            <Link to="/sports/" className="hover:underline">Sports</Link>
            {category && (
              <>
                <span aria-hidden>/</span>
                <Link to={`/sports/famille/${category.id}/`} className="hover:underline">{category.name}</Link>
              </>
            )}
            {parent && (
              <>
                <span aria-hidden>/</span>
                <Link to={`/sports/${parent.id}/`} className="hover:underline">{parent.name}</Link>
              </>
            )}
            <span aria-hidden>/</span>
            <span className="font-bold">{sport.name}</span>
          </nav>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-3">
              {category && (
                <p className="text-xs font-bold uppercase tracking-wide text-lime">{category.name}</p>
              )}
              <h1 className="font-sans text-4xl lg:text-6xl font-black leading-tight">{sport.name}</h1>
              <p className="text-lg">
                {available
                  ? `Trouvez un club de ${sport.name} près de chez vous, parmi les clubs affiliés à une fédération agréée.`
                  : `Les clubs de ${sport.name} arrivent bientôt sur Athlace.`}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:flex">
              <div className="rounded-2xl bg-primary-foreground/10 px-5 py-4 min-w-[140px]">
                <div className="text-3xl font-black">{avail.isReady ? formatClubCount(clubCount) : '…'}</div>
                <div className="text-sm">clubs référencés</div>
              </div>
              {practices.length > 0 && (
                <div className="rounded-2xl bg-primary-foreground/10 px-5 py-4 min-w-[140px]">
                  <div className="text-3xl font-black">{practices.length}</div>
                  <div className="text-sm">{practices.length > 1 ? 'façons de pratiquer' : 'façon de pratiquer'}</div>
                </div>
              )}
              {federation?.code && (
                <div className="rounded-2xl bg-primary-foreground/10 px-5 py-4 min-w-[140px]">
                  <div className="text-3xl font-black">{federation.code}</div>
                  <div className="text-sm">fédération</div>
                </div>
              )}
            </div>
          </div>

          {available && (
            <form onSubmit={submit} className="flex flex-col gap-3 rounded-2xl bg-card p-3 lg:flex-row">
              <SearchAutocomplete
                className="flex-1 min-w-0"
                value={query}
                onChange={(value) => { setQuery(value); if (value.trim()) setAroundMe(false); }}
                onLocate={() => { setQuery(''); setAroundMe(true); }}
                aroundActive={aroundMe}
                onClearAround={() => setAroundMe(false)}
                placeholder="Ville ou code postal"
                inputClassName="pl-12 h-14 text-base border-0 bg-muted text-foreground focus-visible:ring-primary"
              />
              <Button type="submit" size="lg" className="h-14 px-8 text-base font-bold">
                Voir les clubs de {sport.name}
              </Button>
            </form>
          )}
        </div>
      </section>

      {/* Pratiques */}
      {practices.length > 0 && (
        <section className="container mx-auto px-4 pt-12 space-y-5">
          <h2 className="font-sans text-2xl lg:text-3xl font-black">
            {sport.parentId ? `Les autres pratiques : ${root.name}` : 'Choisissez votre façon de pratiquer'}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {practices.map((p) => (
              <Link
                key={p.id}
                to={`/sports/${p.id}/`}
                aria-current={p.id === sport.id ? 'page' : undefined}
                className={`flex flex-col gap-2 rounded-2xl border p-5 transition-colors hover:border-primary ${p.id === sport.id ? 'border-primary bg-primary/5' : 'border-border bg-card'}`}
              >
                <span className="font-bold text-lg">{p.name}</span>
                <span className="mt-auto font-bold text-primary">
                  {formatClubCount(p.count)} club{p.count > 1 ? 's' : ''} →
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Clubs et carte */}
      {available && (
        <section className="container mx-auto px-4 pt-12 space-y-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-sans text-2xl lg:text-3xl font-black">Clubs de {sport.name}</h2>
            <Link to={allClubsUrl} className="font-bold text-primary hover:underline">
              Voir les {avail.isReady ? formatClubCount(clubCount) : ''} clubs →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            <div className="flex flex-col gap-3">
              {isLoading &&
                Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-[76px] rounded-2xl" />)}
              {!isLoading &&
                result.clubs.map((club) => (
                  <Link
                    key={club.id}
                    to={`/club/${club.id}`}
                    className="flex items-center gap-4 rounded-2xl border border-border bg-card px-5 py-4 transition-colors hover:border-primary"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted text-primary">
                      <MapPin className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-bold">{club.name}</span>
                      <span className="block truncate text-sm text-muted-foreground">
                        {[club.city, club.departmentCode ? `(${club.departmentCode})` : null].filter(Boolean).join(' ') || 'Ville non précisée'}
                      </span>
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-primary" />
                  </Link>
                ))}
              <Button variant="outline" className="self-start" asChild>
                <Link to={allClubsUrl}>
                  Chercher près de chez moi <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <FranceMap
              height="420px"
              selectedDiscipline={root.id}
              selectedSub={sport.parentId ? sport.id : 'all'}
              className="rounded-2xl"
            />
          </div>
        </section>
      )}

      {/* Bon à savoir : uniquement des informations vérifiables (fédération). */}
      {federation && (
        <section className="container mx-auto px-4 pt-12">
          <div className="flex flex-col gap-4 rounded-2xl bg-card border border-border p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-wide text-primary">La fédération</p>
              <p className="text-lg font-bold">{federation.name}</p>
              <p className="text-sm text-muted-foreground">
                Licence, calendrier des compétitions et règlement officiel : tout est sur son site.
              </p>
            </div>
            <Button variant="outline" asChild>
              <a href={federation.url} target="_blank" rel="noopener noreferrer">
                Site de la fédération <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </section>
      )}

      {/* Autres sports de la même famille */}
      <section className="container mx-auto px-4 py-12 space-y-4">
        <h2 className="font-sans text-xl font-bold">
          {category ? `Autres ${category.name.toLowerCase()}` : 'Autres sports'}
        </h2>
        <div className="flex flex-wrap gap-2">
          {otherSports.map((s) => (
            <Link
              key={s.id}
              to={`/sports/${s.id}/`}
              className="rounded-pill bg-card border border-border px-4 py-2 text-sm font-bold hover:border-primary"
            >
              {s.name}
            </Link>
          ))}
          <Link to="/sports/" className="rounded-pill bg-card border border-border px-4 py-2 text-sm font-bold hover:border-primary">
            Tous les sports →
          </Link>
        </div>
      </section>
    </Layout>
  );
}
