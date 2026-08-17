import { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { FEDERATION_CATEGORIES, fetchFederationsByCategorie } from '@/lib/federations-officielles';
import { useSiteStats } from '@/hooks/useSiteStats';

export default function DiscoverArticle() {
  const { slug } = useParams<{ slug: string }>();
  const { stats } = useSiteStats();

  const title = useMemo(() => {
    if (slug === 'guide-licences-federations') return 'Guide des licences fédérales';
    if (slug === 'comment-choisir-son-club') return 'Comment choisir son club ?';
    if (slug === 'fiches-sport-par-sport') return 'Fiches sport par sport';
    return 'Guide';
  }, [slug]);

  useEffect(() => {
    document.title = `${title} - Athlace`;
  }, [title]);

  const { data, isLoading } = useQuery({
    queryKey: ['federations-by-categorie'],
    queryFn: fetchFederationsByCategorie,
    enabled: slug === 'guide-licences-federations',
  });

  if (slug === 'guide-licences-federations') {
    const total = Object.values(data ?? {}).reduce((acc, list) => acc + list.length, 0);
    const updatedAt = new Date().toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

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
              {total || stats.federations} fédérations sportives agréées par le Ministère des Sports.
            </p>
            <p className="text-sm text-muted-foreground mt-1">Mise à jour : {updatedAt}</p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-14 rounded-lg" />
              ))}
            </div>
          ) : (
            <Accordion type="multiple" className="space-y-3">
              {FEDERATION_CATEGORIES.map((categorie) => {
                const feds = data?.[categorie] ?? [];
                if (feds.length === 0) return null;
                return (
                  <AccordionItem
                    key={categorie}
                    value={categorie}
                    className="border border-border rounded-xl px-4 bg-card"
                  >
                    <AccordionTrigger className="hover:no-underline">
                      <span className="flex items-center gap-3 text-left">
                        <span className="font-display font-semibold text-lg">{categorie}</span>
                        <Badge variant="secondary">{feds.length}</Badge>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-2">
                        {feds.map((fed) => (
                          <Card key={fed.id} className="hover:border-primary/50 transition-colors">
                            <CardContent className="p-5">
                              <div className="flex items-start justify-between gap-3">
                                <h2 className="font-display text-base font-semibold">{fed.nom}</h2>
                                {fed.sigle && <Badge variant="outline">{fed.sigle}</Badge>}
                              </div>
                              <Button variant="outline" size="sm" className="mt-4" asChild>
                                <a href={fed.site_web} target="_blank" rel="noopener noreferrer">
                                  Accéder au site fédéral <ExternalLink className="w-3 h-3 ml-2" />
                                </a>
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
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
