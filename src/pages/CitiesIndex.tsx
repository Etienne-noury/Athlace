import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { slugify } from '@/lib/geo';
import { MapPin, Loader2 } from 'lucide-react';
import { useEffect } from 'react';

interface CityAgg {
  city: string;
  region: string;
  count: number;
}

export default function CitiesIndex() {
  const { data, isLoading } = useQuery({
    queryKey: ['cities-index'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clubs_enriched_public')
        .select('city, region')
        .neq('latitude', 0)
        .order('city');
      if (error || !data) return [];
      const counts = new Map<string, CityAgg>();
      data.forEach((row) => {
        if (!row.city || !row.region) return;
        const key = `${row.city}||${row.region}`;
        const existing = counts.get(key);
        if (existing) existing.count += 1;
        else counts.set(key, { city: row.city, region: row.region, count: 1 });
      });
      return Array.from(counts.values())
        .filter((c) => c.count >= 2)
        .sort((a, b) => b.count - a.count)
        .slice(0, 120);
    },
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    document.title = 'Clubs par ville - Athlace';
  }, []);

  return (
    <Layout>
      <section className="bg-muted/30 border-b border-border py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-2">
            Index des villes
          </h1>
          <p className="text-muted-foreground text-lg">
            Découvrez les clubs sportifs par ville en France.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          {isLoading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
              Chargement des villes...
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data?.map((city) => {
              const slug = slugify(city.city);
              return (
                <Link
                  key={`${city.city}-${city.region}`}
                  to={`/clubs/${slugify(city.region)}/${slug}/`}
                  className="group p-4 bg-card rounded-xl border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <h2 className="font-display font-semibold text-base group-hover:text-primary transition-colors">
                        {city.city}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {city.region} — {city.count} club{city.count > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
}
