import { Layout } from '@/components/layout/Layout';
import { Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Application() {
  return (
    <Layout>
      <section className="bg-muted/30 border-b border-border py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl font-bold text-foreground">Application mobile</h1>
          <p className="text-muted-foreground mt-2">Trouvez un club depuis votre smartphone.</p>
        </div>
      </section>
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center bg-card border border-border rounded-2xl p-8">
          <Smartphone className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="font-display text-2xl font-semibold mb-2">Bientôt disponible</h2>
          <p className="text-muted-foreground mb-6">
            L'application Athlace pour iOS et Android est en cours de développement. Inscrivez-vous pour être informé du lancement.
          </p>
          <Button>S'inscrire à la liste d'attente</Button>
        </div>
      </section>
    </Layout>
  );
}
