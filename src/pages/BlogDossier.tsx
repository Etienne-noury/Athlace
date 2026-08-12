import { Link, useParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const DOSSIERS: Record<string, { title: string; content: string }> = {
  'decouvrir': {
    title: 'Dossier : Découvrir un sport',
    content: 'En France, il existe des milliers de disciplines sportives. De la pratique loisir à la compétition, chaque sport a ses spécificités, son équipement et ses fédérations. Ce dossier vous aide à y voir plus clair.'
  },
  'choisir-club': {
    title: 'Dossier : Choisir son club',
    content: 'Le choix d'un club ne doit rien laisser au hasard. Localisation, tarifs, niveau, encadrement, infrastructures : prenez le temps de comparer et de visiter avant de vous décider.'
  }
};

export default function BlogDossier() {
  const { id } = useParams<{ id: string }>();
  const dossier = id ? DOSSIERS[id] : null;

  return (
    <Layout>
      <section className="bg-muted/30 border-b border-border py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <Button variant="ghost" className="mb-4 -ml-3" asChild>
            <Link to="/blog/"><ArrowLeft className="w-4 h-4 mr-2" /> Retour au blog</Link>
          </Button>
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground">
            {dossier?.title || 'Dossier'}
          </h1>
        </div>
      </section>
      <section className="container mx-auto px-4 py-12 max-w-3xl">
        <p className="text-muted-foreground leading-relaxed">
          {dossier?.content || 'Ce dossier sera bientôt disponible.'}
        </p>
      </section>
    </Layout>
  );
}
