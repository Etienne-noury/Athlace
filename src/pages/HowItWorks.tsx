import { Layout } from '@/components/layout/Layout';
import { Search, MapPin, Heart, Building2 } from 'lucide-react';

const STEPS = [
  {
    icon: Search,
    title: "Recherchez",
    description: "Indiquez un sport, une ville ou un mot-clé. Notre moteur de recherche explore les clubs enregistrés."
  },
  {
    icon: MapPin,
    title: "Comparez",
    description: "Consultez les fiches détaillées : localisation, discipline, tarifs indicatifs, horaires et informations de contact."
  },
  {
    icon: Heart,
    title: "Sauvegardez",
    description: "Créez un compte gratuit pour mettre de côté vos clubs préférés et les retrouver facilement."
  },
  {
    icon: Building2,
    title: "Contactez le club",
    description: "Rejoignez le club directement via son site web ou ses coordonnées. Athlace facilite le premier contact."
  }
];

export default function HowItWorks() {
  return (
    <Layout>
      <section className="bg-muted/30 border-b border-border py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl font-bold text-foreground">Comment ça marche ?</h1>
          <p className="text-muted-foreground mt-2">Quatre étapes simples pour trouver votre club idéal.</p>
        </div>
      </section>
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {STEPS.map((step, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <step.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="text-sm font-bold text-primary mb-2">Étape {i + 1}</div>
              <h2 className="font-display text-xl font-semibold mb-2">{step.title}</h2>
              <p className="text-muted-foreground text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
