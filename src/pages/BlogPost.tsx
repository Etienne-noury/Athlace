import { Link, useParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const POSTS: Record<string, { title: string; date: string; content: string }> = {
  'choisir-club-sport': {
    title: 'Comment choisir son club de sport ?',
    date: '12 juin 2026',
    content: "Choisir un club de sport dépend de nombreux critères : la localisation, le niveau proposé, les horaires, les tarifs et l'ambiance. Commencez par définir vos objectifs, puis comparez plusieurs clubs avant de vous inscrire. Athlace vous permet de filtrer par ville et par discipline pour affiner votre recherche."
  },
  'licences-federations-2026': {
    title: 'Licences fédérales 2026 : ce qui change',
    date: '5 juin 2026',
    content: "Chaque année, les fédérations sportives ajustent leurs tarifs de licence et leurs offres. En 2026, plusieurs fédérations simplifient leurs démarches en ligne et proposent des licences familiales. Consultez notre guide des fédérations pour comparer les coûts et les avantages."
  },
  'sport-en-entreprise': {
    title: 'Le sport en entreprise : bienfaits et mise en place',
    date: '28 mai 2026',
    content: "La pratique sportive en entreprise améliore la santé, la cohésion d'équipe et la productivité. Découvrez comment mettre en place des activités adaptées à votre structure et trouver des clubs partenaires près de votre bureau."
  }
};

export default function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const post = id ? POSTS[id] : null;

  return (
    <Layout>
      <section className="bg-muted/30 border-b border-border py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <Button variant="ghost" className="mb-4 -ml-3" asChild>
            <Link to="/blog/"><ArrowLeft className="w-4 h-4 mr-2" /> Retour au blog</Link>
          </Button>
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground">
            {post?.title || 'Article'}
          </h1>
          {post && <p className="text-muted-foreground mt-2">{post.date}</p>}
        </div>
      </section>
      <section className="container mx-auto px-4 py-12 max-w-3xl">
        <p className="text-muted-foreground leading-relaxed">
          {post?.content || 'Cet article sera bientôt disponible.'}
        </p>
      </section>
    </Layout>
  );
}
