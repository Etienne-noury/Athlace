import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { disciplines, categories, getParentDisciplines } from '@/data/disciplines';
import { cn } from '@/lib/utils';

export default function Disciplines() {
  const [searchQuery, setSearchQuery] = useState('');

  // Get only parent disciplines (main categories)
  const parentDisciplines = getParentDisciplines();

  // Get disciplines organized by category
  const getDisciplinesByCategory = () => {
    const result: Record<string, typeof parentDisciplines> = {};
    
    Object.keys(categories).forEach(cat => {
      result[cat] = parentDisciplines.filter(d => d.category === cat);
    });
    
    return result;
  };

  const disciplinesByCategory = getDisciplinesByCategory();

  // Filter by search
  const filterBySearch = (disciplineList: typeof parentDisciplines) => {
    if (!searchQuery) return disciplineList;
    const query = searchQuery.toLowerCase();
    return disciplineList.filter(d => d.name.toLowerCase().includes(query));
  };

  // Count total parent disciplines
  const getTotalCount = () => {
    let count = 0;
    Object.values(disciplinesByCategory).forEach(list => {
      count += filterBySearch(list).length;
    });
    return count;
  };

  return (
    <Layout>
      {/* Header */}
      <section className="bg-sport-gradient text-white py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl lg:text-5xl font-bold mb-4">
            Disciplines sportives
          </h1>
          <p className="text-white/80 text-lg max-w-2xl">
            Explorez les grandes familles de sports pratiquées en France.
            Cliquez sur une discipline pour voir les clubs et ses variantes.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Search */}
        <div className="max-w-md mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Rechercher une discipline..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
        </div>

        {/* Results count */}
        <p className="text-muted-foreground mb-8">
          {getTotalCount()} discipline{getTotalCount() > 1 ? 's' : ''} principale{getTotalCount() > 1 ? 's' : ''}
        </p>

        {/* Categories with disciplines */}
        <div className="space-y-10">
          {Object.entries(categories).map(([categoryKey, categoryInfo]) => {
            const categoryDisciplines = filterBySearch(disciplinesByCategory[categoryKey] || []);
            
            if (categoryDisciplines.length === 0) return null;

            return (
              <div key={categoryKey}>
                {/* Category header */}
                <div className="flex items-center gap-3 mb-5">
                  <div className={cn(
                    "w-3 h-3 rounded-full",
                    categoryInfo.color
                  )} />
                  <h2 className="font-display text-xl lg:text-2xl font-bold text-foreground">
                    {categoryInfo.name}
                  </h2>
                  <Badge variant="secondary">
                    {categoryDisciplines.length}
                  </Badge>
                </div>

                {/* Disciplines grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {categoryDisciplines.map((discipline, index) => (
                    <Link
                      key={discipline.id}
                      to={`/recherche?discipline=${discipline.id}`}
                      className="group animate-fade-up"
                      style={{ animationDelay: `${index * 0.02}s` }}
                    >
                      <div className="bg-card rounded-xl p-4 border border-border/50 card-hover h-full flex flex-col items-center text-center">
                        <span className="text-4xl mb-3">{discipline.icon}</span>
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors text-sm leading-tight mb-2">
                          {discipline.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-auto">
                          {discipline.description}
                        </p>
                        <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity mt-2" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
