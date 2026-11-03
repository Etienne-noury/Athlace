import { Link } from 'react-router-dom';
import { useState } from 'react';
import { PageTitle } from '@/components/PageTitle';
import { Button } from '@/components/ui/button';
import { JOURNAL_CATEGORIES, filterJournalArticles } from '@/data/journal';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Calendar } from 'lucide-react';

export default function Blog() {
  const [category, setCategory] = useState<typeof JOURNAL_CATEGORIES[number]>('Tous');
  const posts = filterJournalArticles(category);
  return (
    <Layout>
      <PageTitle title="Le journal d'Athlace" description="Actualités, guides et conseils autour de la pratique sportive en club." />
      <section className="bg-muted border-b border-border py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-sans text-3xl lg:text-4xl font-black text-foreground mb-2">
            Le journal d'Athlace
          </h1>
          <p className="text-muted-foreground text-lg">
            Actualités, guides et conseils autour de la pratique sportive en club.
          </p>
          <div className="flex flex-wrap gap-2 mt-6" aria-label="Rubriques du journal">
            {JOURNAL_CATEGORIES.map((rubrique) => <Button key={rubrique} size="sm" variant={category === rubrique ? 'default' : 'outline'} aria-pressed={category === rubrique} onClick={() => setCategory(rubrique)}>{rubrique}</Button>)}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link key={post.id} to={`/blog/${post.id}/`}>
              <Card className="group hover:border-border transition-colors h-full">
                <CardContent className="p-6">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-3">
                    <span>{post.category}</span>
                    {post.date && <><Calendar className="w-3 h-3" /> {post.date}</>}
                  </div>
                  <h2 className="font-sans text-xl font-black group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground mt-2 text-sm">{post.excerpt}</p>
                  <span className="inline-flex items-center mt-4 text-sm font-bold text-primary">
                    Lire l'article <ArrowRight className="w-4 h-4 ml-1" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        {posts.length === 0 && <p role="status" className="py-12 text-center text-muted-foreground">Bientôt de nouveaux articles</p>}
      </section>
    </Layout>
  );
}
