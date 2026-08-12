import { Layout } from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Recruitment() {
  return (
    <Layout>
      <section className="bg-muted/30 border-b border-border py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl font-bold text-foreground">Recrutement</h1>
          <p className="text-muted-foreground mt-2">Rejoignez l'aventure Athlace.</p>
        </div>
      </section>
      <section className="container mx-auto px-4 py-12 max-w-3xl">
        <p className="text-muted-foreground mb-6">
          Nous recherchons des profils passionnés par le sport, la tech et l'impact social. Découvrez nos offres ci-dessous ou envoyez-nous une candidature spontanée.
        </p>
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-display text-xl font-semibold">Développeur full-stack</h2>
            <p className="text-sm text-muted-foreground mt-1">Paris · CDI · Développement</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-display text-xl font-semibold">Chargé de partenariats clubs</h2>
            <p className="text-sm text-muted-foreground mt-1">Paris / Lyon · CDI · Commercial</p>
          </div>
        </div>
        <Button className="mt-8" asChild>
          <a href="mailto:recrutement@athlace.fr">Candidature spontanée</a>
        </Button>
      </section>
    </Layout>
  );
}
