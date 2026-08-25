import { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ARBORESCENCE, slugifyDiscipline } from '@/data/disciplines';

export default function SportsFamily() {
  const { familyId } = useParams<{ familyId: string }>();

  const categorie = useMemo(
    () =>
      ARBORESCENCE.find(
        (c) => c.id === familyId || slugifyDiscipline(c.name) === familyId,
      ),
    [familyId],
  );

  useEffect(() => {
    if (categorie) document.title = `${categorie.name} - Athlace`;
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
            <span className="text-foreground">{categorie.name}</span>
          </div>
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-3">
            {categorie.icon} {categorie.name}
          </h1>
          <p className="text-muted-foreground text-lg">
            {categorie.sports.length} sport{categorie.sports.length > 1 ? 's' : ''} et leurs sous-disciplines.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categorie.sports.map((sport) => {
            const sportId = slugifyDiscipline(sport.name);
            return (
              <Card key={sport.name} className="hover:border-primary/50 transition-colors">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-display font-semibold text-lg">
                      {sport.icon} {sport.name}
                    </h2>
                    <Badge variant="secondary">{sport.subs.length}</Badge>
                  </div>
                  <ul className="mt-3 space-y-1 flex-1">
                    {sport.subs.map((sub) => (
                      <li key={sub}>
                        <Link
                          to={`/sports/${sportId}--${slugifyDiscipline(sub)}/`}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          {sub}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/sports/${sportId}/`}>Fiche sport</Link>
                    </Button>
                    <Button variant="secondary" size="sm" asChild>
                      <Link to={`/clubs/?discipline=${sportId}`}>Voir les clubs</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </Layout>
  );
}
