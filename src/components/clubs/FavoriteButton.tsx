import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Heart, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FavoriteButtonProps {
  clubId: string;
  className?: string;
  /** Affiche le libellé à côté du cœur */
  withLabel?: boolean;
}

export function FavoriteButton({ clubId, className, withLabel = false }: FavoriteButtonProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [pending, setPending] = useState(false);

  const { data: favoriteIds = [] } = useQuery({
    queryKey: ['favorite-ids', user?.id],
    enabled: !!user,
    queryFn: async (): Promise<string[]> => {
      const { data, error } = await supabase.from('favorites').select('club_id');
      if (error) throw error;
      return (data ?? []).map((r) => r.club_id);
    },
  });

  const isFavorite = favoriteIds.includes(clubId);

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast({
        title: 'Connexion requise',
        description: 'Connectez-vous pour enregistrer vos clubs favoris.',
      });
      navigate('/compte/connexion/');
      return;
    }

    setPending(true);
    try {
      if (isFavorite) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('club_id', clubId);
        if (error) throw error;
        toast({ title: 'Club retiré de vos favoris' });
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({ user_id: user.id, club_id: clubId });
        if (error) throw error;
        toast({ title: 'Club ajouté à vos favoris' });
      }
      queryClient.invalidateQueries({ queryKey: ['favorite-ids', user.id] });
      queryClient.invalidateQueries({ queryKey: ['favorites', user.id] });
    } catch (err) {
      toast({
        title: 'Erreur',
        description: err instanceof Error ? err.message : 'Action impossible',
        variant: 'destructive',
      });
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      className={cn(
        'inline-flex items-center gap-2 rounded-full bg-background/90 backdrop-blur-sm border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-60',
        className
      )}
    >
      {pending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Heart className={cn('w-4 h-4', isFavorite ? 'fill-destructive text-destructive' : 'text-muted-foreground')} />
      )}
      {withLabel && <span>{isFavorite ? 'Enregistré' : 'Ajouter aux favoris'}</span>}
    </button>
  );
}
