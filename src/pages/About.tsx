import { Layout } from '@/components/layout/Layout';

export default function About() {
  return (
    <Layout>
      <section className="bg-muted/30 border-b border-border py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl font-bold text-foreground">Qui sommes-nous ?</h1>
        </div>
      </section>
      <section className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="prose prose-slate max-w-none">
          <p>
            Athlace est le répertoire national des clubs sportifs en France. Notre mission est de faciliter la rencontre entre pratiquants et clubs en centralisant les informations essentielles : disciplines, localisation, tarifs et contacts.
          </p>
          <p>
            Nous croyons que le sport doit être accessible à tous. C'est pourquoi nous mettons à disposition un service gratuit et complet pour les pratiquants, tout en proposant aux clubs des outils de visibilité modernes et efficaces.
          </p>
          <p>
            Lancée en 2026, Athlace rassemble déjà des milliers de clubs répartis sur l'ensemble du territoire, couvrant des disciplines aussi variées que le football, le tennis, le rugby, la natation, le vol libre et le badminton.
          </p>
        </div>
      </section>
    </Layout>
  );
}
