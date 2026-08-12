import { Layout } from '@/components/layout/Layout';
import { Gift } from 'lucide-react';

export default function Fidelity() {
  return (
    <Layout>
      <section className="bg-muted/30 border-b border-border py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl font-bold text-foreground">Programme fidélité</h1>
          <p className="text-muted-foreground mt-2">Gagnez des avantages en explorant les clubs.</p>
        </div>
      </section>
      <section className="container mx-auto px-4 py-12">
        <div className="text-center py-16 border border-dashed border-border rounded-2xl bg-muted/30">
          <Gift className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Le programme fidélité sera bientôt disponible.</p>
        </div>
      </section>
    </Layout>
  );
}
