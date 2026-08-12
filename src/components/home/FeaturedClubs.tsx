import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Star, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchEnrichedClubs } from '@/lib/api/enriched-clubs';
import { getDisciplineById } from '@/data/disciplines';

export function FeaturedClubs() {
  const { data: featuredClubs = [], isLoading } = useQuery({
    queryKey: ['clubs', 'featured'],
    queryFn: () => fetchEnrichedClubs({ withCoordsOnly: true, limit: 4 }),
  });


  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-2">
              Clubs recommandés
            </h2>
            <p className="text-muted-foreground text-lg">
              Les clubs les mieux notés par notre communauté
            </p>
          </div>
          <Link to="/recherche">
            <Button variant="outline" className="gap-2">
              Voir tous les clubs
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredClubs.map((club, index) => (
            <Link
              key={club.id}
              to={`/club/${club.id}`}
              className="group animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="bg-card rounded-2xl border border-border/50 overflow-hidden card-hover h-full flex flex-col">
                {/* Image placeholder */}
                <div className="aspect-[4/3] bg-gradient-to-br from-primary/20 to-accent/20 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-5xl opacity-50">
                      {getDisciplineById(club.discipline)?.icon || '🏆'}
                    </span>
                  </div>

                  {/* Rating */}
                  {club.rating > 0 && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                      <Star className="w-4 h-4 fill-warning text-warning" />
                      <span className="text-sm font-semibold">{club.rating}</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex-1">
                    <p className="text-sm text-primary font-medium mb-1">
                      {club.disciplineName}
                    </p>
                    <h3 className="font-display font-semibold text-lg text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {club.name}
                    </h3>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm">
                      <MapPin className="w-4 h-4" />
                      <span>{club.city}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          {isLoading &&
            featuredClubs.length === 0 &&
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/5] rounded-2xl" />
            ))}
        </div>
      </div>
    </section>
  );
}
