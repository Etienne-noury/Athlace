import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { User, Heart, LogIn, UserPlus } from 'lucide-react';

export default function Compte() {
  const { user } = useAuth();

  return (
    <Layout>
      <section className="bg-muted/30 border-b border-border py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Espace membre</h1>
          <p className="text-muted-foreground text-lg">
            {user ? 'Bienvenue sur votre espace personnel.' : 'Connectez-vous pour sauvegarder vos clubs et recevoir des recommandations.'}
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        {user ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              to="/compte/profil/"
              className="p-6 bg-card border border-border rounded-2xl hover:border-primary/50 transition-colors"
            >
              <User className="w-8 h-8 text-primary mb-4" />
              <h2 className="font-display text-lg font-semibold">Mon profil</h2>
              <p className="text-sm text-muted-foreground mt-1">Gérez vos informations personnelles.</p>
            </Link>
            <Link
              to="/compte/mes-clubs/"
              className="p-6 bg-card border border-border rounded-2xl hover:border-primary/50 transition-colors"
            >
              <Heart className="w-8 h-8 text-primary mb-4" />
              <h2 className="font-display text-lg font-semibold">Mes clubs</h2>
              <p className="text-sm text-muted-foreground mt-1">Retrouvez vos clubs favoris.</p>
            </Link>
          </div>
        ) : (
          <div className="max-w-md mx-auto text-center bg-card border border-border rounded-2xl p-8">
            <h2 className="font-display text-xl font-semibold mb-4">Rejoindre Athlace</h2>
            <div className="flex flex-col gap-3">
              <Button asChild>
                <Link to="/compte/connexion/"><LogIn className="w-4 h-4 mr-2" /> Se connecter</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/compte/inscription/"><UserPlus className="w-4 h-4 mr-2" /> Créer un compte</Link>
              </Button>
            </div>
          </div>
        )}
      </section>
    </Layout>
  );
}
