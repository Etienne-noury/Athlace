import { Layout } from '@/components/layout/Layout';

export default function Partners() {
  return (
    <Layout>
      <section className="bg-muted/30 border-b border-border py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl font-bold text-foreground">Nos partenaires</h1>
          <p className="text-muted-foreground mt-2">Ils nous font confiance pour faire découvrir le sport en club.</p>
        </div>
      </section>
      <section className="container mx-auto px-4 py-12 max-w-3xl">
        <p className="text-muted-foreground mb-6">
          Athlace collabore avec des fédérations sportives, des collectivités locales et des acteurs du sport pour enrichir continuellement son répertoire et proposer la meilleure expérience aux pratiquants.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {['Fédérations françaises', 'Collectivités locales', 'Marques sportives', 'Associations'].map((p) => (
            <div key={p} className="bg-card border border-border rounded-xl p-6 flex items-center justify-center font-semibold">
              {p}
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
