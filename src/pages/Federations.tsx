import { ExternalLink, Database, Globe, Code2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { federations, type Federation } from '@/data/federations';

const typeMeta: Record<Federation['type'], { label: string; icon: typeof Code2; className: string }> = {
  api: { label: 'API publique', icon: Code2, className: 'bg-primary/10 text-primary border-primary/20' },
  opendata: { label: 'Open Data', icon: Database, className: 'bg-accent/10 text-accent border-accent/20' },
  annuaire: { label: 'Annuaire en ligne', icon: Globe, className: 'bg-muted text-muted-foreground border-border' },
};

export default function Federations() {
  return (
    <Layout>
      <section className="bg-hero-gradient text-white py-16 lg:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl lg:text-5xl font-bold mb-4">
            Annuaire des fédérations
          </h1>
          <p className="text-lg lg:text-xl text-white/90 max-w-2xl mx-auto">
            Les fédérations sportives françaises qui exposent leurs clubs en open data ou via un annuaire public.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {federations.map((fed) => {
            const meta = typeMeta[fed.type];
            const Icon = meta.icon;
            return (
              <Card key={fed.code} className="p-6 hover:shadow-lg transition-shadow flex flex-col">
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-4xl">{fed.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display font-bold text-lg text-foreground">{fed.code}</div>
                    <div className="text-sm text-muted-foreground">{fed.sport}</div>
                  </div>
                </div>
                <p className="text-sm text-foreground/80 mb-4 flex-1">{fed.name}</p>
                <Badge variant="outline" className={`${meta.className} w-fit mb-4 gap-1`}>
                  <Icon className="w-3 h-3" />
                  {meta.label}
                </Badge>
                <a
                  href={fed.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
                >
                  Accéder à l'annuaire
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 p-6 rounded-xl bg-muted/50 border border-border">
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
