import { ExternalLink, Database, Globe, Code2, Loader2 } from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { groupFederationsByArborescence } from '@/lib/federations-officielles';
import { Layout } from '@/components/layout/Layout';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { fetchFederationSources, type Federation } from '@/data/federations';

const typeMeta: Record<Federation['type'], { label: string; icon: typeof Code2; className: string }> = {
  api: { label: 'API publique', icon: Code2, className: 'bg-tint-100 text-primary border-border' },
  opendata: { label: 'Open Data', icon: Database, className: 'bg-tint-100 text-blue-500 border-border' },
  annuaire: { label: 'Annuaire en ligne', icon: Globe, className: 'bg-muted text-muted-foreground border-border' },
};

export default function Federations() {
  const { data: federations = [], isLoading } = useQuery({
    queryKey: ['federations'],
    queryFn: fetchFederationSources,
  });
  const groups = useMemo(
    () => groupFederationsByArborescence(federations, (f) => f.code),
    [federations],
  );

  return (
    <Layout>
      <section className="bg-blue-500 text-cream-100 py-16 lg:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl lg:text-5xl font-bold mb-4">
            Annuaire des fédérations
          </h1>
          <p className="text-lg lg:text-xl text-surface-alt max-w-2xl mx-auto">
            Les fédérations sportives françaises qui exposent leurs clubs en open data ou via un annuaire public.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 lg:py-16">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-12">
            {groups.map((cat) => (
              <div key={cat.id}>
                <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                  {cat.icon} {cat.name}
                </h2>
                <div className="space-y-8">
                  {cat.sports.map((sport) => (
                    <div key={sport.sportName}>
                      <h3 className="font-display font-semibold text-lg text-foreground mb-4">
                        {sport.sportIcon} {sport.sportName}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sport.federations.map((fed) => {
              const meta = typeMeta[fed.type];
              const Icon = meta.icon;
              return (
                <Card key={fed.id} className="p-6 hover:shadow-lg transition-shadow flex flex-col">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-4xl">{fed.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-display font-bold text-lg text-foreground">{fed.code}</div>
                      <div className="text-sm text-muted-foreground">{fed.sport}</div>
                    </div>
                  </div>
                  <p className="text-sm text-foreground mb-4 flex-1">{fed.name}</p>
                  <Badge variant="outline" className={`${meta.className} w-fit mb-4 gap-1`}>
                    <Icon className="w-3 h-3" />
                    {meta.label}
                  </Badge>
                  <a
                    href={fed.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-pill bg-primary text-primary-foreground font-medium hover:bg-blue-700 transition-colors"
                  >
                    Accéder à l'annuaire
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  {fed.sportSlug && (
                    <Link
                      to={`/sports/${fed.sportSlug}/`}
                      className="mt-2 inline-flex items-center justify-center px-4 py-2 rounded-pill bg-surface-alt text-blue-500 font-medium hover:bg-tint-100 transition-colors"
                    >
                      Voir le sport {fed.sport}
                    </Link>
                  )}
                </Card>
              );
            })}
                                </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 p-6 rounded-xl bg-muted border border-border">
          <h2 className="font-display font-semibold text-lg mb-2">À propos de ces sources</h2>
          <p className="text-sm text-muted-foreground">
            Athlace s'appuie principalement sur les données ouvertes de <strong>data.sports.gouv.fr</strong> (Ministère des Sports).
            Cet annuaire complémentaire pointe vers les sources officielles de chaque fédération pour des informations détaillées
            (licences, compétitions, calendriers).
          </p>
        </div>
      </section>
    </Layout>
  );
}
