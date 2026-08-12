import { Layout } from '@/components/layout/Layout';

export default function Mission() {
  return (
    <Layout>
      <section className="bg-muted/30 border-b border-border py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl font-bold text-foreground">Notre mission</h1>
        </div>
      </section>
      <section className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="prose prose-slate max-w-none">
          <h2>Démocratiser l'accès au sport en club</h2>
          <p>
            Trouver un club adapté à son niveau, son budget et sa localisation peut être compliqué. Athlace simplifie cette recherche en proposant un moteur de recherche intelligent, une carte interactive et des fiches normalisées pour chaque club.
          </p>
          <h2>Soutenir les clubs français</h2>
          <p>
            Les clubs sont le cœur de l'écosystème sportif. Athlace leur offre une vitrine numérique pour mieux se faire connaître, attirer de nouveaux adhérents et communiquer leurs offres.
          </p>
          <h2>Un service transparent et fiable</h2>
          <p>
            Les données sont sourcées auprès d'annuaires publics et fédéraux. Les clubs peuvent réclamer leur fiche et la mettre à jour. Les utilisateurs gardent le contrôle de leurs données personnelles.
          </p>
        </div>
      </section>
    </Layout>
  );
}
