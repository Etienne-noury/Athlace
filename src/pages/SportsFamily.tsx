import { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  FEDERATION_CATEGORIES,
  fetchFederationsByCategorie,
  slugifyFederation,
} from '@/lib/federations-officielles';
import { ExternalLink } from 'lucide-react';

export default function SportsFamily() {
  const { familyId } = useParams<{ familyId: string }>();
  const { data, isLoading } = useQuery({
    queryKey: ['federations-by-categorie'],
    queryFn: fetchFederationsByCategorie,
  });

  const categorie = useMemo(
    () => FEDERATION_CATEGORIES.find((c) => slugifyFederation(c) === familyId),
    [familyId],
  );
  const federations = categorie ? data?.[categorie] ?? [] : [];

  useEffect(() => {
    if (categorie) document.title = `${categorie} - Athlace`;
  }, [categorie]);

  if (!categorie) {
    return (
      <Layout>
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-display text-3xl font-bold">Catégorie introuvable</h1>
            <p className="text-muted-foreground mt-4">Cette catégorie de sports n'existe pas.</p>
            <Link to="/sports/" className="text-primary hover:underline mt-4 inline-block">
              Retour aux sports
            </Link>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="bg-muted/30 border-b border-border py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link to="/" className="hover:text-primary">Accueil</Link>
            <span>/</span>
            <Link to="/sports/" className="hover:text-primary">Sports</Link>
            <span>/</span>
            <span className="text-foreground">{categorie}</span>
          </div>
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-3">
            {categorie}
          </h1>
          <p className="text-muted-foreground text-lg">
            {federations.length} fédération{federations.length > 1 ? 's' : ''} agréée{federations.length > 1 ? 's' : ''} dans cette catégorie.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {federations.map((fed) => (
              <Card key={fed.id} className="hover:border-primary/50 transition-colors">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-display font-semibold text-lg">{fed.nom}</h2>
                    {fed.sigle && <Badge variant="secondary">{fed.sigle}</Badge>}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <a href={fed.site_web} target="_blank" rel="noopener noreferrer">
                        Site fédéral <ExternalLink className="w-3 h-3 ml-2" />
                      </a>
                    </Button>
                    <Button variant="secondary" size="sm" asChild>
                      <Link to={`/clubs/?q=${encodeURIComponent(fed.nom)}`}>Voir les clubs</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}
