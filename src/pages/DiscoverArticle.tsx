import { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { federations } from '@/data/federations';

export default function DiscoverArticle() {
  const { slug } = useParams<{ slug: string }>();

  const title = useMemo(() => {
    if (slug === 'guide-licences-federations') return 'Guide des licences fédérales';
    if (slug === 'comment-choisir-son-club') return 'Comment choisir son club ?';
    if (slug === 'fiches-sport-par-sport') return 'Fiches sport par sport';
    return 'Guide';
  }, [slug]);

  useEffect(() => {
    document.title = `${title} - Athlace`;
  }, [title]);

  if (slug === 'guide-licences-federations') {
    return (
      <Layout>
        <section className="bg-muted/30 border-b border-border py-8 lg:py-12">
          <div className="container mx-auto px-4">
            <Button variant="ghost" className="mb-4 -ml-3" asChild>
              <Link to="/decouvrir/"><ArrowLeft className="w-4 h-4 mr-2" /> Retour aux guides</Link>
            </Button>
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-2">
              Guide des licences fédérales
            </h1>
            <p className="text-muted-foreground text-lg">
              Comparez les principales fédérations françaises et accédez à leur annuaire officiel.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {federations.map((fed) => (
              <Card key={fed.code} className="hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-display text-xl font-semibold">{fed.name}</h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        Annuaire officiel des clubs de {fed.sport}.
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-muted rounded-full text-xs font-medium text-muted-foreground">
                      {fed.code}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <a href={fed.url} target="_blank" rel="noopener noreferrer">
                        Site fédéral <ExternalLink className="w-3 h-3 ml-2" />
                      </a>
                    </Button>
                    <Button variant="secondary" size="sm" asChild>
                      <Link to={`/sports/?q=${encodeURIComponent(fed.sport)}`}>Voir les clubs</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="bg-muted/30 border-b border-border py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <Button variant="ghost" className="mb-4 -ml-3" asChild>
            <Link to="/decouvrir/"><ArrowLeft className="w-4 h-4 mr-2" /> Retour aux guides</Link>
          </Button>
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-2">{title}</h1>
          <p className="text-muted-foreground text-lg">Ce guide sera bientôt disponible.</p>
        </div>
      </section>
    </Layout>
  );
}
