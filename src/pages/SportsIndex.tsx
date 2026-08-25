import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { PageTitle } from '@/components/PageTitle';
import { ARBORESCENCE, slugifyDiscipline } from '@/data/disciplines';
import { ArrowRight } from 'lucide-react';

export default function SportsIndex() {
  const totalSports = ARBORESCENCE.reduce((acc, c) => acc + c.sports.length, 0);
  const totalSubs = ARBORESCENCE.reduce(
    (acc, c) => acc + c.sports.reduce((s, sport) => s + sport.subs.length, 0),
    0,
  );

  return (
    <Layout>
      <PageTitle
        title="Tous les sports"
        description={`Explorez ${totalSports} sports et ${totalSubs} sous-disciplines classés par catégorie sur Athlace.`}
      />
      <section className="bg-muted/30 border-b border-border py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-2">
            Tous les sports
          </h1>
          <p className="text-muted-foreground text-lg">
            {totalSports} sports et {totalSubs} sous-disciplines, classés par catégorie.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {ARBORESCENCE.map((categorie) => (
            <div
              key={categorie.id}
              className="p-6 bg-card rounded-2xl border border-border hover:border-primary/50 transition-colors"
            >
              <h2 className="font-display text-2xl font-semibold mb-4">
                {categorie.icon} {categorie.name}
              </h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {categorie.sports.map((sport) => (
                  <Link
                    key={sport.name}
                    to={`/sports/${slugifyDiscipline(sport.name)}/`}
                    className="px-3 py-1 bg-muted rounded-full text-sm hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    {sport.name}
                  </Link>
                ))}
              </div>
              <Link
                to={`/sports/famille/${categorie.id}/`}
                className="inline-flex items-center text-sm font-medium text-primary hover:underline"
              >
                Voir la catégorie {categorie.name} <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
