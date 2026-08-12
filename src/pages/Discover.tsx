import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, BookOpen, Shield, Map, Award } from 'lucide-react';

const GUIDES = [
  {
    slug: 'guide-licences-federations',
    title: 'Guide des licences fédérales',
    description: 'Comparez les fédérations sportives (FFF, FFR, FFT, etc.) et leurs tarifs de licence.',
    icon: Shield,
  },
  {
    slug: 'comment-choisir-son-club',
    title: 'Comment choisir son club ?',
    description: 'Les critères essentiels pour trouver le club qui correspond à votre niveau et à vos envies.',
    icon: Map,
  },
  {
    slug: 'fiches-sport-par-sport',
    title: 'Fiches sport par sport',
    description: 'Tout savoir sur chaque discipline : règles, équipement, clubs près de chez vous.',
    icon: BookOpen,
  },
];

export default function Discover() {
  return (
    <Layout>
      <section className="bg-muted/30 border-b border-border py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-2">
            Découvrir le sport
          </h1>
          <p className="text-muted-foreground text-lg">
            Guides pratiques, fiches fédérales et conseils pour bien choisir votre club.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GUIDES.map((guide) => (
            <Link key={guide.slug} to={`/decouvrir/${guide.slug}/`}>
              <Card className="group hover:border-primary/50 transition-colors h-full">
                <CardContent className="p-6">
                  <guide.icon className="w-10 h-10 text-primary mb-4" />
                  <h2 className="font-display text-xl font-semibold group-hover:text-primary transition-colors">
                    {guide.title}
                  </h2>
                  <p className="text-muted-foreground mt-2 text-sm">{guide.description}</p>
                  <span className="inline-flex items-center mt-4 text-sm font-medium text-primary">
                    Lire le guide <ArrowRight className="w-4 h-4 ml-1" />
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
