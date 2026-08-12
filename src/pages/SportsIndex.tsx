import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { SPORT_FAMILIES, getSportsByFamily } from '@/lib/sports-menu';
import { ArrowRight } from 'lucide-react';

export default function SportsIndex() {
  useEffect(() => {
    document.title = 'Tous les sports - Athlace';
  }, []);

  return (
    <Layout>
      <PageTitle title="Tous les sports" description="Découvrez les familles sportives et disciplines pratiquées en France sur Athlace." />
      <section className="bg-muted/30 border-b border-border py-8 lg:py-12">

        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-2">
            Tous les sports
          </h1>
          <p className="text-muted-foreground text-lg">
            Découvrez les disciplines référencées sur Athlace par famille et trouvez un club près de chez vous.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SPORT_FAMILIES.map((family) => {
            const sports = getSportsByFamily(family.id);
            return (
              <div
                key={family.id}
                className="p-6 bg-card rounded-2xl border border-border hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl" aria-hidden="true">{family.icon}</span>
                  <h2 className="font-display text-2xl font-semibold">{family.name}</h2>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {sports.slice(0, 8).map((sport) => (
                    <Link
                      key={sport.id}
                      to={`/sports/${sport.id}/`}
                      className="px-3 py-1 bg-muted rounded-full text-sm hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      {sport.name}
                    </Link>
                  ))}
                </div>
                <Link
                  to={`/sports/famille/${family.id}/`}
                  className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                >
                  Voir la famille {family.name} <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>
    </Layout>
  );
}
