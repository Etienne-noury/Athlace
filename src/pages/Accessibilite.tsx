import { Layout } from '@/components/layout/Layout';

export default function Accessibilite() {
  return (
    <Layout>
      <section className="bg-muted/30 border-b border-border py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl font-bold text-foreground">Accessibilité</h1>
        </div>
      </section>
      <section className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="prose prose-slate max-w-none">
          <h2>Engagement</h2>
          <p>
            Athlace s'engage à rendre son site accessible au plus grand nombre, conformément aux bonnes pratiques du RGAA (Référentiel Général d'Amélioration de l'Accessibilité). Nous travaillons continuellement à améliorer le contraste, la navigation clavier et la compatibilité avec les lecteurs d'écran.
          </p>

          <h2>État de conformité</h2>
          <p>
            Un audit de conformité complète est en cours. En attendant, nous avons mis en place les mesures suivantes : structure sémantique HTML5, textes alternatifs sur les images, contrastes renforcés, et formulaires accessibles.
          </p>

          <h2>Signaler un problème</h2>
          <p>
            Si vous rencontrez une difficulté d'accès, contactez-nous à accessibilite@athlace.fr en décrivant le problème rencontré et la page concernée. Nous vous répondrons dans les meilleurs délais.
          </p>
        </div>
      </section>
    </Layout>
  );
}
