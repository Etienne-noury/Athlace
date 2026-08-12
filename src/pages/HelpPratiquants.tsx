import { Layout } from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, Map, Heart, HelpCircle } from 'lucide-react';

export default function HelpPratiquants() {
  return (
    <Layout>
      <section className="bg-muted/30 border-b border-border py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl font-bold text-foreground">Aide pratiquants</h1>
          <p className="text-muted-foreground mt-2">Tout ce qu'il faut savoir pour bien utiliser Athlace.</p>
        </div>
      </section>
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-card border border-border rounded-2xl p-6">
            <Search className="w-8 h-8 text-primary mb-4" />
            <h2 className="font-display text-xl font-semibold">Rechercher un club</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Utilisez le moteur de recherche pour filtrer par sport, ville ou région. Vous pouvez aussi consulter les pages dédiées par sport ou par géographie.
            </p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-6">
            <Map className="w-8 h-8 text-primary mb-4" />
            <h2 className="font-display text-xl font-semibold">Utiliser la carte</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Zoomez sur votre zone et découvrez les clubs à proximité. Cliquez sur un marqueur pour accéder à la fiche du club.
            </p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-6">
            <Heart className="w-8 h-8 text-primary mb-4" />
            <h2 className="font-display text-xl font-semibold">Sauvegarder vos clubs</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Connectez-vous pour ajouter des clubs à vos favoris et les retrouver dans votre espace membre.
            </p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-6">
            <HelpCircle className="w-8 h-8 text-primary mb-4" />
            <h2 className="font-display text-xl font-semibold">Besoin d'aide supplémentaire ?</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Consultez la FAQ ou contactez notre équipe pour une réponse personnalisée.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          <Button asChild variant="outline">
            <Link to="/aide/faq/">Voir la FAQ</Link>
          </Button>
          <Button asChild>
            <Link to="/aide/contact/">Nous contacter</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
