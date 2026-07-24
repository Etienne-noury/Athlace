import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, MapPin, Star, ArrowRight, Grid3X3, List, SlidersHorizontal, X, Loader2, ExternalLink } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { disciplines, getParentDisciplines } from '@/data/disciplines';
import { fetchClubs } from '@/lib/api/equipements';
import { fetchEnrichedClubs } from '@/lib/api/enriched-clubs';
import { getFederationForDiscipline } from '@/lib/federations-map';
import { cn } from '@/lib/utils';

export default function Recherche() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filters
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedDiscipline, setSelectedDiscipline] = useState(searchParams.get('discipline') || 'all');
  const [selectedRegion, setSelectedRegion] = useState(searchParams.get('region') || 'all');

  const { data: filteredClubs = [], isLoading, isFetching } = useQuery({
    queryKey: ['clubs', 'search', searchQuery, selectedDiscipline, selectedRegion],
    queryFn: async () => {
      const [govClubs, enriched] = await Promise.all([
        fetchClubs({
          q: searchQuery,
          discipline: selectedDiscipline,
          region: selectedRegion,
          limit: 60,
        }),
        fetchEnrichedClubs({
          q: searchQuery,
          discipline: selectedDiscipline,
          limit: 30,
        }),
      ]);
      // Fédéral d'abord (contacts complets), puis open data
      return [...enriched, ...govClubs];
    },
  });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedDiscipline('all');
    setSelectedRegion('all');
    setSearchParams({});
  };

  const activeFiltersCount = [
    searchQuery,
    selectedDiscipline !== 'all' ? selectedDiscipline : '',
    selectedRegion !== 'all' ? selectedRegion : '',
  ].filter(Boolean).length;


  return (
    <Layout>
      {/* Header */}
      <section className="bg-muted/30 border-b border-border py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-2">
            Rechercher un club
          </h1>
          <p className="text-muted-foreground text-lg">
            {filteredClubs.length} club{filteredClubs.length > 1 ? 's' : ''} trouvé{filteredClubs.length > 1 ? 's' : ''}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Bandeau annuaire fédéral */}
        {(() => {
          const fed = getFederationForDiscipline(selectedDiscipline);
          if (!fed) return null;
          const url = fed.buildSearchUrl({ city: searchQuery, postalCode: searchQuery });
          return (
            <div className="mb-6 rounded-2xl border border-primary/20 bg-primary/5 p-4 lg:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div className="text-3xl" aria-hidden>{fed.icon}</div>
              <div className="flex-1">
                <p className="font-display font-semibold text-foreground">
                  Annuaire officiel — {fed.name}
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
                  <h2 className="font-display font-semibold text-lg">Filtres</h2>
                  {activeFiltersCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
                      Effacer
                    </Button>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Search */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Recherche
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Ville, code postal..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Discipline */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Discipline
                    </label>
                    <Select value={selectedDiscipline} onValueChange={setSelectedDiscipline}>
                      <SelectTrigger>
                        <SelectValue placeholder="Toutes les disciplines" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les disciplines</SelectItem>
                        {getParentDisciplines()
                          .slice()
                          .sort((a, b) => b.popularity - a.popularity)
                          .map((d) => (
                            <SelectItem key={d.id} value={d.id}>
                              {d.icon} {d.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Region */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
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
                  <label className="text-sm font-medium mb-2 block">Recherche</label>
                  <Input
                    placeholder="Ville, code postal..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Discipline</label>
                  <Select value={selectedDiscipline} onValueChange={setSelectedDiscipline}>
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes</SelectItem>
                      {getParentDisciplines()
                        .slice()
                        .sort((a, b) => b.popularity - a.popularity)
                        .map((d) => (
                          <SelectItem key={d.id} value={d.id}>{d.icon} {d.name}</SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Région</label>
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
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
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
                      "bg-card rounded-2xl border border-border/50 overflow-hidden card-hover",
                      viewMode === 'list' && 'flex'
                    )}>
                      {/* Image */}
                      <div className={cn(
                        "bg-gradient-to-br from-primary/20 to-accent/20 relative",
                        viewMode === 'grid' ? 'aspect-[4/3]' : 'w-48 h-32 flex-shrink-0'
                      )}>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-4xl opacity-50">
                            {disciplines.find(d => d.id === club.discipline)?.icon || '🏆'}
                          </span>
                        </div>
                        {club.rating > 0 && (
                          <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                            <Star className="w-4 h-4 fill-warning text-warning" />
                            <span className="text-sm font-semibold">{club.rating}</span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5 flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <p className="text-sm text-primary font-medium">
                            {club.disciplineName}
                          </p>
                          {(() => {
                            const fed = getFederationForDiscipline(club.discipline);
                            return fed ? (
                              <Badge variant="outline" className="text-[10px] gap-1 px-1.5 py-0">
                                <span aria-hidden>{fed.icon}</span> {fed.code}
                              </Badge>
                            ) : null;
                          })()}
                        </div>
                        <h3 className="font-display font-semibold text-lg text-foreground mb-2 line-clamp-2">
                          {club.name}
                        </h3>
                        <div className="flex items-center gap-1 text-muted-foreground text-sm mb-4">
                          <MapPin className="w-4 h-4" />
                          <span>{[club.city, club.region].filter(Boolean).join(', ')}</span>
                        </div>
                        <div className="flex items-center justify-end pt-4 border-t border-border/50">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
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

          </div>
        </div>
      </div>
    </Layout>
  );
}
