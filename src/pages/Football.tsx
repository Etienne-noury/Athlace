import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, Loader2, AlertCircle } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FootClubCard } from '@/components/foot/FootClubCard';
import { fetchFootClubsByLocation, enrichWithSupabase } from '@/lib/api/foot';

export default function Football() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQ = searchParams.get('q') ?? '';
  const [input, setInput] = useState(initialQ);
  const [query, setQuery] = useState(initialQ);

  useEffect(() => {
    setInput(initialQ);
    setQuery(initialQ);
  }, [initialQ]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['foot-clubs', query],
    queryFn: async () => {
      const raw = await fetchFootClubsByLocation(query);
      return enrichWithSupabase(raw);
    },
    enabled: query.length > 0,
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = input.trim();
    setQuery(v);
    setSearchParams(v ? { q: v } : {});
  };

  return (
    <Layout>
      <section className="bg-blue-500 text-cream-100 py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl lg:text-4xl font-bold mb-3">
            Annuaire des clubs de football en France
          </h1>
          <p className="text-surface-alt mb-6 max-w-2xl">
            Trouvez un club près de chez vous. Recherchez par ville ou code postal.
          </p>
          <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-2 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="ex: Paris, Lyon, 75015..."
                className="pl-10 h-12 text-foreground"
                maxLength={100}
              />
            </div>
            <Button type="submit" size="lg" variant="secondary">
              Rechercher
            </Button>
          </form>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        {!query && (
          <div className="text-center py-16 text-muted-foreground">
            Entrez une ville ou un code postal pour commencer.
          </div>
        )}

        {query && isLoading && (
          <div className="text-center py-16">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          </div>
        )}

        {query && isError && (
          <div className="flex items-start gap-3 bg-destructive text-destructive rounded-xl p-4 max-w-2xl mx-auto">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Service data.sports.gouv.fr indisponible</p>
              <p className="text-sm opacity-80">{(error as Error)?.message}</p>
            </div>
          </div>
        )}

        {query && data && data.length === 0 && !isLoading && (
          <div className="text-center py-16 text-muted-foreground">
            Aucun club de football trouvé pour « {query} ».
          </div>
        )}

        {data && data.length > 0 && (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              {data.length} club{data.length > 1 ? 's' : ''} trouvé{data.length > 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.map((club) => (
                <FootClubCard key={club.data_es_id} club={club} />
              ))}
            </div>
          </>
        )}
      </section>
    </Layout>
  );
}
