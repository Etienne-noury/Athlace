import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Calendar } from 'lucide-react';

const POSTS = [
  {
    id: 'choisir-club-sport',
    title: 'Comment choisir son club de sport ?',
    excerpt: 'Localisation, niveau, tarifs, ambiance : les critères à prendre en compte pour trouver le club idéal.',
    date: '12 juin 2026',
  },
  {
    id: 'licences-federations-2026',
    title: 'Licences fédérales 2026 : ce qui change',
    excerpt: "Tour d'horizon des évolutions tarifaires et des nouveautés dans les principales fédérations.",
    date: '5 juin 2026',
  },
  {
    id: 'sport-en-entreprise',
    title: 'Le sport en entreprise : bienfaits et mise en place',
    excerpt: 'Pourquoi et comment accompagner les salariés vers une pratique sportive régulière.',
    date: '28 mai 2026',
  },
];

export default function Blog() {
  return (
    <Layout>
      <section className="bg-muted/30 border-b border-border py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-2">
            Blog Athlace
          </h1>
          <p className="text-muted-foreground text-lg">
            Actualités, guides et conseils autour de la pratique sportive en club.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {POSTS.map((post) => (
            <Link key={post.id} to={`/blog/${post.id}/`}>
              <Card className="group hover:border-primary/50 transition-colors h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <Calendar className="w-3 h-3" /> {post.date}
                  </div>
                  <h2 className="font-display text-xl font-semibold group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground mt-2 text-sm">{post.excerpt}</p>
                  <span className="inline-flex items-center mt-4 text-sm font-medium text-primary">
                    Lire l'article <ArrowRight className="w-4 h-4 ml-1" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </Layout>
  );
}
