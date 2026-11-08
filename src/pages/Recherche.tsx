import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MapPin, ArrowRight, List, SlidersHorizontal, X, Loader2, LocateFixed } from 'lucide-react';
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
import { cn } from '@/lib/utils';
import { FranceMap } from '@/components/map/FranceMap';
import { requestVisitorPosition, reversePlaceName, VisitorPositionError, POSITION_FAILURE_MESSAGES, type PositionFailure, type VisitorPosition } from '@/lib/visitor-position';
import { Slider } from '@/components/ui/slider';

const DISTANCE_MIN = 1;
const DISTANCE_MAX = 100;

const EMPTY_RESULTS: { clubs: Club[]; total: number; radiusKm?: number } = { clubs: [], total: 0 };

export default function Recherche() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const aroundRequested = searchParams.get('autour') === '1';
  const radiusParam = Number(searchParams.get('rayon'));
  const chosenRadius = Number.isFinite(radiusParam) && radiusParam >= DISTANCE_MIN && radiusParam <= DISTANCE_MAX ? Math.round(radiusParam) : undefined;
  const setUrlParam = useCallback((key: string, value: string | null) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set(key, value); else next.delete(key);
      return next;
    }, { replace: true });
  }, [setSearchParams]);
  const [visitorPosition, setVisitorPosition] = useState<VisitorPosition | null>(null);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'pending' | 'ready' | 'unavailable'>('idle');
  const [locationFailure, setLocationFailure] = useState<PositionFailure | null>(null);
  const [placeName, setPlaceName] = useState<string | null>(null);
  const [locateAttempt, setLocateAttempt] = useState(0);
  const locationPending = aroundRequested && (locationStatus === 'idle' || locationStatus === 'pending');

  useEffect(() => {
    let cancelled = false;
    setVisitorPosition(null);
    setPlaceName(null);
    setLocationFailure(null);
    if (!aroundRequested) {
      setLocationStatus('idle');
      return;
    }
    setLocationStatus('pending');
    requestVisitorPosition().then((position) => {
      if (cancelled) return;
      setVisitorPosition(position);
      setLocationStatus('ready');
      reversePlaceName(position).then((name) => { if (!cancelled) setPlaceName(name); });
    }).catch((error) => {
      if (cancelled) return;
      setLocationStatus('unavailable');
      setLocationFailure(error instanceof VisitorPositionError ? error.reason : 'unavailable');
    });
    return () => { cancelled = true; };
  }, [aroundRequested, locateAttempt]);
  const [mobileMap, setMobileMap] = useState(false);
  const [hoveredClubId, setHoveredClubId] = useState<string | null>(null);
  const [selectedClubId, setSelectedClubId] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const clubRefs = useRef(new Map<string, HTMLAnchorElement>());
  const selectMapClub = useCallback((id: string) => {
    if (!clubRefs.current.has(id)) {
      navigate(`/club/${id}`);
      return;
    }
    setSelectedClubId(id);
    setMobileMap(false);
    requestAnimationFrame(() => {
      const item = clubRefs.current.get(id);
      const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
      const list = listRef.current;
      if (item && list && window.matchMedia('(min-width: 1280px)').matches) {
        list.scrollTo({ top: list.scrollTop + item.getBoundingClientRect().top - list.getBoundingClientRect().top - (list.clientHeight - item.clientHeight) / 2, behavior });
      } else if (item) {
        window.scrollTo({ top: window.scrollY + item.getBoundingClientRect().top - 88, behavior: 'auto' });
      }
      item?.focus({ preventScroll: true });
    });
  }, [navigate]);
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
  }, [searchQuery, selectedDiscipline, selectedSub, selectedRegion, aroundRequested, visitorPosition, chosenRadius]);

  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    const filters = { q: searchQuery, discipline: selectedDiscipline, 'sous-discipline': selectedSub, region: selectedRegion };
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') next.set(key, value);
      else next.delete(key);
    });
    if (next.toString() !== searchParams.toString()) setSearchParams(next, { replace: true });
  }, [searchQuery, selectedDiscipline, selectedSub, selectedRegion, searchParams, setSearchParams]);

  // Si la saisie correspond à une commune, on cherche les clubs autour (rayon élargi si besoin).
  const { data: nearCity = null, isFetching: cityFetching } = useQuery({
    queryKey: ['resolve-city', searchQuery.trim().toLowerCase()],
    queryFn: () => resolveCity(searchQuery),
    enabled: !aroundRequested && searchQuery.trim().length >= 2,
    staleTime: 60 * 60 * 1000,
  });
  const cityReady = aroundRequested || searchQuery.trim().length < 2 || !cityFetching;
  const searchPosition = aroundRequested ? visitorPosition : nearCity;
  const [nearRadius, setNearRadius] = useState<number | undefined>(undefined);
  useEffect(() => { setNearRadius(undefined); }, [searchPosition, selectedDiscipline, selectedSub, selectedRegion, chosenRadius]);

  const { data: searchResult = EMPTY_RESULTS, isLoading, isFetching } = useQuery({
    queryKey: ['clubs', 'search', searchQuery, selectedDiscipline, selectedSub, subDiscipline, selectedRegion, page, aroundRequested, searchPosition?.lat, searchPosition?.lng, chosenRadius],
    enabled: !locationPending && cityReady && (selectedSub === 'all' || avail.isReady),
    queryFn: async (): Promise<{ clubs: Club[]; total: number; radiusKm?: number }> => {
      if (searchPosition) {
        const r = await fetchClubsNear({
          lat: searchPosition.lat,
          lng: searchPosition.lng,
          disciplines: getDisciplineQueryNames(selectedDiscipline),
          sub: subDiscipline,
          region: selectedRegion,
          limit: 100,
          offset: page * 100,
          radiusKm: chosenRadius ?? (page > 0 ? nearRadius : undefined),
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


  const updateSearchQuery = (value: string) => {
    setSearchQuery(value);
    if (aroundRequested && value.trim()) setUrlParam('autour', null);
  };
  const startAround = () => {
    setSearchQuery('');
    if (aroundRequested) {
      setLocateAttempt((n) => n + 1);
      return;
    }
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('q');
      next.set('autour', '1');
      return next;
    }, { replace: true });
  };
  const stopAround = () => setUrlParam('autour', null);

  const locateProps = {
    onLocate: startAround,
    locating: locationPending,
    aroundActive: aroundRequested && locationStatus !== 'unavailable',
    aroundLabel: placeName,
    onClearAround: stopAround,
  };

  const shownRadius = chosenRadius ?? searchResult.radiusKm ?? 20;
  const [draftRadius, setDraftRadius] = useState<number | null>(null);
  const distanceFilter = (
    <div className="min-w-0">
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <label id="distance-label" className="block text-sm font-bold">Distance</label>
        <span className={cn('text-sm font-bold', searchPosition ? 'text-primary' : 'text-muted-foreground')}>
          {searchPosition ? `${draftRadius ?? shownRadius} km` : '–'}
        </span>
      </div>
      <div className="flex h-10 items-center">
        <Slider aria-labelledby="distance-label" min={DISTANCE_MIN} max={DISTANCE_MAX} step={1}
          disabled={!searchPosition}
          value={[draftRadius ?? shownRadius]}
          onValueChange={([km]) => setDraftRadius(km)}
          onValueCommit={([km]) => { setDraftRadius(null); setUrlParam('rayon', String(km)); }} />
      </div>
      {!searchPosition && (
        <p className="mt-1 text-xs text-muted-foreground xl:hidden">Choisissez une ville ou « Autour de moi ».</p>
      )}
    </div>
  );

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
    aroundRequested ? 'autour' : '',
    chosenRadius ? 'rayon' : '',
  ].filter(Boolean).length;


  return (
    <Layout>
      <div className="hidden xl:block sticky top-20 z-40 border-b border-border bg-blanc">
        <div className="grid grid-cols-[minmax(200px,1.2fr)_minmax(0,2fr)_minmax(160px,1fr)_minmax(170px,1fr)_auto] items-end gap-4 px-6 py-4">
          <div className="min-w-0">
            <label className="mb-2 block text-sm font-bold">Recherche</label>
            <SearchAutocomplete value={searchQuery} onChange={updateSearchQuery} {...locateProps}
              onPickSport={(id) => { setSelectedDiscipline(id); setSelectedSub('all'); }}
              placeholder="Ville, code postal, sport…" iconClassName="left-3 h-4 w-4" inputClassName="pl-10" />
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
          {distanceFilter}
          <Button variant="ghost" onClick={clearFilters} disabled={!activeFiltersCount} className="gap-2">
            <X className="h-4 w-4" />Effacer
          </Button>
        </div>
      </div>

          {/* Mobile Filter Sheet */}
          <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
            <SheetTrigger asChild>
              <Button aria-label="Filtres" variant="outline" className="xl:hidden mx-4 mt-4 gap-2">
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
                    onChange={updateSearchQuery}
                    {...locateProps}
                    onPickSport={(id) => { setSelectedDiscipline(id); setSelectedSub('all'); }}
                    placeholder="Ville, code postal, sport…"
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
                {distanceFilter}
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
      <div className="xl:grid xl:grid-cols-[minmax(0,55fr)_minmax(0,45fr)]">
        <div ref={listRef} className={cn('min-w-0 px-4 py-6 pb-24 xl:px-6 xl:pb-8 xl:h-[calc(100dvh-192px)] xl:overflow-y-auto xl:overscroll-contain', mobileMap && 'hidden xl:block')}>
          <section className="mb-6">
            <h1 className="text-2xl font-black text-foreground mb-2">Rechercher un club</h1>
            <p className="text-muted-foreground">
              {locationPending ? 'Localisation en cours… Autorisez l’accès à votre position si votre navigateur le demande.' : isLoading ? 'Recherche en cours…' : <>{totalCount} club{totalCount > 1 ? 's' : ''} trouvé{totalCount > 1 ? 's' : ''}</>}
              {!locationPending && !isLoading && aroundRequested && visitorPosition ? `${searchResult.radiusKm ? ` dans un rayon de ${searchResult.radiusKm} km` : ''} autour de vous${placeName ? ` (${placeName})` : ''}` : ''}
              {!isLoading && !aroundRequested && nearCity && searchResult.radiusKm ? ` dans un rayon de ${searchResult.radiusKm} km autour ${/^[aeiouyhàâéèêîôûAEIOUYHÉÈÊ]/.test(nearCity.name) ? "d’" : "de "}${nearCity.name}` : ''}
            </p>
            {aroundRequested && locationStatus === 'unavailable' && (
              <div role="alert" className="mt-4 flex flex-col gap-3 rounded-xl border border-primary/30 bg-blanc p-4 sm:flex-row sm:items-center">
                <LocateFixed className="h-5 w-5 shrink-0 text-primary" aria-hidden />
                <p className="flex-1 text-sm text-foreground">
                  {POSITION_FAILURE_MESSAGES[locationFailure ?? 'unavailable']} En attendant, les résultats ne sont pas triés par distance.
                </p>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => setLocateAttempt((n) => n + 1)}>Réessayer</Button>
                  <Button size="sm" variant="outline" onClick={stopAround}>Saisir une ville</Button>
                </div>
              </div>
            )}
          </section>
            {/* Results */}
            {locationPending || isLoading ? (
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
                  <div key={club.id} className="relative">
                  <Link to={`/club/${club.id}`}
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
                      />

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
                  <FavoriteButton
                    clubId={club.id}
                    className="absolute top-3 left-3 z-10 px-2 py-2 shadow-sm"
                  />
                  </div>
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
          'xl:block xl:sticky xl:inset-auto xl:top-48 xl:self-start xl:h-[calc(100dvh-192px)]',
          mobileMap ? 'fixed inset-x-0 bottom-0 top-16 lg:top-20 z-30' : 'hidden',
        )}>
          <FranceMap height="100%" selectedDiscipline={selectedDiscipline} selectedSub={selectedSub}
            selectedRegion={selectedRegion} searchQuery={searchPosition ? '' : searchQuery}
            proximity={searchPosition && searchResult.radiusKm ? { lat: searchPosition.lat, lng: searchPosition.lng, radiusKm: searchResult.radiusKm } : undefined}
            searchMode searchReady={!locationPending && cityReady && !isLoading}
            highlightedClubId={hoveredClubId ?? selectedClubId} onClubClick={selectMapClub}
            className="rounded-none border-0 border-l shadow-none" />
          {mobileMap && <Button variant="outline" className="absolute top-4 right-4 z-10 xl:hidden gap-2" onClick={() => setFiltersOpen(true)}>
            <SlidersHorizontal className="h-4 w-4" />Filtres
          </Button>}
        </aside>
      </div>
      <Button className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 xl:hidden gap-2 shadow-lg"
        onClick={() => setMobileMap((value) => !value)}>
        {mobileMap ? <List className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
        {mobileMap ? 'Liste' : 'Carte'}
      </Button>
    </Layout>
  );
}
