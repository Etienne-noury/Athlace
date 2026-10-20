import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, MapPin, ArrowRight, Grid3X3, List, SlidersHorizontal, X, Loader2, ExternalLink } from 'lucide-react';
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
import { disciplines, getDisciplineQueryNames, getSubDisciplineValue } from '@/data/disciplines';
import { DisciplineFilter } from '@/components/filters/DisciplineFilter';
import { fetchEnrichedClubs } from '@/lib/api/enriched-clubs';
import { fetchClubsNear, resolveCity } from '@/lib/api/geo-search';
import { SearchAutocomplete } from '@/components/search/SearchAutocomplete';
import type { EnrichedClub as Club } from '@/lib/api/enriched-clubs';
import { fetchFederationSources, getFederationForDiscipline } from '@/lib/federations-map';
import { cn } from '@/lib/utils';

export default function Recherche() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(0);

  // Filters
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedDiscipline, setSelectedDiscipline] = useState(searchParams.get('discipline') || 'all');
  const [selectedSub, setSelectedSub] = useState(searchParams.get('sous-discipline') || 'all');
  const [selectedRegion, setSelectedRegion] = useState(searchParams.get('region') || 'all');

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

  const { data: searchResult = { clubs: [], total: 0 } as { clubs: Club[]; total: number; radiusKm?: number }, isLoading, isFetching } = useQuery({
    queryKey: ['clubs', 'search', searchQuery, selectedDiscipline, selectedSub, selectedRegion, page, nearCity?.lat, nearCity?.lng],
    enabled: cityReady,
    queryFn: async (): Promise<{ clubs: Club[]; total: number; radiusKm?: number }> => {
      if (nearCity) {
        const r = await fetchClubsNear({
          lat: nearCity.lat,
          lng: nearCity.lng,
          disciplines: getDisciplineQueryNames(selectedDiscipline),
          sub: getSubDisciplineValue(selectedDiscipline, selectedSub),
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
        subDiscipline: getSubDisciplineValue(selectedDiscipline, selectedSub),
        region: selectedRegion,
        limit: 100,
        offset: page * 100,
      });
    },
  });

  const filteredClubs = searchResult.clubs;
  const totalCount = searchResult.total;
  const totalPages = Math.ceil(totalCount / 100);


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
      {/* Header */}
      <section className="bg-muted border-b border-border py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-sans text-3xl lg:text-4xl font-black text-foreground mb-2">
            Rechercher un club
          </h1>
          <p className="text-muted-foreground text-lg">
            {totalCount} club{totalCount > 1 ? 's' : ''} trouvé{totalCount > 1 ? 's' : ''}
            {nearCity && searchResult.radiusKm ? ` dans un rayon de ${searchResult.radiusKm} km autour ${/^[aeiouyhàâéèêîôûAEIOUYHÉÈÊ]/.test(nearCity.name) ? "d’" : "de "}${nearCity.name}` : ''}
          </p>

        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
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

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <div className="bg-card rounded-2xl border border-border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-sans font-black text-lg">Filtres</h2>
                  {activeFiltersCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
                      Effacer
                    </Button>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Search */}
                  <div>
                    <label className="text-sm font-bold text-foreground mb-2 block">
                      Recherche
                    </label>
                    <SearchAutocomplete
                      value={searchQuery}
                      onChange={setSearchQuery}
                      onPickSport={(id) => { setSelectedDiscipline(id); setSelectedSub('all'); }}
                      placeholder="Ville, code postal, sport..."
                      iconClassName="left-3 h-4 w-4"
                      inputClassName="pl-10"
                    />
                  </div>

                  {/* Discipline (2 niveaux) */}
                  <DisciplineFilter
                    sport={selectedDiscipline}
                    sub={selectedSub}
                    onSportChange={setSelectedDiscipline}
                    onSubChange={setSelectedSub}
                  />

                  {/* Region */}
                  <div>
                    <label className="text-sm font-bold text-foreground mb-2 block">
                      Région
                    </label>
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
              </div>
            </div>
          </aside>

          {/*
            Note: les filtres "Niveau" et "Prix licence" ont été retirés,
            car l'API publique des équipements sportifs ne fournit pas
            ces informations (niveau / tarif licence).
          */}




          {/* Mobile Filter Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden mb-4 gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                Filtres
                {activeFiltersCount > 0 && (
                  <Badge className="ml-1">{activeFiltersCount}</Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Filtres</SheetTitle>
                <SheetDescription>Affinez votre recherche</SheetDescription>
              </SheetHeader>
              <div className="space-y-6 mt-6">
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
                      <SelectValue placeholder="Toutes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes</SelectItem>
                      {regions.map((r) => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                {activeFiltersCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
                    <X className="w-4 h-4" />
                    Effacer les filtres
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Results */}
            {isLoading ? (
              <div className="text-center py-16">
                <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Chargement des clubs…</p>
              </div>
            ) : filteredClubs.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 rounded-pill bg-muted flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="font-sans text-xl font-black text-foreground mb-2">
                  Aucun club trouvé
                </h3>
                <p className="text-muted-foreground mb-6">
                  Essayez de modifier vos critères de recherche
                </p>
                <Button onClick={clearFilters}>Effacer les filtres</Button>
              </div>
            ) : (
              <div className={cn(
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'space-y-4'
              )}>
                {filteredClubs.map((club) => (
                  <Link key={club.id} to={`/club/${club.id}`}>
                    <div className={cn(
                      "bg-card rounded-2xl border border-border overflow-hidden card-hover",
                      viewMode === 'list' && 'flex'
                    )}>
                      <ClubCardVisual
                        club={club}
                        className={viewMode === 'grid' ? 'aspect-[4/3]' : 'w-48 h-32 flex-shrink-0'}
                      >
                        <FavoriteButton
                          clubId={club.id}
                          className="absolute top-3 left-3 px-2 py-2 shadow-sm"
                        />
                      </ClubCardVisual>

                      {/* Content */}
                      <div className="p-5 flex-1">
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

            <div className="flex items-center justify-center gap-4 mt-8">
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


          </div>
        </div>
      </div>
    </Layout>
  );
}
