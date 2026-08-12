import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Heart, MapPin, Loader2, Trash2 } from 'lucide-react';

interface FavoriteClub {
  favoriteId: string;
  clubId: string;
  name: string;
  city: string | null;
  discipline: string | null;
}

export default function Favorites() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ['favorites', user?.id],
    enabled: !!user,
    queryFn: async (): Promise<FavoriteClub[]> => {
      const { data: rows, error } = await supabase
        .from('favorites')
        .select('id, club_id')
        .order('created_at', { ascending: false });
      if (error) throw error;
      if (!rows?.length) return [];

      const ids = rows.map((r) => r.club_id);
      const { data: clubs } = await supabase
        .from('clubs_enriched')
        .select('id, name, city, discipline')
        .in('id', ids);

      return rows.map((r) => {
        const club = clubs?.find((c) => c.id === r.club_id);
        return {
          favoriteId: r.id,
          clubId: r.club_id,
          name: club?.name ?? 'Club',
          city: club?.city ?? null,
          discipline: club?.discipline ?? null,
        };
      });
    },
  });

  const removeFavorite = async (favoriteId: string) => {
    const { error } = await supabase.from('favorites').delete().eq('id', favoriteId);
    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
      return;
    }
    queryClient.invalidateQueries({ queryKey: ['favorites', user?.id] });
    toast({ title: 'Club retiré de vos favoris' });
  };

  return (
    <Layout>
      <section className="container mx-auto px-4 py-12">
        <h1 className="font-display text-3xl font-bold mb-6">Mes clubs favoris</h1>

        {isLoading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border rounded-2xl bg-muted/30">
            <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Vous n'avez pas encore de club favori.</p>
            <Button className="mt-4" asChild>
              <Link to="/clubs/">Découvrir des clubs</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {favorites.map((club) => (
              <div
                key={club.favoriteId}
                className="p-5 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors flex items-start justify-between gap-4"
              >
                <Link to={`/club/${club.clubId}`} className="flex-1">
                  <h2 className="font-display font-semibold">{club.name}</h2>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <MapPin className="w-4 h-4" />
                    {club.city || 'France'}
                  </div>
                  {club.discipline && (
                    <span className="inline-block mt-2 text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                      {club.discipline}
                    </span>
                  )}
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Retirer ${club.name} des favoris`}
                  onClick={() => removeFavorite(club.favoriteId)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}
