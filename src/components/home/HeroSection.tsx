import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, MapPin, ChevronDown, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getParentDisciplines, categories } from '@/data/disciplines';
import { regions } from '@/data/clubs';
import { useSiteStats } from '@/hooks/useSiteStats';
import { formatCount } from '@/lib/format-stats';

export function HeroSection() {
  const navigate = useNavigate();
  const { stats, isReady } = useSiteStats();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');

  // Get parent disciplines organized by category
  const parentDisciplines = getParentDisciplines();
  
  const getDisciplinesByCategory = () => {
    const result: Record<string, typeof parentDisciplines> = {};
    Object.keys(categories).forEach(cat => {
      result[cat] = parentDisciplines.filter(d => d.category === cat);
    });
    return result;
  };
  
  const disciplinesByCategory = getDisciplinesByCategory();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedDiscipline) params.set('discipline', selectedDiscipline);
    if (selectedRegion) params.set('region', selectedRegion);
    navigate(`/clubs/?${params.toString()}`);
  };


  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-5 bg-cover bg-center" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="relative container mx-auto px-4 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6 animate-fade-up">
            <span className="text-sm font-medium text-white/90">
              🇫🇷 Plus de 100 000 clubs référencés en France
            </span>
          </div>

          {/* Title */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Trouvez{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-accent">
              LE
            </span>{' '}
            club sportif qui vous correspond
          </h1>

          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Le répertoire national des clubs sportifs. Découvrez, comparez et inscrivez-vous aux clubs près de chez vous.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-3 shadow-xl">
              <div className="flex flex-col lg:flex-row gap-3">
                {/* Search Input */}
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Ville, code postal ou nom de club..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-14 text-base border-0 bg-muted/50 focus-visible:ring-primary"
                  />
                </div>

                {/* Discipline Select with Categories */}
                <Select value={selectedDiscipline} onValueChange={setSelectedDiscipline}>
                  <SelectTrigger className="h-14 w-full lg:w-56 border-0 bg-muted/50">
                    <SelectValue placeholder="Discipline" />
                  </SelectTrigger>
                  <SelectContent className="max-h-80 bg-card z-[2000]">
                    {Object.entries(categories).map(([categoryKey, categoryInfo]) => {
                      const categoryDisciplines = disciplinesByCategory[categoryKey] || [];
                      if (categoryDisciplines.length === 0) return null;
                      
                      return (
                        <SelectGroup key={categoryKey}>
                          <SelectLabel className="flex items-center gap-2 font-semibold text-foreground">
                            <div className={`w-2 h-2 rounded-full ${categoryInfo.color}`} />
                            {categoryInfo.name}
                          </SelectLabel>
                          {categoryDisciplines.slice(0, 8).map((d) => (
                            <SelectItem key={d.id} value={d.id}>
                              {d.icon} {d.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      );
                    })}
                  </SelectContent>
                </Select>

                {/* Region Select */}
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger className="h-14 w-full lg:w-48 border-0 bg-muted/50">
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
                <Button type="submit" size="lg" className="h-14 px-8 bg-primary hover:bg-primary/90 text-lg font-semibold">
                  Rechercher
                </Button>
              </div>
            </div>
          </form>

          {/* Map CTA Button */}
          <div className="mt-6 animate-fade-up" style={{ animationDelay: '0.35s' }}>
            <Link to="/carte">
              <Button variant="outline" size="lg" className="gap-2 bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white">
                <Map className="w-5 h-5" />
                Voir tous les clubs sur la carte
              </Button>
            </Link>
          </div>

          {/* Quick Links */}
          <div className="mt-6 flex flex-wrap justify-center gap-2 animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <span className="text-white/60 text-sm">Populaires :</span>
            {parentDisciplines.slice(0, 5).map((d) => (
              <button
                key={d.id}
                onClick={() => navigate(`/clubs/?discipline=${d.id}`)}
                className="px-3 py-1.5 rounded-full bg-white/10 text-white/90 text-sm hover:bg-white/20 transition-colors"
              >
                {d.icon} {d.name}
              </button>
            ))}

          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-white/50" />
        </div>
      </div>
    </section>
  );
}
