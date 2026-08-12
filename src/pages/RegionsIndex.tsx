import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { REGIONS } from '@/lib/geo';

export default function RegionsIndex() {
  return (
    <Layout>
      <section className="bg-muted/30 border-b border-border py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-2">
            Index des régions
          </h1>
          <p className="text-muted-foreground text-lg">
            Trouvez un club sportif dans l'une des 13 régions de France métropolitaine et de Corse.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {REGIONS.map((region) => (
              <Link
                key={region.slug}
                to={`/clubs/${region.slug}/`}
                className="group p-6 bg-card rounded-xl border border-border hover:border-primary/50 transition-colors"
              >
                <h2 className="font-display font-semibold text-lg group-hover:text-primary transition-colors">
                  {region.name}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Clubs en {region.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
