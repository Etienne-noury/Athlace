import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useAvailableDisciplines, formatClubCount } from '@/hooks/useAvailableDisciplines';
import { useNavigate, Link } from 'react-router-dom';
import { Search, MapPin, ChevronDown, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DisciplineFilter } from '@/components/filters/DisciplineFilter';
import { getParentDisciplines } from '@/data/disciplines';
import { regions } from '@/data/clubs';
import { useSiteStats } from '@/hooks/useSiteStats';
import { formatCount, formatExact } from '@/lib/format-stats';

export function HeroSection() {
  const navigate = useNavigate();
  const { stats, isReady } = useSiteStats();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState('all');
  const [selectedSub, setSelectedSub] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('');

  // Get parent disciplines organized by category
  const parentDisciplines = getParentDisciplines();
  const avail = useAvailableDisciplines();

  // Les 5 sports disponibles avec le plus de clubs ; repli sur l'ordre de l'arborescence tant que les données ne sont pas chargées.
  const ranked = parentDisciplines
    .map((d) => ({ id: d.id, clubs: avail.sportCount(d.id) }))
    .filter((d) => d.clubs > 0)
    .sort((a, b) => b.clubs - a.clubs)
    .map((d) => parentDisciplines.find((p) => p.id === d.id)!);
  const popularSports = (ranked.length ? ranked : parentDisciplines).slice(0, 5);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedDiscipline !== 'all') params.set('discipline', selectedDiscipline);
    if (selectedSub !== 'all') params.set('sous-discipline', selectedSub);
    if (selectedRegion) params.set('region', selectedRegion);
    navigate(`/clubs/?${params.toString()}`);
  };


  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-blue-500" />
      
      {/* Decorative elements */}

      <div className="hero-compact relative container mx-auto px-4 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-pill bg-glass backdrop-blur-sm border border-glass-border mb-6 animate-fade-up">
            <span className="text-sm font-medium text-cream-100">
              🇫🇷 {isReady ? `${formatCount(stats.clubs)} clubs · ${formatExact(stats.federations_covered)} fédérations agréées` : 'Clubs sportifs référencés en France'}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-display text-heading-1 md:text-display font-bold text-cream-100 mb-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Trouvez{' '}
            <span className="text-lime-500">
              LE
            </span>{' '}
            club sportif qui vous correspond
          </h1>

          <p className="text-lg md:text-xl text-surface-alt mb-10 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Tous les clubs des fédérations sportives agréées, réunis au même endroit. Découvrez, comparez et bientôt inscrivez-vous en ligne.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <div className="bg-surface rounded-2xl p-3 shadow-sm">
              <div className="flex flex-col lg:flex-row gap-3">
                {/* Search Input */}
                <div className="flex-1 min-w-0 lg:min-w-[220px] relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Ville, code postal ou nom de club..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-14 text-base border-0 bg-muted focus-visible:ring-primary"
                  />
                </div>

                {/* Discipline Filter (sport + sous-discipline) */}
                <DisciplineFilter
                  sport={selectedDiscipline}
                  sub={selectedSub}
                  onSportChange={setSelectedDiscipline}
                  onSubChange={setSelectedSub}
                  showLabels={false}
                  showSub={false}
                  layout="inline"
                  className="w-full lg:w-auto"
                  triggerClassName="h-14 w-full lg:w-56 border-0 bg-muted"
                  contentClassName="z-[2000]"
                />

                {/* Region Select */}
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger className="h-14 w-full lg:w-48 border-0 bg-muted">
                    <MapPin className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Région" />
                  </SelectTrigger>
                  <SelectContent className="bg-card z-[2000]">
                    {regions.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Search Button */}
                <Button type="submit" size="lg" className="h-14 px-8 text-lg font-semibold">
                  Rechercher
                </Button>
              </div>
            </div>
          </form>

          {/* Map CTA Button */}
          <div className="mt-6 animate-fade-up" style={{ animationDelay: '0.35s' }}>
            <Link to="/carte">
              <Button variant="outline" size="lg" className="gap-2 bg-glass border-glass-border text-cream-100 hover:bg-glass hover:text-cream-100">
                <Map className="w-5 h-5" />
                Voir tous les clubs sur la carte
              </Button>
            </Link>
          </div>

          {/* Quick Links */}
          <div className="mt-6 flex flex-wrap justify-center gap-2 animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <span className="text-surface-alt text-sm">Populaires :</span>
            {popularSports.map((d) => {
              const ok = avail.isSportAvailable(d.id);
              return (
                <button
                  key={d.id}
                  type="button"
                  disabled={!ok}
                  onClick={() => ok && navigate(`/clubs/?discipline=${d.id}`)}
                  className={cn(
                    'px-3 py-1.5 rounded-pill bg-glass text-cream-100 text-sm hover:bg-glass transition-colors',
                    !ok && 'opacity-50 cursor-not-allowed',
                  )}
                >
                  {d.icon} {d.name}
                  {avail.isReady && (
                    <span className="ml-1 opacity-80">
                      · {ok ? formatClubCount(avail.sportCount(d.id)) : 'Bientôt'}
                    </span>
                  )}
                </button>
              );
            })}

          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-surface-alt" />
        </div>
      </div>
    </section>
  );
}
