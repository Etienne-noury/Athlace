import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight } from 'lucide-react';
import { ClubCardVisual, ClubCardBody } from '@/components/clubs/ClubCardContent';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchEnrichedClubs } from '@/lib/api/enriched-clubs';

export function FeaturedClubs() {
  const { data: result = { clubs: [], total: 0 }, isLoading } = useQuery({
    queryKey: ['clubs', 'featured'],
    queryFn: () => fetchEnrichedClubs({ limit: 4 }),
  });

  const featuredClubs = result.clubs;



  return (
    <section className="py-16 lg:py-24 bg-muted">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-2">
              Clubs recommandés
            </h2>
            <p className="text-muted-foreground text-lg">
              Une sélection de clubs référencés sur Athlace
            </p>
          </div>
          <Link to="/clubs/">
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
              <div className="bg-card rounded-2xl border border-border overflow-hidden card-hover h-full flex flex-col">
                <ClubCardVisual club={club} className="aspect-[4/3]" />
                <div className="p-5 flex-1 flex flex-col">
                  <ClubCardBody club={club} />
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
