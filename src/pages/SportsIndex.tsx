import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Layout } from '@/components/layout/Layout';
import { PageTitle } from '@/components/PageTitle';
import {
  FEDERATION_CATEGORIES,
  fetchFederationsByCategorie,
  slugifyFederation,
} from '@/lib/federations-officielles';
import { ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function SportsIndex() {
  const { data, isLoading } = useQuery({
    queryKey: ['federations-by-categorie'],
    queryFn: fetchFederationsByCategorie,
  });

  return (
    <Layout>
      <PageTitle
        title="Tous les sports"
        description={`Découvrez les ${stats.federations} fédérations sportives françaises agréées, classées par catégorie, sur Athlace.`}
      />
      <section className="bg-muted/30 border-b border-border py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-2">
            Tous les sports
          </h1>
          <p className="text-muted-foreground text-lg">
            Les fédérations sportives françaises agréées par le Ministère des Sports, classées par catégorie.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {FEDERATION_CATEGORIES.map((categorie) => {
              const feds = data?.[categorie] ?? [];
              if (feds.length === 0) return null;
              return (
                <div
                  key={categorie}
                  className="p-6 bg-card rounded-2xl border border-border hover:border-primary/50 transition-colors"
                >
                  <h2 className="font-display text-2xl font-semibold mb-4">{categorie}</h2>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {feds.map((fed) => (
                      <Link
                        key={fed.id}
                        to={`/sports/${slugifyFederation(fed.sigle || fed.nom)}/`}
                        className="px-3 py-1 bg-muted rounded-full text-sm hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        {fed.nom}
                      </Link>
                    ))}
                  </div>
                  <Link
                    to={`/sports/famille/${slugifyFederation(categorie)}/`}
                    className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                  >
                    Voir la catégorie {categorie} <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </Layout>
  );
}
