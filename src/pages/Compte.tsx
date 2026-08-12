import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { User, Heart, LogIn, UserPlus, Bell, Shield, Award } from 'lucide-react';

export default function Compte() {
  const { user, profile } = useAuth();

  const { data: favoritesCount = 0 } = useQuery({
    queryKey: ['favorites-count', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { count } = await supabase.from('favorites').select('id', { count: 'exact', head: true });
      return count ?? 0;
    },
  });

  const cards = [
    { to: '/compte/profil/', icon: User, title: 'Mon profil', desc: 'Gérez vos informations personnelles.' },
    { to: '/compte/mes-clubs/', icon: Heart, title: 'Mes clubs', desc: `${favoritesCount} club${favoritesCount > 1 ? 's' : ''} en favori.` },
    { to: '/compte/notifications/', icon: Bell, title: 'Notifications', desc: 'Gérez vos alertes et recommandations.' },
    { to: '/compte/mon-club/', icon: Shield, title: 'Mon club', desc: 'Réclamez la fiche de votre club.' },
    { to: '/compte/fidelite/', icon: Award, title: 'Fidélité', desc: 'Bientôt disponible.' },
  ];

  return (
    <Layout>
      <section className="bg-muted/30 border-b border-border py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Espace membre</h1>
          <p className="text-muted-foreground text-lg">
            {user
              ? `Bienvenue ${profile?.full_name || user.email?.split('@')[0]}, voici votre espace personnel.`
              : 'Connectez-vous pour sauvegarder vos clubs et recevoir des recommandations.'}
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        {user ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card) => (
              <Link
                key={card.to}
                to={card.to}
                className="p-6 bg-card border border-border rounded-2xl hover:border-primary/50 transition-colors"
              >
                <card.icon className="w-8 h-8 text-primary mb-4" />
                <h2 className="font-display text-lg font-semibold">{card.title}</h2>
                <p className="text-sm text-muted-foreground mt-1">{card.desc}</p>
              </Link>
            ))}
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
