import { Link, useParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { PageTitle } from '@/components/PageTitle';
import { getJournalArticle } from '@/data/journal';
import { JournalGuide } from '@/components/journal/JournalGuide';
import { FurtherReading } from '@/components/journal/FurtherReading';

export default function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const post = getJournalArticle(id);
  if (post?.guide) return <JournalGuide slug={post.id} />;

  return (
    <Layout>
      <PageTitle title={post?.title ?? 'Article'} />
      <section className="bg-muted border-b border-border py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <Button variant="ghost" className="mb-4 -ml-3" asChild>
            <Link to="/blog/"><ArrowLeft className="w-4 h-4 mr-2" /> Retour au journal</Link>
          </Button>
          <h1 className="font-sans text-3xl lg:text-4xl font-black text-foreground">
            {post?.title || 'Article'}
          </h1>
          {post?.date && <p className="text-muted-foreground mt-2">{post.date}</p>}
        </div>
      </section>
      <section className="container mx-auto px-4 py-12 max-w-3xl">
        <p className="text-muted-foreground leading-relaxed">
          {post?.content || 'Cet article sera bientôt disponible.'}
        </p>
        {post && <FurtherReading link={post.further} />}
      </section>
    </Layout>
  );
}
