import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Users, BarChart3, Megaphone } from 'lucide-react';

export default function ClubsB2B() {
  return (
    <Layout>
      <section className="bg-muted/30 border-b border-border py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-2">
            Athlace pour les clubs
          </h1>
          <p className="text-muted-foreground text-lg">
            Augmentez votre visibilité, gérez votre fiche et attirez de nouveaux adhérents.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="p-6">
              <Users className="w-10 h-10 text-primary mb-4" />
              <h2 className="font-display text-xl font-semibold">Fiche complète</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Photos, horaires, tarifs, disciplines proposées : présentez votre club en détail.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <BarChart3 className="w-10 h-10 text-primary mb-4" />
              <h2 className="font-display text-xl font-semibold">Statistiques</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Suivez les visites, les demandes et l'engagement autour de votre club.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <Megaphone className="w-10 h-10 text-primary mb-4" />
              <h2 className="font-display text-xl font-semibold">Visibilité ciblée</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Apparaissez dans les recherches par sport, ville et niveau de pratique.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-2xl mx-auto bg-card border border-border rounded-2xl p-8 text-center">
          <h2 className="font-display text-2xl font-semibold mb-4">Réclamez votre club</h2>
          <ul className="text-left space-y-2 mb-6 max-w-md mx-auto">
            <li className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-primary" /> Mise à jour gratuite des informations
            </li>
            <li className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-primary" /> Réponse sous 48h
            </li>
            <li className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-primary" /> Aucun engagement
            </li>
          </ul>
          <Button asChild>
            <Link to="/compte/mon-club/">Créer ma fiche club</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
