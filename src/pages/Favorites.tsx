import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { Heart, MapPin, Loader2 } from 'lucide-react';

const mockFavorites: { id: string; name: string; city?: string; discipline?: string }[] = [];

export default function Favorites() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-display text-2xl font-bold mb-4">Mes clubs</h1>
          <p className="text-muted-foreground mb-6">Connectez-vous pour sauvegarder vos clubs favoris.</p>
          <Button asChild>
            <Link to="/compte/connexion/">Se connecter</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="container mx-auto px-4 py-12">
        <h1 className="font-display text-3xl font-bold mb-6">Mes clubs favoris</h1>
        {mockFavorites.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border rounded-2xl bg-muted/30">
            <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Vous n'avez pas encore de club favori.</p>
            <Button className="mt-4" asChild>
              <Link to="/clubs/">Découvrir des clubs</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockFavorites.map((club) => (
              <Link
                key={club.id}
                to={`/club/${club.id}`}
                className="p-5 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors"
              >
                <h2 className="font-display font-semibold">{club.name}</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <MapPin className="w-4 h-4" />
                  {club.city || 'France'}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}
