import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MapPin, ArrowRight, List, SlidersHorizontal, X, Loader2, ExternalLink } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { FavoriteButton } from '@/components/clubs/FavoriteButton';
import { ClubCardVisual, ClubCardBody } from '@/components/clubs/ClubCardContent';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { regions } from '@/data/clubs';
import { getDisciplineQueryNames, getSubDisciplineValue } from '@/data/disciplines';
import { DisciplineFilter } from '@/components/filters/DisciplineFilter';
import { useAvailableDisciplines } from '@/hooks/useAvailableDisciplines';
import { fetchEnrichedClubs } from '@/lib/api/enriched-clubs';
import { fetchClubsNear, resolveCity } from '@/lib/api/geo-search';
import { SearchAutocomplete } from '@/components/search/SearchAutocomplete';
import type { EnrichedClub as Club } from '@/lib/api/enriched-clubs';
import { fetchFederationSources, getFederationForDiscipline } from '@/lib/federations-map';
import { cn } from '@/lib/utils';
import { FranceMap } from '@/components/map/FranceMap';

const EMPTY_RESULTS: { clubs: Club[]; total: number; radiusKm?: number } = { clubs: [], total: 0 };

export default function Recherche() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileMap, setMobileMap] = useState(false);
  const [hoveredClubId, setHoveredClubId] = useState<string | null>(null);
  const [selectedClubId, setSelectedClubId] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const clubRefs = useRef(new Map<string, HTMLAnchorElement>());
  const selectMapClub = useCallback((id: string) => {
    setSelectedClubId(id);
    setMobileMap(false);
    requestAnimationFrame(() => {
      const item = clubRefs.current.get(id);
      const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
      const list = listRef.current;
      if (item && list && window.matchMedia('(min-width: 1024px)').matches) {
        list.scrollTo({ top: list.scrollTop + item.getBoundingClientRect().top - list.getBoundingClientRect().top - (list.clientHeight - item.clientHeight) / 2, behavior });
      } else if (item) {
        window.scrollTo({ top: window.scrollY + item.getBoundingClientRect().top - 88, behavior: 'auto' });
      }
      item?.focus({ preventScroll: true });
    });
  }, []);
  const [page, setPage] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedDiscipline, setSelectedDiscipline] = useState(searchParams.get('discipline') || 'all');
  const [selectedSub, setSelectedSub] = useState(searchParams.get('sous-discipline') || 'all');
  const [selectedRegion, setSelectedRegion] = useState(searchParams.get('region') || 'all');
  const avail = useAvailableDisciplines();
  const subDiscipline = getSubDisciplineValue(selectedDiscipline, selectedSub, avail.sports);

  useEffect(() => {
    setPage(0);
  }, [searchQuery, selectedDiscipline, selectedSub, selectedRegion]);

  useEffect(() => {
    const next: Record<string, string> = {};
    if (searchQuery) next.q = searchQuery;
    if (selectedDiscipline !== 'all') next.discipline = selectedDiscipline;
    if (selectedSub !== 'all') next['sous-discipline'] = selectedSub;
    if (selectedRegion !== 'all') next.region = selectedRegion;
    setSearchParams(next, { replace: true });
  }, [searchQuery, selectedDiscipline, selectedSub, selectedRegion, setSearchParams]);

  // Si la saisie correspond à une commune, on cherche les clubs autour (rayon élargi si besoin).
  const { data: nearCity = null, isFetching: cityFetching } = useQuery({
    queryKey: ['resolve-city', searchQuery.trim().toLowerCase()],
    queryFn: () => resolveCity(searchQuery),
    enabled: searchQuery.trim().length >= 2,
    staleTime: 60 * 60 * 1000,
  });
  const cityReady = searchQuery.trim().length < 2 || !cityFetching;
  const [nearRadius, setNearRadius] = useState<number | undefined>(undefined);
  useEffect(() => { setNearRadius(undefined); }, [nearCity, selectedDiscipline, selectedSub, selectedRegion]);

  const { data: searchResult = EMPTY_RESULTS, isLoading, isFetching } = useQuery({
    queryKey: ['clubs', 'search', searchQuery, selectedDiscipline, selectedSub, subDiscipline, selectedRegion, page, nearCity?.lat, nearCity?.lng],
    enabled: cityReady && (selectedSub === 'all' || avail.isReady),
    queryFn: async (): Promise<{ clubs: Club[]; total: number; radiusKm?: number }> => {
      if (nearCity) {
        const r = await fetchClubsNear({
          lat: nearCity.lat,
          lng: nearCity.lng,
          disciplines: getDisciplineQueryNames(selectedDiscipline),
          sub: subDiscipline,
          region: selectedRegion,
          limit: 100,
          offset: page * 100,
          radiusKm: page > 0 ? nearRadius : undefined,
        });
        if (page === 0) setNearRadius(r.radiusKm);
        return r;
      }
      return fetchEnrichedClubs({
        q: searchQuery,
        disciplines: getDisciplineQueryNames(selectedDiscipline),
        subDiscipline,
        region: selectedRegion,
        limit: 100,
        offset: page * 100,
      });
    },
  });

  const filteredClubs = searchResult.clubs;
  const totalCount = searchResult.total;
  const totalPages = Math.ceil(totalCount / 100);

  useEffect(() => {
    setSelectedClubId(null);
    setHoveredClubId(null);
    if (listRef.current) listRef.current.scrollTop = 0;
  }, [filteredClubs]);


  const { data: federationSources = [] } = useQuery({
    queryKey: ['federations'],
    queryFn: fetchFederationSources,
  });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedDiscipline('all');
    setSelectedSub('all');
    setSelectedRegion('all');
    setSearchParams({});
  };

  const activeFiltersCount = [
    searchQuery,
    selectedDiscipline !== 'all' ? selectedDiscipline : '',
    selectedSub !== 'all' ? selectedSub : '',
    selectedRegion !== 'all' ? selectedRegion : '',
  ].filter(Boolean).length;


  return (
    <Layout>
      <div className="hidden lg:block sticky top-20 z-40 border-b border-border bg-blanc">
        <div className="grid grid-cols-[minmax(180px,1fr)_minmax(0,2fr)_minmax(180px,1fr)_auto] items-end gap-4 px-6 py-4">
          <div className="min-w-0">
            <label className="mb-2 block text-sm font-bold">Recherche</label>
            <SearchAutocomplete value={searchQuery} onChange={setSearchQuery}
              onPickSport={(id) => { setSelectedDiscipline(id); setSelectedSub('all'); }}
              placeholder="Ville, code postal, sport..." iconClassName="left-3 h-4 w-4" inputClassName="pl-10" />
          </div>
          <DisciplineFilter sport={selectedDiscipline} sub={selectedSub}
            onSportChange={setSelectedDiscipline} onSubChange={setSelectedSub} layout="inline"
            className="grid grid-cols-2 [&>div]:w-full" triggerClassName="w-full" />
          <div className="min-w-0">
            <label className="mb-2 block text-sm font-bold">Région</label>
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger><SelectValue placeholder="Toutes les régions" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les régions</SelectItem>
                {regions.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Button variant="ghost" onClick={clearFilters} disabled={!activeFiltersCount} className="gap-2">
            <X className="h-4 w-4" />Effacer
          </Button>
        </div>
      </div>

          {/* Mobile Filter Sheet */}
          <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
            <SheetTrigger asChild>
              <Button aria-label="Filtres" variant="outline" className="lg:hidden mx-4 mt-4 gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                Filtres
                {activeFiltersCount > 0 && (
                  <Badge className="ml-1">{activeFiltersCount}</Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-full sm:max-w-md flex flex-col overflow-y-auto"
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <SheetHeader>
                <SheetTitle>Filtres</SheetTitle>
                <SheetDescription>Affinez votre recherche</SheetDescription>
              </SheetHeader>
              <div className="space-y-6 mt-6 flex-1">
                {/* Same filters as sidebar */}
                <div>
                  <label className="text-sm font-bold mb-2 block">Recherche</label>
                  <SearchAutocomplete
                    value={searchQuery}
                    onChange={setSearchQuery}
                    onPickSport={(id) => { setSelectedDiscipline(id); setSelectedSub('all'); }}
                    placeholder="Ville, code postal, sport..."
                    iconClassName="left-3 h-4 w-4"
                    inputClassName="pl-10"
                  />
                </div>
                <DisciplineFilter
                  sport={selectedDiscipline}
                  sub={selectedSub}
                  onSportChange={setSelectedDiscipline}
                  onSubChange={setSelectedSub}
                />
                <div>
                  <label className="text-sm font-bold mb-2 block">Région</label>
                  <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les régions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les régions</SelectItem>
                      {regions.map((r) => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="sticky bottom-0 -mx-6 -mb-6 mt-6 flex gap-3 border-t border-border bg-background px-6 py-4">
                {activeFiltersCount > 0 && (
                  <Button type="button" variant="outline" className="flex-1" onClick={clearFilters}>
                    Effacer
                  </Button>
                )}
                <Button type="button" className="flex-1" onClick={() => setFiltersOpen(false)}>
                  {isLoading ? 'Voir les clubs' : `Voir ${totalCount} club${totalCount > 1 ? 's' : ''}`}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
      <div className="lg:grid lg:grid-cols-[minmax(0,55fr)_minmax(0,45fr)]">
        <div ref={listRef} className={cn('min-w-0 px-4 py-6 pb-24 lg:px-6 lg:pb-8 lg:h-[calc(100dvh-192px)] lg:overflow-y-auto lg:overscroll-contain', mobileMap && 'hidden lg:block')}>
          <section className="mb-6">
            <h1 className="text-2xl font-black text-foreground mb-2">Rechercher un club</h1>
            <p className="text-muted-foreground">
              {isLoading ? 'Recherche en cours…' : <>{totalCount} club{totalCount > 1 ? 's' : ''} trouvé{totalCount > 1 ? 's' : ''}</>}
              {!isLoading && nearCity && searchResult.radiusKm ? ` dans un rayon de ${searchResult.radiusKm} km autour ${/^[aeiouyhàâéèêîôûAEIOUYHÉÈÊ]/.test(nearCity.name) ? "d’" : "de "}${nearCity.name}` : ''}
            </p>
          </section>
        {/* Bandeau annuaire fédéral */}
        {(() => {
          const fed = getFederationForDiscipline(selectedDiscipline, federationSources);
          if (!fed) return null;
          const url = fed.buildSearchUrl({ city: searchQuery, postalCode: searchQuery });
          return (
            <div className="mb-6 rounded-2xl border border-border bg-creme p-4 lg:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div className="text-3xl" aria-hidden>{fed.icon}</div>
              <div className="flex-1">
                <p className="font-sans font-bold text-foreground">
                  Annuaire officiel - {fed.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  Retrouvez l'exhaustivité des clubs affiliés{searchQuery ? ` à "${searchQuery}"` : ''} sur le site fédéral.
                </p>
              </div>
              <Button asChild variant="default" className="gap-2">
                <a href={url} target="_blank" rel="noopener noreferrer">
                  Voir l'annuaire <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </div>
          );
        })()}



            {/* Results */}
            {isLoading ? (
              <div className="text-center py-16">
                <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Chargement des clubs…</p>
              </div>
            ) : filteredClubs.length === 0 ? (
              <div className="text-center py-16">
                <img src="/brand/picto-info-bleu.svg" alt="" className="h-16 w-auto mx-auto mb-4" />
                <h3 className="font-sans text-xl font-black text-foreground mb-2">
                  Aucun club trouvé
                </h3>
                <p className="text-muted-foreground mb-6">
                  Essayez de modifier vos critères de recherche
                </p>
                <Button onClick={clearFilters}>Effacer les filtres</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredClubs.map((club) => (
                  <Link key={club.id} to={`/club/${club.id}`}
                    ref={(node) => { if (node) clubRefs.current.set(club.id, node); else clubRefs.current.delete(club.id); }}
                    data-club-id={club.id}
                    onMouseEnter={() => setHoveredClubId(club.id)} onMouseLeave={() => setHoveredClubId(null)}
                    onFocus={() => setHoveredClubId(club.id)} onBlur={() => setHoveredClubId(null)}
                    className="group block scroll-mt-24 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                    <div className={cn(
                      "bg-card rounded-lg border border-border overflow-hidden flex transition-colors",
                      (selectedClubId === club.id || hoveredClubId === club.id) && 'border-primary ring-2 ring-primary/30' 
                    )}>
                      <ClubCardVisual
                        club={club}
                        className="w-24 sm:w-32 xl:w-40 min-h-36 flex-shrink-0"
                      >
                        <FavoriteButton
                          clubId={club.id}
                          className="absolute top-3 left-3 px-2 py-2 shadow-sm"
                        />
                      </ClubCardVisual>

                      {/* Content */}
                      <div className="p-4 flex-1 min-w-0">
                        <div className="mb-4"><ClubCardBody club={club} /></div>
                        <div className="flex items-center justify-end pt-4 border-t border-border">
                          <div className="w-10 h-10 rounded-pill bg-creme flex items-center justify-center">
                            <ArrowRight className="w-5 h-5 text-primary" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            {isFetching && !isLoading && (
              <p className="text-xs text-muted-foreground text-center mt-4">Mise à jour…</p>
            )}

            {!isLoading && totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0 || isFetching}
              >
                ← Précédent
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page + 1} / {totalPages || 1}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage((p) => p + 1)}
                disabled={page + 1 >= totalPages || isFetching}
              >
                Suivant →
              </Button>
            </div>
            )}


        </div>
        <aside aria-label="Carte des résultats" className={cn(
          'lg:block lg:sticky lg:inset-auto lg:top-48 lg:self-start lg:h-[calc(100dvh-192px)]',
          mobileMap ? 'fixed inset-x-0 bottom-0 top-16 z-30' : 'hidden',
        )}>
          <FranceMap height="100%" clubs={filteredClubs}
            highlightedClubId={hoveredClubId ?? selectedClubId} onClubClick={selectMapClub}
            className="rounded-none border-0 border-l shadow-none" />
          {mobileMap && <Button variant="outline" className="absolute top-4 right-4 z-10 lg:hidden gap-2" onClick={() => setFiltersOpen(true)}>
            <SlidersHorizontal className="h-4 w-4" />Filtres
          </Button>}
        </aside>
      </div>
      <Button className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 lg:hidden gap-2 shadow-lg"
        onClick={() => setMobileMap((value) => !value)}>
        {mobileMap ? <List className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
        {mobileMap ? 'Liste' : 'Carte'}
      </Button>
    </Layout>
  );
}
