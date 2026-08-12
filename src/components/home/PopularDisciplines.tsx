import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getPopularDisciplines, categories } from '@/data/disciplines';
import { cn } from '@/lib/utils';

export function PopularDisciplines() {
  const disciplines = getPopularDisciplines(8);

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-2">
              Disciplines populaires
            </h2>
            <p className="text-muted-foreground text-lg">
              Explorez les sports les plus pratiqués en France
            </p>
          </div>
          <Link to="/sports/">
            <Button variant="outline" className="gap-2">
              Voir toutes les disciplines
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>

        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {disciplines.map((discipline, index) => (
            <Link
              key={discipline.id}
              to={`/sports/${discipline.id}/`}
              className="group"
              style={{ animationDelay: `${index * 0.05}s` }}
            >

              <div className="relative bg-card rounded-2xl p-6 border border-border/50 card-hover overflow-hidden">
                {/* Background gradient */}
                <div className={cn(
                  "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300",
                  categories[discipline.category]?.color || 'bg-primary'
                )} />
                
                {/* Content */}
                <div className="relative">
                  <span className="text-4xl lg:text-5xl mb-4 block">
                    {discipline.icon}
                  </span>
                  <h3 className="font-display font-semibold text-lg text-foreground mb-1">
                    {discipline.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {discipline.clubCount.toLocaleString()} clubs
                  </p>
                </div>

                {/* Arrow */}
                <div className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                  <ArrowRight className="w-4 h-4 text-primary" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
