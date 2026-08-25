import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, MapPin, X } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DisciplineFilter } from '@/components/filters/DisciplineFilter';
import { FranceMap } from '@/components/map/FranceMap';
import { regions } from '@/data/clubs';

export default function Carte() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedDiscipline, setSelectedDiscipline] = useState(searchParams.get('discipline') || 'all');
  const [selectedSub, setSelectedSub] = useState(searchParams.get('sous-discipline') || 'all');
  const [selectedRegion, setSelectedRegion] = useState(searchParams.get('region') || 'all');
  const [locationQuery, setLocationQuery] = useState(searchParams.get('q') || '');

  useEffect(() => {
    const next: Record<string, string> = {};
    if (locationQuery.trim()) next.q = locationQuery.trim();
    if (selectedDiscipline !== 'all') next.discipline = selectedDiscipline;
    if (selectedSub !== 'all') next['sous-discipline'] = selectedSub;
    if (selectedRegion !== 'all') next.region = selectedRegion;
    setSearchParams(next, { replace: true });
  }, [locationQuery, selectedDiscipline, selectedSub, selectedRegion, setSearchParams]);

  const clearFilters = () => {
    setSelectedDiscipline('all');
    setSelectedSub('all');
    setSelectedRegion('all');
    setLocationQuery('');
  };

  const hasActiveFilters = Boolean(
    locationQuery || selectedDiscipline !== 'all' || selectedSub !== 'all' || selectedRegion !== 'all',
  );

  return (
    <Layout>
      {/* Header */}
      <section className="bg-sport-gradient text-white py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-2xl lg:text-4xl font-bold mb-2">
            Carte des clubs sportifs
          </h1>
          <p className="text-white/80 text-lg">
            Visualisez et trouvez tous les clubs de France
          </p>
        </div>
      </section>

      {/* Filters */}
      <div className="bg-card border-b border-border sticky top-0 z-[1001]">
        <div className="container mx-auto px-4 py-4">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-[auto_minmax(0,2fr)_minmax(190px,1fr)_minmax(190px,1fr)_auto] xl:items-end">
            <div className="flex items-center gap-2 text-muted-foreground sm:col-span-2 xl:col-span-1 xl:self-center">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filtres :</span>
            </div>

            <DisciplineFilter
              sport={selectedDiscipline}
              sub={selectedSub}
              onSportChange={setSelectedDiscipline}
              onSubChange={setSelectedSub}
              showLabels
              layout="inline"
              className="sm:col-span-2 xl:col-span-1 xl:grid xl:grid-cols-2"
              triggerClassName="w-full min-w-[190px]"
              contentClassName="bg-card z-[2000]"
            />

            <div>
              <label htmlFor="map-location" className="text-sm font-medium text-foreground mb-2 block">
                Ville ou code postal
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="map-location"
                  value={locationQuery}
                  onChange={(event) => setLocationQuery(event.target.value)}
                  placeholder="Paris, 75015…"
                  className="pl-9"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Région</label>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Région" />
                </SelectTrigger>
                <SelectContent className="bg-card z-[2000]">
                  <SelectItem value="all">Toutes les régions</SelectItem>
                  {regions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={clearFilters}
              disabled={!hasActiveFilters}
              aria-label="Effacer les filtres"
              title="Effacer les filtres"
              className="self-end"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="h-[calc(100vh-220px)]">
        <FranceMap
          height="100%"
          selectedDiscipline={selectedDiscipline}
          selectedSub={selectedSub}
          selectedRegion={selectedRegion}
          locationQuery={locationQuery}
          maxClubs={100}
        />
      </div>
    </Layout>
  );
}
